from fastapi import APIRouter, HTTPException, Depends
from ...common.config import settings
from fastapi.security.api_key import APIKey, APIKeyHeader
from typing import Optional
from ...features.topic.models import SubmissionEvaluationV2, TopicSubmission
from ...features.topic.utils import evaluate_submission_v2
from sqlalchemy.orm import Session
from ...common.dependencies import get_db, is_admin
from ...features.user.models import User
from ...features.subscription.models import UserCredits


api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
admin_router = APIRouter(prefix="/admin", tags=["admin"])

async def get_api_key(api_key_header: Optional[str] = Depends(api_key_header)) -> APIKey:
    print(f"API Key: {api_key_header}")
    if not api_key_header or api_key_header != settings.ADMIN_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Could not validate API Key"
        )
    return api_key_header

@admin_router.post("/migrate-evaluations")
async def migrate_evaluations(
    api_key: APIKey = Depends(get_api_key),
    db: Session = Depends(get_db)
):
    try:
        # Get all submissions
        submissions = db.query(TopicSubmission).all()
        migrated_count = 0
        for submission in submissions:
            existing_eval = db.query(SubmissionEvaluationV2).filter(
                SubmissionEvaluationV2.submission_id == submission.id
            ).first()
            
            if existing_eval:
                evaluation = evaluate_submission_v2(submission)
                existing_eval.evaluation = evaluation.evaluation
                migrated_count += 1
            else:
                evaluation = evaluate_submission_v2(submission)
                db.add(evaluation)
                migrated_count += 1
        
        db.commit()
        
        return {"message": f"Successfully migrated {migrated_count} evaluations"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error during migration: {str(e)}"
        )

@admin_router.get("/users")
async def get_all_users(db: Session = Depends(get_db), is_admin: bool = Depends(is_admin)):
    return db.query(User).all()


@admin_router.post("/users/{user_id}/credits")
async def add_credits_to_user(user_id: str, credits: int, db: Session = Depends(get_db), is_admin: bool = Depends(is_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user_credits = db.query(UserCredits).filter(UserCredits.user_id == user_id).first()
    if not user_credits:
        raise HTTPException(status_code=404, detail="User credits not found")
    user_credits.credits_allowance += credits
    db.commit()
    return {"message": f"Successfully added {credits} credits to user {user_id}"}

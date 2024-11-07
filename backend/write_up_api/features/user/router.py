from fastapi import APIRouter, Depends
from sqlmodel import Session

from ...features.subscription.models import UserCredits
from ...features.subscription.queries import get_user_credits

from .models import User
from .dto import UserProfileUpdate, UserProfileResponse
from .queries import update_user_profile, get_user_profile, activate_user
from ...common.dependencies import get_current_user, get_db

user_router: APIRouter = APIRouter(tags=["user"])

@user_router.put("/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    user: User = Depends(get_current_user)
) -> UserProfileResponse:
    profile = update_user_profile(user.id, profile_data.model_dump())
    if not user.is_active:
        activate_user(user.id)
    return UserProfileResponse(
        user_id=profile.user_id,
        desired_band_score=profile.desired_band_score,
        target_exam=profile.target_exam,
        age=profile.age,
        education=profile.education,
        profile_metadata=profile.profile_metadata
    )


@user_router.get("/profile")
async def get_profile(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> UserProfileResponse:
    profile = get_user_profile(user.id)
    credits: UserCredits = get_user_credits(user.id, db)
    return UserProfileResponse(
        user_id=profile.user_id,
        desired_band_score=profile.desired_band_score,
        target_exam=profile.target_exam,
        age=profile.age,
        education=profile.education,
        profile_metadata=profile.profile_metadata,
        credits_allowance=credits.credits_allowance,
        credits_spent=credits.credits_spent
    )

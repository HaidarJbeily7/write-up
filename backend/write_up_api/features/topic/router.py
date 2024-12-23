from fastapi import APIRouter, HTTPException, Path, Query, Depends
from fastapi_pagination import Page, Params
from typing import Annotated, Optional

from ...features.subscription.queries import increment_credits_spent
from .utils import evaluate_submission
from ...common.dependencies import check_user_credits, get_current_user
from ...features.user.models import User
from .models import (
    Topic,
    ExamType,
    TopicSubmission,
    TopicSubmissionRequest,
    SubmissionHistory,
    TopicSubmissionResponse,
    TopicSubmissionWithTopicAndEvaluation,
)
from .queries import (
    add_topic_submission,
    get_topic_by_id,
    get_filtered_topics_paginated,
    create_or_update_topic_submission,
    add_submission_evaluation,
    get_user_topic_submissions,
    get_user_topic_submission,
    get_user_submission_history,
)

topic_router_v1: APIRouter = APIRouter(tags=["topic_v1"])


@topic_router_v1.get("/", response_model=Page[Topic])
async def get_topics(
    exam_type: Optional[ExamType] = Query(None),
    category: Optional[str] = Query(None),
    difficulty_level: Optional[int] = Query(None, ge=1, le=10),
    params: Params = Depends(),
) -> Page[Topic]:
    return get_filtered_topics_paginated(
        exam_type=exam_type,
        category=category,
        difficulty_level=difficulty_level,
        params=params,
    )

@topic_router_v1.get("/submissions", response_model=list[SubmissionHistory])
async def get_user_submission_history_endpoint(
    user: User = Depends(get_current_user)
) -> list[SubmissionHistory]:
    try:
        return get_user_submission_history(user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error retrieving topic history")


@topic_router_v1.get("/{topic_id}", response_model=Topic)
async def get_topic(topic_id: str) -> Topic:
    topic = get_topic_by_id(topic_id)
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@topic_router_v1.post("/{topic_id}/answers", response_model=TopicSubmissionResponse)
async def submit_answer(
    topic_id: Annotated[str, Path(description="The ID of the topic to submit an answer for")],
    data: TopicSubmissionRequest,
    user: User = Depends(get_current_user),
    check_user_credits: bool = Depends(check_user_credits),
) -> TopicSubmissionResponse:
    try:

        # Verify topic exists
        topic = get_topic_by_id(topic_id)
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

        answer = data.answer
        if not answer:
            raise HTTPException(
                status_code=400, detail="Answer is required in the request body")

        topic_submission = TopicSubmission(
            topic_id=topic_id, answer=answer, user_id=user.id)
        
        add_topic_submission(topic_submission)

        submission_evaluation = evaluate_submission(topic_submission)
        

        if submission_evaluation is None:
            raise HTTPException(status_code=500, detail="Failed to evaluate submission")

        add_submission_evaluation(submission_evaluation)

        response = TopicSubmissionResponse(id=topic_submission.id, topic_id=topic_id, answer=answer,
                                           created_at=topic_submission.created_at, updated_at=topic_submission.updated_at,
                                           evaluation=submission_evaluation)
        
        from ...common.db_engine import db_engine
        from sqlmodel import Session
        with Session(db_engine) as db_session:
            # Increment credits spent
            increment_credits_spent(user.id, db_session)

        return response

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=500, detail=str(e))

@topic_router_v1.get("/{topic_id}/submissions", response_model=list[TopicSubmissionWithTopicAndEvaluation])
async def get_topic_submissions(
    topic_id: Annotated[str, Path(description="The ID of the topic to get submissions for")],
    user: User = Depends(get_current_user)
) -> list[TopicSubmissionWithTopicAndEvaluation]:
    submissions = get_user_topic_submissions(topic_id, user.id)
    if submissions is None:
        return []
    return submissions

@topic_router_v1.get("/{topic_id}/submissions/{submission_id}", response_model=TopicSubmissionWithTopicAndEvaluation)
async def get_topic_submission(
    topic_id: Annotated[str, Path(description="The ID of the topic")],
    submission_id: Annotated[str, Path(description="The ID of the submission")],
    user: User = Depends(get_current_user)
) -> TopicSubmissionWithTopicAndEvaluation:
    submission = get_user_topic_submission(topic_id, submission_id, user.id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission

@topic_router_v1.put("/{topic_id}/submissions/{submission_id}", response_model=TopicSubmissionResponse)
async def update_topic_submission(
    topic_id: Annotated[str, Path(description="The ID of the topic")],
    submission_id: Annotated[str, Path(description="The ID of the submission")],
    submission_request: TopicSubmissionRequest,
    user: User = Depends(get_current_user)
) -> TopicSubmissionResponse:
    try:
        topic = get_topic_by_id(topic_id)
        if topic is None:
            raise HTTPException(status_code=404, detail="Topic not found")
        topic_submission = TopicSubmission(
            id=submission_id,
            topic_id=topic_id,
            user_id=user.id,
            answer=submission_request.answer
        )

        updated_submission = create_or_update_topic_submission(topic_submission)

        return TopicSubmissionResponse(
            id=updated_submission.id,
            topic_id=topic_id,
            answer=updated_submission.answer,
            created_at=updated_submission.created_at,
            updated_at=updated_submission.updated_at,
            evaluation=None
        )

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=500, detail=str(e))

@topic_router_v1.post("/{topic_id}/submissions/{submission_id}/evaluate", response_model=TopicSubmissionResponse)
async def evaluate_topic_submission(
    topic_id: Annotated[str, Path(description="The ID of the topic")],
    submission_id: Annotated[str, Path(description="The ID of the submission")],
    user: User = Depends(get_current_user),
    check_user_credits: bool = Depends(check_user_credits),
) -> TopicSubmissionResponse:
    try:
        # Get the submission
        topic_submission = get_user_topic_submission(topic_id, submission_id, user.id)
        if topic_submission is None:
            raise HTTPException(status_code=404, detail="Submission not found")

        # Create evaluation
        submission_evaluation = evaluate_submission(topic_submission)
        if submission_evaluation is None:
            raise HTTPException(status_code=500, detail="Failed to evaluate submission")

        add_submission_evaluation(submission_evaluation)

        response = TopicSubmissionResponse(id=topic_submission.id, topic_id=topic_id, answer=topic_submission.answer,
                                           created_at=topic_submission.created_at, updated_at=topic_submission.updated_at,
                                           evaluation=submission_evaluation)
        
        from ...common.db_engine import db_engine
        from sqlmodel import Session
        with Session(db_engine) as db_session:
            # Increment credits spent
            increment_credits_spent(user.id, db_session)
        
        return response
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        else:
            raise HTTPException(status_code=500, detail=str(e))

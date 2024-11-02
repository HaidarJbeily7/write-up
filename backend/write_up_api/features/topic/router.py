from fastapi import APIRouter, HTTPException, Path, Query, Depends
from fastapi_pagination import Page, Params
from typing import Annotated, Optional

from .utils import evaluate_submission
from ...common.dependencies import get_current_user
from ...features.user.models import User
from .models import Topic, ExamType, TopicSubmission, TopicSubmissionRequest, TopicSubmissionResponse
from .queries import get_filtered_topics_paginated, get_topic_by_id

topic_router: APIRouter = APIRouter(tags=["topic"])


@topic_router.get("/", response_model=Page[Topic])
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


@topic_router.get("/{topic_id}", response_model=Topic)
async def get_topic(topic_id: str) -> Topic:
    topic = get_topic_by_id(topic_id)
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@topic_router.post("/{topic_id}/answers", response_model=TopicSubmissionResponse)
async def submit_answer(
    topic_id: Annotated[str, Path(description="The ID of the topic to submit an answer for")],
    data: TopicSubmissionRequest,
    user: User = Depends(get_current_user),
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
        
        evaluation = evaluate_submission(topic_submission)
        
        if evaluation is None:
            raise HTTPException(status_code=500, detail="Failed to evaluate submission")

        response = TopicSubmissionResponse(id=topic_submission.id, topic_id=topic_id, answer=answer,
                                           created_at=topic_submission.created_at, updated_at=topic_submission.updated_at,
                                           evaluation=evaluation)
        return response

    except Exception as e:
        print(f"Something went wrong: {e}")
        raise

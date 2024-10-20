from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi_pagination import Page, Params
from typing import List, Optional
from .models import Topic, ExamType
from .queries import get_filtered_topics, get_topic_by_id

topic_router: APIRouter = APIRouter(tags=["topic"])


@topic_router.get("/", response_model=Page[Topic])
async def get_topics(
    exam_type: Optional[ExamType] = Query(None),
    category: Optional[str] = Query(None),
    difficulty_level: Optional[int] = Query(None, ge=1, le=10),
    params: Params = Depends(),
) -> Page[Topic]:
    return get_filtered_topics(exam_type, category, difficulty_level, params)


@topic_router.get("/{topic_id}", response_model=Topic)
async def get_topic(topic_id: str) -> Topic:
    topic = get_topic_by_id(topic_id)
    if topic is None:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic

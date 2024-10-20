from fastapi import APIRouter, Query, Depends
from fastapi_pagination import Page, Params
from typing import List, Optional
from .models import Topic, ExamType
from .queries import get_filtered_topics

topic_router: APIRouter = APIRouter(tags=["topic"])


@topic_router.get("/", response_model=Page[Topic])
async def get_topics(
    exam_type: Optional[ExamType] = Query(None),
    category: Optional[str] = Query(None),
    difficulty_level: Optional[int] = Query(None, ge=1, le=10),
    params: Params = Depends(),
) -> Page[Topic]:
    return get_filtered_topics(exam_type, category, difficulty_level, params)


from uuid import UUID
from sqlmodel import Session, select
from typing import List, Optional
from .models import Topic, ExamType
from ...common.db_engine import db_engine
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Params


def get_filtered_topics(
    exam_type: Optional[ExamType] = None,
    category: Optional[str] = None,
    difficulty_level: Optional[int] = None,
    params: Params = Params()
) -> List[Topic]:
    with Session(db_engine) as session:
        query = select(Topic)

        if exam_type:
            query = query.where(Topic.exam_type == exam_type)
        if category:
            query = query.where(Topic.category == category)
        if difficulty_level:
            query = query.where(Topic.difficulty_level == difficulty_level)

        return paginate(session, query, params=params)


def get_topic_by_id(topic_id: str) -> Optional[Topic]:
    with Session(db_engine) as session:
        topic = session.get(Topic, topic_id)
        return topic

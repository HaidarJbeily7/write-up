from sqlmodel import Session, select
from typing import List, Optional
import logging
from .models import Topic, ExamType, TopicSubmission
from ...common.db_engine import db_engine
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Params


logger = logging.getLogger(__name__)


def get_filtered_topics(
    exam_type: Optional[ExamType] = None,
    category: Optional[str] = None,
    difficulty_level: Optional[int] = None,
    paginate: bool = True,
    params: Params = Params()
) -> List[Topic]:
    try:
        with Session(db_engine) as session:
            query = select(Topic)

            if exam_type:
                query = query.where(Topic.exam_type == exam_type)
            if category:
                query = query.where(Topic.category == category)
            if difficulty_level:
                query = query.where(Topic.difficulty_level == difficulty_level)

            topics = paginate(session, query, params=params) if paginate else session.exec(query).all()

            return topics
    except Exception as e:
        logger.error(f"Database error while getting filtered topics: {e}")
        raise

def get_topic_by_id(topic_id: str) -> Optional[Topic]:
    try:
        with Session(db_engine) as session:
            topic = session.get(Topic, topic_id)
            return topic
    except Exception as e:
        logger.error(f"Database error while getting topic by id: {e}")
        raise

def create_topic_submission(topic_submission: TopicSubmission) -> TopicSubmission:
    try:
        with Session(db_engine) as session:
            session.add(topic_submission)
            session.commit()
            session.refresh(topic_submission)
            return topic_submission
    except Exception as e:
        logger.error(f"Database error while creating new submission: {e}")
        raise

def get_topic_from_submission(submission: TopicSubmission) -> Topic:
    with Session(db_engine) as session:
        topic = session.exec(select(Topic).where(
            Topic.id == submission.topic_id)).first()
        if not topic:
            raise ValueError("Topic not found")
        return topic

from sqlmodel import Session, select
from typing import List, Optional
import logging
import logging
from .models import SubmissionEvaluation, Topic, ExamType, TopicSubmission, TopicSubmissionWithTopicAndEvaluation, SubmissionHistory, TopicSubmissionWithEvaluation
from ...common.db_engine import db_engine
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination import Params


logger = logging.getLogger(__name__)

def get_all_topics() -> List[Topic]:
    try:
        with Session(db_engine) as session:
            return session.exec(select(Topic)).all()
    except Exception as e:
        logger.error(f"Database error while getting all topics: {e}")
        raise


def get_filtering_query(
    exam_type: Optional[ExamType] = None,
    category: Optional[str] = None,
    task_type: Optional[str] = None,
    difficulty_level: Optional[int] = None
):
    query = select(Topic)

    if exam_type:
        query = query.where(Topic.exam_type == exam_type)
    if category:
        query = query.where(Topic.category == category)
    if task_type:
        pass
        # FIXME: This is a hack to get the task type from the topic metadata
        # query = query.where(Topic.topic_metadata == f'{{"task_type": "{task_type}"}}')
    if difficulty_level:
        query = query.where(Topic.difficulty_level == difficulty_level)

    return query



def get_filtered_topics(
    exam_type: Optional[ExamType] = None,
    category: Optional[str] = None,
    task_type: Optional[str] = None,
    difficulty_level: Optional[int] = None,
) -> List[Topic]:
    try:
        with Session(db_engine) as session:
            query = get_filtering_query(
                exam_type, category, task_type, difficulty_level)

            topics = session.exec(query).all()
            return topics
    except Exception as e:
        logger.error(f"Database error while getting filtered topics: {e}")
        raise

def get_filtered_topics_paginated(
    exam_type: Optional[ExamType] = None,
    category: Optional[str] = None,
    task_type: Optional[str] = None,
    difficulty_level: Optional[int] = None,
    params: Params = Params(),
) -> List[Topic]:
    try:
        with Session(db_engine) as session:
            query = get_filtering_query(exam_type, category, task_type, difficulty_level)

            topics = paginate(session, query, params=params)
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

def add_topic_submission(topic_submission: TopicSubmission) -> TopicSubmission:
    try:
        with Session(db_engine) as session:
            session.add(topic_submission)
            session.commit()
            session.refresh(topic_submission)
            return topic_submission
    except Exception as e:
        logger.error(f"Database error while creating new submission: {e}")
        raise

def create_or_update_topic_submission(topic_submission: TopicSubmission) -> TopicSubmission:
    try:
        with Session(db_engine) as session:
            existing_submission = session.exec(
                select(TopicSubmission).where(
                    TopicSubmission.id == topic_submission.id
                )
            ).first()

            if existing_submission:
                existing_submission.answer = topic_submission.answer
                session.add(existing_submission)
                session.commit()
                session.refresh(existing_submission)
                return existing_submission
            else:
                session.add(topic_submission)
                session.commit()
                session.refresh(topic_submission)
                return topic_submission

    except Exception as e:
        logger.error(f"Database error while creating/updating submission: {e}")
        raise


def get_topic_from_submission(submission: TopicSubmission) -> Topic:
    try:
        with Session(db_engine) as session:
            topic = session.exec(select(Topic).where(
                Topic.id == submission.topic_id)).first()
            if not topic:
                raise ValueError("Topic not found")
            return topic
    except Exception as e:
        logger.error(f"Database error while getting topic from submission: {e}")
        raise

def add_submission_evaluation(submission_evaluation: SubmissionEvaluation) -> SubmissionEvaluation:
    try:
        with Session(db_engine) as session:
            session.add(submission_evaluation)
            session.commit()
            session.refresh(submission_evaluation)
            return submission_evaluation    
    except Exception as e:
        logger.error(f"Database error while adding submission evaluation: {e}")
        raise

def add_new_topics(topics: List[Topic]) -> None:
    try:
        with Session(db_engine) as session:
            session.add_all(topics)
            session.commit()
    except Exception as e:
        logger.error(f"Database error while adding new topics: {e}")
        raise



def get_user_topic_submissions(topic_id: str, user_id: str) -> list[TopicSubmissionWithTopicAndEvaluation]:
    try:
        with Session(db_engine) as session:
            statement = select(TopicSubmission, Topic, SubmissionEvaluation).join(Topic, TopicSubmission.topic_id == Topic.id).outerjoin(SubmissionEvaluation, TopicSubmission.id == SubmissionEvaluation.submission_id).where(
                TopicSubmission.topic_id == topic_id,
                TopicSubmission.user_id == user_id
            )
            results = session.exec(statement).all()
            submissions = []
            for submission, topic, evaluation in results:
                submissions.append(TopicSubmissionWithTopicAndEvaluation(
                    id=submission.id,
                    topic_id=submission.topic_id,
                    answer=submission.answer,
                    created_at=submission.created_at,
                    updated_at=submission.updated_at,
                    evaluation=evaluation,
                    topic=topic
                ))
            return submissions
    except Exception as e:
        logger.error(f"Database error while getting user topic submissions: {e}")
        raise
    
def get_user_topic_submission(topic_id: str, submission_id: str, user_id: str) -> TopicSubmissionWithTopicAndEvaluation:
    try:
        with Session(db_engine) as session:
            statement = select(TopicSubmission, Topic, SubmissionEvaluation).join(Topic, TopicSubmission.topic_id == Topic.id).outerjoin(SubmissionEvaluation, TopicSubmission.id == SubmissionEvaluation.submission_id).where(
                TopicSubmission.topic_id == topic_id,
                TopicSubmission.id == submission_id,
                TopicSubmission.user_id == user_id
            )
            result = session.exec(statement).first()
            if not result:
                return None
            submission, topic, evaluation = result
            return TopicSubmissionWithTopicAndEvaluation(
                id=submission.id,
                topic_id=submission.topic_id,
                answer=submission.answer,
                created_at=submission.created_at,
                updated_at=submission.updated_at,
                evaluation=evaluation,
                topic=topic
            )
    except Exception as e:
        logger.error(f"Database error while getting user topic submission: {e}")
        raise
    
    
def get_user_submission_history(user_id: str) -> list[SubmissionHistory]:
    try:
        with Session(db_engine) as session:
            # Query that joins topics with submissions and evaluations for this user
            statement = select(TopicSubmission, Topic, SubmissionEvaluation)\
                .join(Topic, TopicSubmission.topic_id == Topic.id)\
                .outerjoin(SubmissionEvaluation, TopicSubmission.id == SubmissionEvaluation.submission_id)\
                .where(TopicSubmission.user_id == user_id)\
                .order_by(TopicSubmission.created_at.desc())

            results = session.exec(statement).all()
            
            submissions = []
            # Group submissions by topic_id
            topic_submissions = {}
            for submission, topic, evaluation in results:
                if topic.id not in topic_submissions:
                    topic_submissions[topic.id] = {
                        'topic': topic,
                        'submissions': []
                    }
                topic_submissions[topic.id]['submissions'].append(
                    TopicSubmissionWithEvaluation(
                        id=submission.id,
                        topic_id=submission.topic_id,
                        answer=submission.answer,
                        created_at=submission.created_at,
                        updated_at=submission.updated_at,
                        evaluation=evaluation,
                    )
                )
            
            # Create SubmissionHistory objects from grouped data
            for topic_id, data in topic_submissions.items():
                topic = data['topic']
                submissions.append(SubmissionHistory(
                    id=topic.id,
                    question=topic.question,
                    category=topic.category,
                    exam_type=topic.exam_type,
                    topic_metadata=topic.topic_metadata,
                    submissions=data['submissions']
                ))
            return submissions
    except Exception as e:
        logger.error(f"Database error while getting user topic history: {e}")
        raise

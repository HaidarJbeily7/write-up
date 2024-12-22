from datetime import datetime
from pydantic import BaseModel
import uuid
from sqlmodel import Field, SQLModel
from typing import Optional
from enum import Enum
import uuid
from sqlalchemy import JSON, Text, Column, Text

class ExamType(str, Enum):
    TOEFL = "TOEFL"
    IELTS = "IELTS"

class Topic(SQLModel, table=True):
    __tablename__ = 'topics'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    question: str = Field(sa_type=Text)
    category: str = Field(index=True)
    exam_type: ExamType
    task_number: int = Field(default=2, description="The task number of the topic, e.g. Task 1 for IELTS")
    difficulty_level: Optional[int] = Field(default=None)
    created_by: Optional[str] = Field(default=None)
    topic_metadata: Optional[dict] = Field(default=None, sa_type=JSON)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "question": "In nearly all science... What is the reason for this? What could ...?",
                "category": "Education",
                "exam_type": "IELTS",
                "task_number": 1,
                "difficulty_level": 5,
                "created_by": "123e4567-e89b-12d3-a456-426614174000",
                "topic_metadata": {
                    "source": "Official IELTS practice materials",
                    "year": 2023,
                }
            }
        }

class TopicSubmission(SQLModel, table=True):
    __tablename__ = 'topic_submissions'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    user_id: str = Field(foreign_key="users.id")
    topic_id: str = Field(foreign_key="topics.id")
    answer: str = Field(sa_type=Text)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

class TopicSubmissionRequest(BaseModel):
    answer: str

class EvaluationMetric(BaseModel):
    band_score: float
    feedback: str

class SubmissionEvaluation(SQLModel, table=True):
    __tablename__ = 'submission_evaluations'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    submission_id: str = Field(foreign_key="topic_submissions.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    task_achievement: EvaluationMetric = Field(sa_column=Column(JSON))
    coherence_and_cohesion: EvaluationMetric = Field(sa_column=Column(JSON))
    lexical_resource: EvaluationMetric = Field(sa_column=Column(JSON))
    grammatical_range_and_accuracy: EvaluationMetric = Field(sa_column=Column(JSON))
    overall: EvaluationMetric = Field(sa_column=Column(JSON))


class SubmissionEvaluationV2(SQLModel, table=True):
    __tablename__ = 'submission_evaluations_v2'

    id: str = Field(default_factory=lambda: str(
        uuid.uuid4()), primary_key=True, index=True)
    submission_id: str = Field(foreign_key="topic_submissions.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={
                                 "onupdate": datetime.utcnow})
    evaluation: str | None = Field(default=None, sa_type=Text)

class TopicSubmissionResponse(BaseModel):
    id: str
    topic_id: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    evaluation: SubmissionEvaluation | None = None


class TopicSubmissionResponseV2(BaseModel):
    id: str
    topic_id: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={
                                 "onupdate": datetime.utcnow})
    evaluation: str | None = None


class TopicSubmissionWithEvaluation(TopicSubmissionResponse):
    evaluation: SubmissionEvaluation | None = None


class TopicSubmissionWithEvaluationV2(TopicSubmissionResponseV2):
    evaluation: SubmissionEvaluationV2 | None = None


class TopicSubmissionWithTopicAndEvaluation(TopicSubmissionWithEvaluation):
    topic: Topic


class TopicSubmissionWithTopicAndEvaluationV2(TopicSubmissionWithEvaluationV2):
    topic: Topic


class SubmissionHistory(BaseModel):
    id: str
    question: str
    category: str
    exam_type: ExamType
    task_number: int
    topic_metadata: dict
    submissions: list[TopicSubmissionWithEvaluation]


class SubmissionHistoryV2(BaseModel):
    id: str
    question: str
    category: str
    exam_type: ExamType
    task_number: int
    topic_metadata: dict
    submissions: list[TopicSubmissionWithEvaluationV2]

class TopicCreate(BaseModel):
    question: str
    category: str
    exam_type: ExamType
    task_number: int

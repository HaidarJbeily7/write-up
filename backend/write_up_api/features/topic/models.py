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
    question: str = Field(index=True, sa_type=Text)
    category: str = Field(index=True)
    exam_type: ExamType
    difficulty_level: Optional[int] = Field(default=None)
    topic_metadata: Optional[dict] = Field(default=None, sa_type=JSON)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "category": "Education",
                "exam_type": "IELTS",
                "difficulty_level": 5,
                "topic_metadata": {
                    "source": "Official IELTS practice materials",
                    "year": 2023,
                    "task_type": "Task 1"
                }
            }
        }

class TopicSubmission(SQLModel, table=True):
    __tablename__ = 'topic_submissions'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    user_id: str = Field(foreign_key="users.id")
    topic_id: str = Field(foreign_key="topics.id")
    answer: str
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

class TopicSubmissionResponse(BaseModel):
    id: str
    topic_id: str
    answer: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    evaluation: SubmissionEvaluation | None = None

class TopicSubmissionWithEvaluation(TopicSubmissionResponse):
    evaluation: SubmissionEvaluation | None = None

class TopicSubmissionWithTopicAndEvaluation(TopicSubmissionWithEvaluation):
    topic: Topic

class SubmissionHistory(BaseModel):
    id: str
    question: str
    category: str
    exam_type: ExamType
    topic_metadata: dict
    submissions: list[TopicSubmissionWithEvaluation]

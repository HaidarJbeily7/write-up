from sqlmodel import Field, SQLModel
from typing import Optional
from enum import Enum
from uuid import UUID, uuid4

class ExamType(str, Enum):
    TOEFL = "TOEFL"
    IELTS = "IELTS"

class Topic(SQLModel, table=True):
    __tablename__ = 'topics'

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    question: str = Field(index=True)
    category: str = Field(index=True)
    exam_type: ExamType
    difficulty_level: Optional[int] = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "category": "Education",
                "exam_type": "IELTS",
                "difficulty_level": 5
            }
        }
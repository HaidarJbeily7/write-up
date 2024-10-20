from sqlmodel import Field, SQLModel
from typing import Optional
from enum import Enum

class ExamType(str, Enum):
    TOEFL = "TOEFL"
    IELTS = "IELTS"

class Topic(SQLModel, table=True):
    __tablename__ = 'topics'

    id: str = Field(primary_key=True, index=True)
    question: str = Field(index=True)
    category: str = Field(index=True)
    exam_type: ExamType
    difficulty_level: Optional[int] = Field(default=None)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "topic123",
                "category": "Education",
                "exam_type": "IELTS",
                "difficulty_level": 5
            }
        }
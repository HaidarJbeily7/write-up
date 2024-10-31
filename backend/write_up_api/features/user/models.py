from sqlmodel import Field, SQLModel
from datetime import datetime
import uuid
from sqlalchemy import JSON
from typing import Optional

class User(SQLModel, table=True):
    __tablename__ = 'users'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    email: str = Field(unique=True, index=True, nullable=False)
    full_name: str = Field(max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    is_active: bool = Field(default=True)

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"


class UserProfile(SQLModel, table=True):
    __tablename__ = 'user_profiles'

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True, index=True)
    user_id: str = Field(foreign_key="users.id", unique=True)
    desired_band_score: float = Field(nullable=True)
    target_exam: str = Field(nullable=True)  # TOEFL or IELTS
    age: int = Field(nullable=True)
    education: str = Field(nullable=True)
    
    # Additional metadata stored as JSON to allow easy extension
    
    profile_metadata: Optional[dict] = Field(default=None, sa_type=JSON)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})

    def __repr__(self):
        return f"<UserProfile(user_id={self.user_id}, target_exam={self.target_exam})>"

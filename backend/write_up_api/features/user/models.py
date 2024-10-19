from sqlmodel import Field, SQLModel, create_engine
from datetime import datetime
import uuid
from ...common.config import settings

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


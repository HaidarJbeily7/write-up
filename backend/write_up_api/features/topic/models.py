from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# FIXME: This is a mock model for now
class User(BaseModel):
    id: str = Field(..., description="Unique identifier for the user")
    username: str = Field(..., min_length=3, max_length=50, description="User's username")
    email: EmailStr = Field(..., description="User's email address")
    full_name: Optional[str] = Field(None, max_length=100, description="User's full name")
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Timestamp of user creation")
    is_active: bool = Field(default=True, description="Whether the user account is active")
    
    class Config:
        schema_extra = {
            "example": {
                "id": "user123",
                "username": "johndoe",
                "email": "john.doe@example.com",
                "full_name": "John Doe",
                "created_at": "2023-04-15T10:30:00Z",
                "is_active": True
            }
        }

class UserRegistration(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

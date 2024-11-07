from pydantic import BaseModel, Field
from typing import Optional


class UserProfileUpdate(BaseModel):
    desired_band_score: float = Field(..., ge=0.0, le=9.0, description="Target band score between 0 and 9")
    target_exam: str = Field(..., description="Target exam type (TOEFL or IELTS)")
    age: int = Field(..., ge=0, description="User's age")
    education: str = Field(..., description="User's education level")
    profile_metadata: Optional[dict] = Field(default={}, description="Additional profile metadata")


class UserProfileResponse(BaseModel):
    user_id: str
    desired_band_score: Optional[float] = None
    target_exam: Optional[str] = None
    age: Optional[int] = None
    education: Optional[str] = None
    profile_metadata: Optional[dict] = None
    credits_allowance: Optional[int] = None
    credits_spent: Optional[int] = None

    class Config:
        from_attributes = True

from pydantic import BaseModel, EmailStr, Field


class RegistrationRequest(BaseModel):
    fullname: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    fullname: str
    email: str
    is_active: bool

class RegistrationResponse(BaseModel):
    user: UserResponse
    message: str

class LoginResponse(BaseModel):
    user: UserResponse
    token: TokenResponse

class ErrorResponse(BaseModel):
    detail: str

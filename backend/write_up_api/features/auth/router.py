from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from .dto import TokenResponse, UserResponse, RegistrationResponse, LoginResponse, RegistrationRequest
from ..user.queries import create_user

auth_router: APIRouter = APIRouter(prefix="/v1/auth", tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@auth_router.post("/register", response_model=RegistrationResponse)
async def register(user: RegistrationRequest) -> RegistrationResponse:
    user =  create_user(user.email, user.fullname)
    return RegistrationResponse(user=UserResponse(id=user.id, fullname=user.full_name, email=user.email), message="User successfully registered")

@auth_router.post("/login", response_model=LoginResponse)
async def login(form_data: OAuth2PasswordRequestForm = Depends()) -> LoginResponse:
    # TODO: Implement user login logic
    # This should include:
    # 1. Verify username and password
    # 2. Generate access token
    # 3. Return user data and token
    user = UserResponse(id=1, username=form_data.username, email="user@example.com")
    token = TokenResponse(access_token="dummy_token", token_type="bearer")
    return LoginResponse(user=user, token=token)

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    # TODO: Implement logic to get current user
    # This should include:
    # 1. Verify the token
    # 2. Fetch and return the user data
    return UserResponse(id=1, username="current_user", email="user@example.com")

@auth_router.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)) -> dict:
    # TODO: Implement logout logic
    # This may include:
    # 1. Invalidate the token
    # 2. Clear any server-side sessions
    return {"message": "Successfully logged out"}

@auth_router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(token: str = Depends(oauth2_scheme)) -> TokenResponse:
    # TODO: Implement token refresh logic
    # This should include:
    # 1. Verify the current token
    # 2. Generate and return a new token
    return TokenResponse(access_token="new_dummy_token", token_type="bearer")


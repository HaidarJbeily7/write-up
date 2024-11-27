from fastapi import APIRouter, Depends, Request
from .dto import TokenResponse, UserResponse, LoginResponse
from ...features.user.queries import create_user, get_user_by_email, create_user_profile
from ...common.config import settings
from ...common.dependencies import get_current_user
from .security import create_access_token
import requests
from ...features.subscription.queries import create_or_update_user_credits
from sqlmodel import Session
from ...common.db_engine import db_engine
from ...features.notifications.logs import notify_user_registered

auth_router: APIRouter = APIRouter(tags=["auth"])

@auth_router.get("/login/google")
async def login_google():
    return {
        "url": f"https://accounts.google.com/o/oauth2/auth?response_type=code&client_id={settings.GOOGLE_CLIENT_ID}&redirect_uri={settings.GOOGLE_REDIRECT_URI}&scope=openid%20profile%20email"
    }

@auth_router.get("/google/callback")
async def google_callback(request: Request):
    code = request.query_params.get("code")
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    response = requests.post(token_url, data=data)
    access_token = response.json().get("access_token")
    
    user_info = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={"Authorization": f"Bearer {access_token}"}).json()
    
    email = user_info.get("email")
    name = user_info.get("name")
    
    user = get_user_by_email(email)
    if not user:
        user = create_user(email, name)
        create_user_profile(user.id)
        with Session(db_engine) as session:
            create_or_update_user_credits(user.id, 3, session)

    token = create_access_token(data={"sub": user.email})
    notify_user_registered(user.email)
    return LoginResponse(user=UserResponse(id=user.id, fullname=user.full_name, email=user.email, is_active=user.is_active), token=TokenResponse(access_token=token, token_type="bearer"))

@auth_router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: UserResponse = Depends(get_current_user)) -> UserResponse:
    return UserResponse(id=current_user.id, fullname=current_user.full_name, email=current_user.email, is_active=current_user.is_active)


@auth_router.post("/refresh-token", response_model=TokenResponse)
async def refresh_token(current_user: UserResponse = Depends(get_current_user)) -> TokenResponse:
    new_token = create_access_token(data={"sub": current_user.email})
    return TokenResponse(access_token=new_token, token_type="bearer")


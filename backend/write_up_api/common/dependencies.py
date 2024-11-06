from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from pydantic import ValidationError
from typing import Annotated

from .config import settings
from ..features.user.models import User
from ..features.user.queries import get_user_by_email


def decode_jwt(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        isTokenValid: bool = False

        try:
            payload = decode_jwt(jwtoken)
        except:
            payload = None
        if payload:
            isTokenValid = True

        return isTokenValid

from sqlmodel import Session
from ..common.db_engine import db_engine
def get_db():
    with Session(db_engine) as session:
        yield session
        

async def get_current_user(token: Annotated[str, Depends(JWTBearer())]) -> User:
    try:
        payload = decode_jwt(token)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Could not validate credentials")
    except (jwt.JWTError, ValidationError):
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    user = get_user_by_email(email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

async def check_user_credits(user: Annotated[User, Depends(get_current_user)]) -> bool:
    from ..features.subscription.queries import get_user_credits
    try:

        with Session(db_engine) as db_session:
            user_credits = get_user_credits(user.id, db_session)

        if not user_credits or user_credits.credits_spent >= user_credits.credits_allowance:
            raise HTTPException(status_code=400, detail="Insufficient credits")

        return True
    except Exception as e:
        raise e

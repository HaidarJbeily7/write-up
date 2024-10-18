from fastapi import APIRouter
from ...models.User import UserLogin
from .router import router


@router.post("/login")
async def login_user(user: UserLogin):
    # TODO: Implement user login logic
    return {"message": "User login endpoint"}

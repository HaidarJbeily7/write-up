from fastapi import APIRouter, Depends

from .models import User
from .dto import UserProfileUpdate, UserProfileResponse
from .queries import update_user_profile, get_user_profile, activate_user
from ...common.dependencies import get_current_user

user_router: APIRouter = APIRouter(tags=["user"])

@user_router.put("/profile")
async def update_profile(
    profile_data: UserProfileUpdate,
    user: User = Depends(get_current_user)
) -> UserProfileResponse:
    profile = update_user_profile(user.id, profile_data.model_dump())
    if not user.is_active:
        activate_user(user.id)
    return UserProfileResponse(
        user_id=profile.user_id,
        desired_band_score=profile.desired_band_score,
        target_exam=profile.target_exam,
        age=profile.age,
        education=profile.education,
        profile_metadata=profile.profile_metadata
    )


@user_router.get("/profile")
async def get_profile(user: User = Depends(get_current_user)) -> UserProfileResponse:
    print(user)
    profile = get_user_profile(user.id)
    return UserProfileResponse(
        user_id=profile.user_id,
        desired_band_score=profile.desired_band_score,
        target_exam=profile.target_exam,
        age=profile.age,
        education=profile.education,
        profile_metadata=profile.profile_metadata
    )
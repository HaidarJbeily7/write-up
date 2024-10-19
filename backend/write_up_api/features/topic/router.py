from fastapi import APIRouter


topic_router: APIRouter = APIRouter(prefix="/v1/topics", tags=["topic"])

@topic_router.post("/")
async def create_topic(topic) -> dict:
    # TODO: Implement user registration logic
    return {"message": "Topic created"}



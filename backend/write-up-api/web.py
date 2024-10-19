from fastapi import FastAPI
from routers.user.router import router as user_router

app = FastAPI()


# Add routers
app.include_router(user_router)


@app.get("/health")
async def health():
    return {"status": "Server is healthy"}

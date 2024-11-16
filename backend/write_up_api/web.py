import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import uvloop
from .features import auth_router, user_router, topic_router_v1, topic_router_v2, subscription_router
from scalar_fastapi import get_scalar_api_reference
from .common.config import settings
from contextlib import asynccontextmanager
import logging

# Add logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('app.log')
    ]
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    from .features.topic.utils import initialize_topics
    initialize_topics()
    yield
    # Shutdown

app = FastAPI(
    docs_url="/swagger",
    redoc_url=None,
    title="Write-Up API",
    description="API for Write-Up",
    version=settings.VERSION,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add routers
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(user_router, prefix="/api/v1/users")
app.include_router(topic_router_v1, prefix="/api/v1/topics")
app.include_router(topic_router_v2, prefix="/api/v2/topics")
app.include_router(subscription_router, prefix="/api/v1/subscriptions")

@app.get("/api/health")
async def health():
    return {"status": "Server is healthy"}

@app.get("/docs", include_in_schema=False)
async def docs():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title="Write-Up API",
    )


def main(
    host="127.0.0.1",
    port=8000,
    backlog=4096,
    timeout_keep_alive=30,
    workers=None,
    log_level="info",
) -> None:
    uvicorn.run(
        app,
        host=host,
        port=port,
        log_level=log_level,
        timeout_keep_alive=timeout_keep_alive,
        backlog=backlog,
        workers=workers,
    )


asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

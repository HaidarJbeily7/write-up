from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .features import auth_router, user_router, topic_router, subscription_router
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
app.include_router(topic_router, prefix="/api/v1/topics")
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

print(settings.DATABASE_URL)

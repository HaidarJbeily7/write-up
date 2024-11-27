from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database settings
    DATABASE_URL: str

    # JWT settings
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int


    # CORS settings
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:8080", "http://localhost:5173", "https://gray-pond-02a298600.5.azurestaticapps.net"]

    # GOOGLE SETTINGS
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str
    
    # PROJECT SETTINGS
    VERSION: str

    # LLM API KEYS
    OPENAI_API_KEY: str
    JULEP_API_KEY: str

    # STRIPE SETTINGS
    STRIPE_SECRET_KEY: str

    # ADMIN API KEY
    ADMIN_API_KEY: str

    # AZURE VISION SETTINGS
    VISION_KEY: str
    VISION_ENDPOINT: str
    
    # TELEGRAM SETTINGS
    TELEGRAM_API_KEY: str
    TELEGRAM_CHAT_ID: str

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

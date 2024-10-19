from sqlmodel import create_engine
from .config import settings

db_engine = create_engine(settings.DATABASE_URL, echo=True)

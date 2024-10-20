from sqlmodel import Session
from .models import User
from ...common.db_engine import db_engine

def create_user(email: str, full_name: str) -> User:
    with Session(db_engine) as session:
        new_user = User(email=email, full_name=full_name)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return new_user

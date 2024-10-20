from sqlmodel import Session, select
from sqlalchemy.exc import OperationalError
from .models import User
from ...common.db_engine import db_engine

def create_user(email: str, full_name: str) -> User:
    try:
        with Session(db_engine) as session:
            new_user = User(email=email, full_name=full_name)
            session.add(new_user)
            session.commit()
            session.refresh(new_user)
            return new_user
    except OperationalError as e:
        # Log the error or handle it as needed
        print(f"Database connection error: {e}")
        raise

def get_user_by_email(email: str) -> User | None:
    try:
        with Session(db_engine) as session:
            user = session.exec(select(User).where(User.email == email)).first()
            return user
    except OperationalError as e:
        # Log the error or handle it as needed
        print(f"Database connection error: {e}")
        raise
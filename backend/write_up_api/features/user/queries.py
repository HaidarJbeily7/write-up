from sqlmodel import Session, select
from sqlalchemy.exc import OperationalError
from .models import User, UserProfile
from ...common.db_engine import db_engine

def create_user(email: str, full_name: str) -> User:
    from ...features.subscription.queries import create_or_update_user_credits

    try:
        with Session(db_engine) as session:
            new_user = User(email=email, full_name=full_name, is_active=False)
            session.add(new_user)
            session.commit()
            session.refresh(new_user)

            # Gift new users 3 free credits
            create_or_update_user_credits(new_user.id, 3)

            return new_user
    except OperationalError as e:
        # Log the error or handle it as needed
        print(f"Database connection error: {e}")
        raise

def create_user_profile(user_id: str) -> UserProfile:
    try:
        with Session(db_engine) as session:
            new_profile = UserProfile(user_id=user_id)
            session.add(new_profile)
            session.commit()
            return new_profile
    except OperationalError as e:
        print(f"Database connection error: {e}")
        raise

def activate_user(user_id: str) -> bool:
    try:
        with Session(db_engine) as session:
            user = session.get(User, user_id)
            user.is_active = True
            session.commit()
            return True
    except OperationalError as e:
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


def get_user_by_id(user_id: str) -> User | None:
    try:
        with Session(db_engine) as session:
            user = session.get(User, user_id)
            return user

    except OperationalError as e:
        print(f"Database connection error: {e}")
        raise

def update_user_profile(user_id: str, profile_data: dict) -> UserProfile | None:
    try:
        with Session(db_engine) as session:
            user_profile = session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()
            
            if not user_profile:
                # Create new profile if it doesn't exist
                user_profile = UserProfile(user_id=user_id, **profile_data)
                session.add(user_profile)
            else:
                # Update existing profile
                for key, value in profile_data.items():
                    if hasattr(user_profile, key):
                        setattr(user_profile, key, value)
            
            session.commit()
            session.refresh(user_profile)
            return user_profile
            
    except OperationalError as e:
        print(f"Database connection error: {e}")
        raise

def get_user_profile(user_id: str) -> UserProfile | None:
    try:
        with Session(db_engine) as session:
            user_profile = session.exec(select(UserProfile).where(UserProfile.user_id == user_id)).first()
            return user_profile
    except OperationalError as e:
        print(f"Database connection error: {e}")
        raise
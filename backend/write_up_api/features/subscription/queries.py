from datetime import datetime, timedelta
from sqlmodel import Session, select
from .models import Subscription, UserCredits
from ...common.config import settings

async def create_subscription(
    user_id: str,
    plan: str,
    payment_intent_id: str,
    amount: int,
    db: Session
) -> Subscription:
    subscription = Subscription(
        user_id=user_id,
        plan=plan,
        stripe_payment_intent_id=payment_intent_id,
        amount_paid=amount,
        status="pending",
    )
        
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


async def update_subscription_status(
    db: Session,
    payment_intent_id: str,
    status: str,
    stripe_customer_id: str = None
) -> Subscription:
    statement = select(Subscription).where(
        Subscription.stripe_payment_intent_id == payment_intent_id
    )
    subscription = db.exec(statement).first()    
    if subscription:
        subscription.status = status
        if stripe_customer_id:
            subscription.stripe_customer_id = stripe_customer_id
            
        db.add(subscription)
        db.commit()
        db.refresh(subscription)
        
    return subscription


async def create_or_update_user_credits(
    user_id: str,
    credits_allowance: int,
    db: Session
) -> UserCredits:
    statement = select(UserCredits).where(UserCredits.user_id == user_id)
    user_credits = db.exec(statement).first()
        
    if user_credits:
        # Update existing record
        user_credits.credits_allowance += credits_allowance
    else:
        # Create new record
        user_credits = UserCredits(
            user_id=user_id,
            credits_allowance=credits_allowance,
            credits_spent=0
        )
        
    db.add(user_credits)
    db.commit()
    db.refresh(user_credits)
    return user_credits


async def get_user_credits(
    user_id: str,
    db: Session
) -> UserCredits:
    statement = select(UserCredits).where(UserCredits.user_id == user_id)
    return db.exec(statement).first()


async def increment_credits_spent(
    user_id: str,
    db: Session,
    amount: int = 1,
) -> UserCredits:
    statement = select(UserCredits).where(UserCredits.user_id == user_id)
    user_credits = db.exec(statement).first()
        
    if user_credits:
        user_credits.credits_spent += amount
        db.add(user_credits)
        db.commit()
        db.refresh(user_credits)
            
    return user_credits


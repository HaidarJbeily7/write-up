from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field
import uuid


class Subscription(SQLModel, table=True):
    __tablename__ = "subscriptions"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    plan: str = Field(..., description="Basic or Pro")
    stripe_payment_intent_id: str
    stripe_customer_id: Optional[str] = None
    amount_paid: int = Field(..., description="Amount in cents")
    status: str = Field(..., description="active, cancelled, expired")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})



class UserCredits(SQLModel, table=True):
    __tablename__ = "user_credits"

    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="users.id")
    credits_allowance: int = Field(default=0, description="Total credits allowed")
    credits_spent: int = Field(default=0, description="Total credits spent")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow, sa_column_kwargs={"onupdate": datetime.utcnow})
    
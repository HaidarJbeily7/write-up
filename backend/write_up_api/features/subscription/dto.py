from pydantic import BaseModel, Field


class CreatePaymentRequest(BaseModel):
    plan: str = Field(..., description="Subscription plan type (Basic or Pro)")


class PaymentIntentResponse(BaseModel):
    client_secret: str


class PaymentSuccessRequest(BaseModel):
    payment_intent: str


class PaymentSuccessResponse(BaseModel):
    message: str

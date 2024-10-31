from fastapi import APIRouter, Request, HTTPException, Depends
import stripe
from sqlmodel import Session
from ...common.config import settings
from ...common.dependencies import get_current_user, get_db
from ...features.user.models import User
from .dto import CreatePaymentRequest, PaymentIntentResponse, PaymentSuccessRequest, PaymentSuccessResponse
from .queries import create_subscription, update_subscription_status, create_or_update_user_credits

subscription_router: APIRouter = APIRouter(tags=["subscription"])

stripe.api_key = settings.STRIPE_SECRET_KEY

@subscription_router.post("/create-payment-intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    request: CreatePaymentRequest, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> PaymentIntentResponse:
    plan = request.plan
    
    amount = 0
    if plan == "Basic":
        amount = 999  # $9.99
    elif plan == "Pro":
        amount = 1999  # $19.99    
    else:
        raise HTTPException(status_code=400, detail="Invalid plan selected")

    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd"
        )
        
        # Create subscription record
        await create_subscription(
            db=db,
            user_id=current_user.id,
            plan=plan,
            payment_intent_id=payment_intent.id,
            amount=amount
        )
        
        return PaymentIntentResponse(client_secret=payment_intent.client_secret)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=400, detail=str(e))


@subscription_router.post("/payment-success", response_model=PaymentSuccessResponse)
async def payment_success(
    request: PaymentSuccessRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> PaymentSuccessResponse:
    payment_intent_id = request.payment_intent
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if intent.status == "succeeded":
            # Update subscription status
            subscription = await update_subscription_status(
                db=db,
                payment_intent_id=payment_intent_id,
                status="active",
                stripe_customer_id=intent.customer
            )
            # Update user credits
            await create_or_update_user_credits(
                user_id=current_user.id,
                credits_allowance=10 if subscription.plan == "Basic" else 30,
                db=db
            )
            return PaymentSuccessResponse(message="Payment confirmed successfully")
        else:
            await update_subscription_status(
                db=db,
                payment_intent_id=payment_intent_id,
                status="failed"
            )
            raise HTTPException(status_code=400, detail="Payment not confirmed")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

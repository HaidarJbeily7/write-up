import requests
from ...common.config import settings

def notify_user_registered(user_email: str):
    text = f"🎉 New user registered: {user_email}"
    url = f"https://api.telegram.org/{settings.TELEGRAM_API_KEY}/sendMessage?chat_id={settings.TELEGRAM_CHAT_ID}&text={text}"
    requests.get(url)

def notify_customer_activated(user_email: str):
    text = f"💳 Customer activated: {user_email}"
    url = f"https://api.telegram.org/{settings.TELEGRAM_API_KEY}/sendMessage?chat_id={settings.TELEGRAM_CHAT_ID}&text={text}"
    requests.get(url)

def notify_credit_spent(user_email: str, credits_spent: int, remaining_credits: int):
    text = f"💰 Credits spent: {credits_spent} by {user_email} (Remaining: {remaining_credits})"
    url = f"https://api.telegram.org/{settings.TELEGRAM_API_KEY}/sendMessage?chat_id={settings.TELEGRAM_CHAT_ID}&text={text}"
    requests.get(url)
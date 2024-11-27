from .auth import auth_router
from .user import user_router
from .topic import topic_router_v1, topic_router_v2
from .subscription import subscription_router
from .admin import admin_router
from .ocr import ocr_router

__all__ = ["auth_router", "user_router", "topic_router_v1", "topic_router_v2", "subscription_router", "admin_router", "ocr_router"]

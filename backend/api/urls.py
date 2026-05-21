from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet, CategoryViewSet, ReviewViewSet,
    RegisterView, VerifyEmailView, LoginView, UserProfileView,
    OrderListCreateView, CanReviewView
)

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify/', VerifyEmailView.as_view(), name='verify'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('orders/', OrderListCreateView.as_view(), name='orders'),
    path('can-review/<int:product_id>/', CanReviewView.as_view(), name='can_review'),
]
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, BookTrackingViewSet, BookCommentViewSet, check_user

router = DefaultRouter()
router.register(r'books', BookViewSet)
router.register(r'booktracking', BookTrackingViewSet)
router.register(r'bookcomments', BookCommentViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/me', check_user)
]

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from .models import Book, BookTracking, BookComment
from .serializers import BookSerializer, BookTrackingSerializer, BookCommentSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Custom logic to check if the book with the same google_books_id exists
        google_books_id = request.data.get('google_books_id')

        if google_books_id:
            # Try to fetch the existing book
            existing_book = Book.objects.filter(google_books_id=google_books_id).first()
            if existing_book:
                # If the book exists, return the existing book as a response
                serializer = self.get_serializer(existing_book)
                return Response(serializer.data, status=status.HTTP_200_OK)

        # If no existing book, proceed with creating a new one
        return super().create(request, *args, **kwargs)


class BookTrackingViewSet(viewsets.ModelViewSet):
    queryset = BookTracking.objects.all()
    serializer_class = BookTrackingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Limit the queryset to only the entries for the authenticated user.
        """
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically associate the logged-in user when creating a BookTracking.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Allow only the user who created the BookTracking to update it.
        """
        book_tracking = self.get_object()
        if book_tracking.user != self.request.user:
            raise PermissionDenied("You cannot update another user's BookTracking.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Allow only the user who created the BookTracking to delete it.
        """
        if instance.user != self.request.user:
            raise PermissionDenied("You cannot delete another user's BookTracking.")
        instance.delete()


class BookCommentViewSet(viewsets.ModelViewSet):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Limit the queryset to only the entries for the authenticated user.
        """
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Automatically associate the logged-in user when creating a BookComment.
        """
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        """
        Allow only the user who created the BookComment to update it.
        """
        book_comment = self.get_object()
        if book_comment.user != self.request.user:
            raise PermissionDenied("You cannot update another user's BookComment.")
        serializer.save()

    def perform_destroy(self, instance):
        """
        Allow only the user who created the BookComment to delete it.
        """
        if instance.user != self.request.user:
            raise PermissionDenied("You cannot delete another user's BookComment.")
        instance.delete()

@api_view(['GET'])
def check_user(request):
    return Response(request.user.username)
from os import read
from rest_framework import serializers
from .models import Book, BookComment, BookTracking

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'description', 'cover_image_url', 'published_date', 'google_books_id']

class BookTrackingSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    
    class Meta:
        model = BookTracking
        fields = ['id', 'book', 'status', 'rating', 'progress']


class BookCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookComment
        fields = '__all__'

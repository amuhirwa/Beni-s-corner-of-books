from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    description = models.TextField()
    cover_image_url = models.URLField(blank=True, null=True)
    published_date = models.DateField()
    google_books_id = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class BookTracking(models.Model):
    STATUS_CHOICES = [
        ('reading', 'Reading'),
        ('completed', 'Completed'),
        ('want_to_read', 'Want to Read'),
    ]
    
    user = models.ForeignKey(User, related_name='book_tracks', on_delete=models.CASCADE, null=True, blank=True)
    book = models.ForeignKey(Book, related_name='tracking_info', on_delete=models.CASCADE, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='want_to_read')
    rating = models.PositiveIntegerField(null=True, blank=True)  # 1 to 5 rating
    progress = models.PositiveIntegerField(default=0)  # Progress in percentage
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

class BookComment(models.Model):
    user = models.ForeignKey(User, related_name='book_comments', on_delete=models.CASCADE, null=True, blank=True)
    book = models.ForeignKey(Book, related_name='comments', on_delete=models.CASCADE, null=True, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.book.title}"

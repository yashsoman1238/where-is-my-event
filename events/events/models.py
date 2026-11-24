from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, default='attendee')  # 'attendee' or 'organizer'
    org_name = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, default='Vadodara')
    event_type = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class Event(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    artist = models.CharField(max_length=150)
    city = models.CharField(max_length=100, default='Vadodara')
    venue = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date = models.CharField(max_length=100)
    time = models.CharField(max_length=50, default='06:00 PM')
    duration = models.CharField(max_length=50, default='4 Hours Approx.')
    image = models.URLField(max_length=500, blank=True, null=True)
    banner = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField()
    organizer_email = models.EmailField(blank=True, null=True)
    organizer_name = models.CharField(max_length=200, default='WIME Global Events Team')

    def __str__(self):
        return self.title
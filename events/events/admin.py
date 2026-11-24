from django.contrib import admin
from .models import UserProfile, Event

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'org_name', 'phone', 'city')
    search_fields = ('user__username', 'org_name', 'phone')
    list_filter = ('role', 'city')

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'artist', 'city', 'price', 'date', 'organizer_name')
    search_fields = ('title', 'artist', 'venue', 'organizer_name')
    list_filter = ('city', 'date')
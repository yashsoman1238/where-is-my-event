from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    path('events/', views.events, name='events'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('add-event/', views.add_event, name='add_event'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('organizer-profile/', views.organizer_profile, name='organizer_profile'),
    path('dashboard/', views.user_dashboard, name='user_dashboard'),
    path('view-event/', views.view_event, name='view_event'),
    path('privacy-policy/', views.privacy_policy, name='privacy_policy'),
    path('terms/', views.terms, name='terms'),

    path('asses-kaur/', views.asses_kaur, name='asses_kaur'),
    path('hari-haran/', views.hari_haran, name='hari_haran'),
    path('jubin-nautiyal/', views.jubin_nautiyal, name='jubin_nautiyal'),

    path('shilpa-rao/', views.shilpa_rao, name='shilpa_rao'),
    path('shankar-mahadevan/', views.shankar_mahadevan, name='shankar_mahadevan'),
    path('shreya-ghoshal/', views.shreya_ghoshal, name='shreya_ghoshal'),
    path('sonu-nigam/', views.sonu_nigam, name='sonu_nigam'),
    path('sunidhi-chauhan/', views.sunidhi_chauhan, name='sunidhi_chauhan'),
    path('the-great-mehfil/', views.the_great_mehfil, name='the_great_mehfil'),

    # API route
    path('api/events/', views.event_list_api, name='api_events'),
    path('api/events/', views.event_list_api, name='api_events'),
    path('api/events/<str:slug>/', views.event_detail_api, name='api_event_detail'),
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/login/', views.api_login, name='api_login'),
    path('api/events/', views.event_list_api, name='api_events'),
    path('api/events/<str:slug>/', views.event_detail_api, name='api_event_detail'),
]
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils.text import slugify
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Event, UserProfile
from .serializers import EventSerializer

# --- Template Views (unchanged) ---
def home(request): return render(request, 'index.html')
def events(request): return render(request, 'events.html')
def about(request): return render(request, 'About us.html')
def contact(request): return render(request, 'contact us.html')
def add_event(request): return render(request, 'Add Event.html')
def login_view(request): return render(request, 'login.html')
def signup(request): return render(request, 'signup.html')
def organizer_profile(request): return render(request, 'organizer profile.html')
def user_dashboard(request): return render(request, 'user dashboard.html')
def view_event(request): return render(request, 'View Event.html')
def privacy_policy(request): return render(request, 'privacy policy.html')
def terms(request): return render(request, 'termsandconditions.html')
def asses_kaur(request): return render(request, 'Asses kaur.html')
def hari_haran(request): return render(request, 'Hari Haran.html')
def jubin_nautiyal(request): return render(request, 'Jubin Nautiyal.html')
def shankar_mahadevan(request): return render(request, 'Shankar Mahadevan.html')
def shilpa_rao(request): return render(request, 'Shilpa Roa.html')
def shreya_ghoshal(request): return render(request, 'Shreya Ghoshal.html')
def sonu_nigam(request): return render(request, 'Sonu Nigam.html')
def sunidhi_chauhan(request): return render(request, 'Sunidhi Chauhan.html')
def the_great_mehfil(request): return render(request, 'The Great Mehfil.html')

# --- SQL API ENDPOINTS ---

@api_view(['POST'])
def api_signup(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', '')
    role = data.get('role', 'attendee')

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email is already registered'}, status=status.HTTP_400_BAD_REQUEST)

    # Create Django Auth User
    user = User.objects.create_user(username=email, email=email, password=password, first_name=name)
    
    # Create Profile linked to SQL
    UserProfile.objects.create(
        user=user,
        role=role,
        org_name=data.get('orgName', ''),
        phone=data.get('phone', ''),
        address=data.get('address', ''),
        city=data.get('city', 'Vadodara'),
        event_type=data.get('eventType', '')
    )

    return Response({
        'message': 'User registered successfully',
        'email': user.email,
        'role': role,
        'orgName': data.get('orgName', '')
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def api_login(request):
    data = request.data
    email = data.get('email')
    password = data.get('password')

    user = authenticate(username=email, password=password)
    if user is not None:
        profile = getattr(user, 'profile', None)
        return Response({
            'message': 'Login successful',
            'email': user.email,
            'name': user.first_name,
            'role': profile.role if profile else 'attendee',
            'orgName': profile.org_name if profile else ''
        })
    return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
def event_list_api(request):
    if request.method == 'GET':
        events = Event.objects.all().order_by('-id')
        serializer = EventSerializer(events, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        if not data.get('slug'):
            base_slug = slugify(data.get('title', 'event'))
            data['slug'] = f"{base_slug}-{Event.objects.count() + 1}"

        serializer = EventSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def event_detail_api(request, slug):
    try:
        event = Event.objects.get(slug=slug)
        serializer = EventSerializer(event)
        return Response(serializer.data)
    except Event.DoesNotExist:
        return Response({'error': 'Event not found'}, status=status.HTTP_404_NOT_FOUND)
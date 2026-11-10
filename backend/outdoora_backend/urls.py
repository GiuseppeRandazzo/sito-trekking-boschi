from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'name': 'Outdoora Active Tourism API',
        'version': '1.0.0',
        'author': 'Outdoora Candidate Portfolio',
        'endpoints': {
            'tours': '/api/tours/',
            'featured_tours': '/api/tours/featured/',
            'categories': '/api/tours/categories/',
            'bookings': '/api/bookings/',
            'admin': '/admin/',
        },
        'status': 'operational',
        'tech_stack': {
            'backend': 'Django 5.1 + Django REST Framework',
            'database': 'PostgreSQL / SQLite',
            'storage': 'Amazon S3 (boto3 / django-storages)',
            'clients': ['Next.js 16 Web Portal', 'React Native GPS Mobile App']
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),
    path('api/tours/', include('tours.urls')),
    path('api/bookings/', include('tours.booking_urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

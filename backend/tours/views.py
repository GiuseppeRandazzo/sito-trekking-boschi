from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Tour, Booking
from .serializers import (
    TourListSerializer,
    TourDetailSerializer,
    BookingCreateSerializer,
    BookingDetailSerializer,
)

class TourViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint per consultare i tour di Outdoora.
    Supporta filtri per categoria (ebike, gravel, mtb, trekking) e ordinamento per distanza o dislivello.
    """
    queryset = Tour.objects.prefetch_related('waypoints').all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TourDetailSerializer
        return TourListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        difficulty = self.request.query_params.get('difficulty')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category=category)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if featured is not None:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')

        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Ritorna solo i tour in evidenza per l'Hero e la homepage"""
        tours = self.get_queryset().filter(is_featured=True)
        serializer = TourListSerializer(tours, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Ritorna le categorie disponibili con conteggi"""
        return Response([
            {'id': 'all', 'label': 'Tutti i Tour'},
            {'id': 'ebike', 'label': 'E-Bike Panoramico', 'count': Tour.objects.filter(category='ebike').count()},
            {'id': 'gravel', 'label': 'Gravel Adventure', 'count': Tour.objects.filter(category='gravel').count()},
            {'id': 'mtb', 'label': 'Mountain Bike Enduro', 'count': Tour.objects.filter(category='mtb').count()},
            {'id': 'trekking', 'label': 'Trekking & Sentieri', 'count': Tour.objects.filter(category='trekking').count()},
        ])


class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint per registrare e consultare prenotazioni.
    """
    queryset = Booking.objects.select_related('tour').all()
    lookup_field = 'booking_code'

    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        detail_serializer = BookingDetailSerializer(booking)
        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

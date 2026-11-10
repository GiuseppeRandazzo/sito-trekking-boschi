from rest_framework import serializers
from .models import Tour, Waypoint, Booking

class WaypointSerializer(serializers.ModelSerializer):
    poi_type_display = serializers.CharField(source='get_poi_type_display', read_only=True)

    class Meta:
        model = Waypoint
        fields = [
            'id',
            'title',
            'description',
            'poi_type',
            'poi_type_display',
            'lat',
            'lng',
            'elevation_m',
            'km_marker',
            'audio_guide_url',
            'order',
        ]


class TourListSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    waypoints_count = serializers.IntegerField(source='waypoints.count', read_only=True)

    class Meta:
        model = Tour
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'category_display',
            'short_description',
            'difficulty',
            'difficulty_display',
            'distance_km',
            'elevation_gain_m',
            'estimated_duration',
            'price_per_person',
            'cover_image',
            'starting_point',
            'bike_rental_available',
            'is_featured',
            'waypoints_count',
        ]


class TourDetailSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    waypoints = WaypointSerializer(many=True, read_only=True)

    class Meta:
        model = Tour
        fields = [
            'id',
            'title',
            'slug',
            'category',
            'category_display',
            'short_description',
            'description',
            'difficulty',
            'difficulty_display',
            'distance_km',
            'elevation_gain_m',
            'estimated_duration',
            'price_per_person',
            'cover_image',
            'gpx_file_url',
            'starting_point',
            'coordinates_geojson',
            'bike_rental_available',
            'is_featured',
            'waypoints',
            'created_at',
        ]


class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = [
            'tour',
            'customer_name',
            'customer_email',
            'customer_phone',
            'tour_date',
            'participants_count',
            'bike_rental_needed',
            'notes',
        ]

    def create(self, validated_data):
        return super().create(validated_data)


class BookingDetailSerializer(serializers.ModelSerializer):
    tour_title = serializers.CharField(source='tour.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'booking_code',
            'tour',
            'tour_title',
            'customer_name',
            'customer_email',
            'customer_phone',
            'tour_date',
            'participants_count',
            'bike_rental_needed',
            'total_price',
            'status',
            'status_display',
            'notes',
            'created_at',
        ]

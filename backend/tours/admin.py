from django.contrib import admin
from .models import Tour, Waypoint, Booking

class WaypointInline(admin.TabularInline):
    model = Waypoint
    extra = 1
    fields = ('order', 'title', 'poi_type', 'km_marker', 'lat', 'lng', 'elevation_m', 'audio_guide_url')
    ordering = ('order', 'km_marker')


@admin.register(Tour)
class TourAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'category',
        'difficulty',
        'distance_km',
        'elevation_gain_m',
        'price_per_person',
        'bike_rental_available',
        'is_featured',
    )
    list_filter = ('category', 'difficulty', 'bike_rental_available', 'is_featured')
    search_fields = ('title', 'short_description', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [WaypointInline]
    fieldsets = (
        ('Informazioni Generali', {
            'fields': ('title', 'slug', 'category', 'short_description', 'description', 'is_featured')
        }),
        ('Dati Tecnici & Altimetria', {
            'fields': ('difficulty', 'distance_km', 'elevation_gain_m', 'estimated_duration', 'starting_point')
        }),
        ('Prezzi & Noleggio', {
            'fields': ('price_per_person', 'bike_rental_available')
        }),
        ('Tracciati GPS & Media (Amazon S3)', {
            'fields': ('cover_image', 'gpx_file_url', 'coordinates_geojson')
        }),
    )


@admin.register(Waypoint)
class WaypointAdmin(admin.ModelAdmin):
    list_display = ('title', 'tour', 'poi_type', 'km_marker', 'elevation_m', 'order')
    list_filter = ('poi_type', 'tour')
    search_fields = ('title', 'description')


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        'booking_code',
        'customer_name',
        'tour',
        'tour_date',
        'participants_count',
        'bike_rental_needed',
        'total_price',
        'status',
        'created_at',
    )
    list_filter = ('status', 'tour_date', 'bike_rental_needed', 'tour')
    search_fields = ('booking_code', 'customer_name', 'customer_email', 'customer_phone')
    readonly_fields = ('booking_code', 'created_at')

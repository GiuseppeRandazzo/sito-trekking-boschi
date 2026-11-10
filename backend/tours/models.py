import uuid
from django.db import models
from django.utils.text import slugify

class Tour(models.Model):
    CATEGORY_CHOICES = [
        ('ebike', 'E-Bike Panoramico'),
        ('gravel', 'Gravel Adventure'),
        ('mtb', 'Mountain Bike Enduro'),
        ('trekking', 'Trekking & Sentieri'),
    ]

    DIFFICULTY_CHOICES = [
        ('Facile', 'Facile (per tutti)'),
        ('Intermedia', 'Media (cicloturisti/escursionisti abituali)'),
        ('Impegnativa', 'Impegnativa (esperti / buon allenamento)'),
    ]

    title = models.CharField('Titolo Tour', max_length=200)
    slug = models.SlugField('Slug URL', max_length=200, unique=True, blank=True)
    category = models.CharField('Categoria', max_length=30, choices=CATEGORY_CHOICES, default='ebike')
    short_description = models.CharField('Descrizione Breve', max_length=300)
    description = models.TextField('Descrizione Completa')
    difficulty = models.CharField('Difficoltà', max_length=30, choices=DIFFICULTY_CHOICES, default='Facile')
    distance_km = models.DecimalField('Distanza (km)', max_digits=5, decimal_places=1)
    elevation_gain_m = models.PositiveIntegerField('Dislivello Positivo (m)')
    estimated_duration = models.CharField('Durata Stimata', max_length=50, help_text='es. 3 h 30 min')
    price_per_person = models.DecimalField('Prezzo per Persona (€)', max_digits=6, decimal_places=2)
    cover_image = models.CharField('URL Immagine di Copertina', max_length=500, default='/images/faggeta.png')
    gpx_file_url = models.CharField('URL File GPX (Amazon S3)', max_length=500, blank=True)
    starting_point = models.CharField('Punto di Partenza', max_length=200, default='Rifugio del Rio Scuro')
    
    # Coordinates array: [[lng, lat, elevation], ...] for interactive map rendering & elevation profile
    coordinates_geojson = models.JSONField(
        'Traccia Coordinate GPS (GeoJSON/LineString)',
        default=list,
        blank=True,
        help_text='Array di punti [longitudine, latitudine, elevazione] per mappa e navigatore'
    )
    
    bike_rental_available = models.BooleanField('Noleggio Bici Disponibile', default=True)
    is_featured = models.BooleanField('In Evidenza sulla Home', default=False)
    created_at = models.DateTimeField('Data Creazione', auto_now_add=True)
    updated_at = models.DateTimeField('Ultimo Aggiornamento', auto_now=True)

    class Meta:
        verbose_name = 'Tour Outdoor'
        verbose_name_plural = 'Tour Outdoor'
        ordering = ['distance_km']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_category_display()}) - {self.distance_km} km"


class Waypoint(models.Model):
    POI_TYPE_CHOICES = [
        ('viewpoint', 'Punto Panoramico'),
        ('water_source', 'Sorgente / Ristoro'),
        ('refuge', 'Rifugio / Malga'),
        ('cultural', 'Punto di Interesse Culturale/Naturale'),
        ('audio_cue', 'Guida Vocale GPS'),
    ]

    tour = models.ForeignKey(Tour, on_delete=models.CASCADE, related_name='waypoints')
    title = models.CharField('Nome Punto di Interesse', max_length=150)
    description = models.TextField('Note descrittive o testo voce narrante')
    poi_type = models.CharField('Tipo POI', max_length=30, choices=POI_TYPE_CHOICES, default='viewpoint')
    lat = models.FloatField('Latitudine GPS')
    lng = models.FloatField('Longitudine GPS')
    elevation_m = models.IntegerField('Quota s.l.m. (m)', default=850)
    km_marker = models.FloatField('Chilometro del percorso', default=0.0)
    audio_guide_url = models.CharField(
        'URL Traccia Audio Guida Vocale (Amazon S3)',
        max_length=500,
        blank=True,
        help_text='File MP3 riprodotto automaticamente dall’app React Native all’avvicinarsi al waypoint'
    )
    order = models.PositiveSmallIntegerField('Ordine lungo il tracciato', default=1)

    class Meta:
        verbose_name = 'Punto di Interesse / Audio Guida'
        verbose_name_plural = 'Punti di Interesse / Audio Guide'
        ordering = ['order', 'km_marker']

    def __str__(self):
        return f"km {self.km_marker}: {self.title} ({self.tour.title})"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'In attesa di conferma'),
        ('confirmed', 'Confermata'),
        ('completed', 'Completata'),
        ('cancelled', 'Annullata'),
    ]

    booking_code = models.CharField('Codice Prenotazione', max_length=20, unique=True, editable=False)
    tour = models.ForeignKey(Tour, on_delete=models.PROTECT, related_name='bookings')
    customer_name = models.CharField('Nome e Cognome', max_length=150)
    customer_email = models.EmailField('Indirizzo Email')
    customer_phone = models.CharField('Telefono Cellulare', max_length=30, blank=True)
    tour_date = models.DateField('Data dell’uscita')
    participants_count = models.PositiveSmallIntegerField('Numero Partecipanti', default=1)
    bike_rental_needed = models.BooleanField('Richiesta noleggio E-Bike/Gravel', default=False)
    total_price = models.DecimalField('Prezzo Totale (€)', max_digits=8, decimal_places=2, default=0)
    notes = models.TextField('Note o richieste speciali', blank=True)
    status = models.CharField('Stato', max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('Data Prenotazione', auto_now_add=True)

    class Meta:
        verbose_name = 'Prenotazione'
        verbose_name_plural = 'Prenotazioni'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.booking_code:
            self.booking_code = f"OUT-{uuid.uuid4().hex[:8].upper()}"
        if not self.total_price and self.tour:
            price_base = self.tour.price_per_person * self.participants_count
            rental_extra = (25 * self.participants_count) if self.bike_rental_needed else 0
            self.total_price = price_base + rental_extra
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.booking_code} - {self.customer_name} ({self.tour.title})"

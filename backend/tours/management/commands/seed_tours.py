from django.core.management.base import BaseCommand
from tours.models import Tour, Waypoint

class Command(BaseCommand):
    help = 'Popola il database Outdoora con i tour cicloturistici ed escursionistici più iconici della Sicilia'

    def handle(self, *args, **options):
        self.stdout.write('Inizio popolamento itinerari della Sicilia...')

        # Tour 1: Pista Altomontana dell'Etna (Gravel)
        t1, _ = Tour.objects.update_or_create(
            slug='pista-altomontana-etna',
            defaults={
                'title': 'Pista Altomontana dell’Etna: Crateri & Lave',
                'category': 'gravel',
                'short_description': 'L’itinerario gravel per eccellenza in Sicilia. Un anello leggendario su piste battute e basalto lavico tra pini larici, colate storiche e rifugi alpini.',
                'description': 'Un percorso circolare leggendario a quota 1700-1900 metri che abbraccia il vulcano attivo più alto d’Europa da ovest a nord. Pedalando su fondo vulcanico compatto si attraversano deserti di cenere nera, antichi tunnel di scorrimento lavico e la suggestiva faggeta di Timparossa.',
                'difficulty': 'Intermedia',
                'distance_km': 36.0,
                'elevation_gain_m': 780,
                'estimated_duration': '3 h 45 min',
                'price_per_person': 45.00,
                'cover_image': '/images/crinale.png',
                'gpx_file_url': 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/altomontana-etna.gpx',
                'starting_point': 'Piano Vetore / Rifugio Sapienza (Nicolosi)',
                'bike_rental_available': True,
                'is_featured': True,
                'coordinates_geojson': [
                    [14.982, 37.698, 1740],
                    [14.945, 37.721, 1820],
                    [14.928, 37.749, 1875],
                    [14.935, 37.785, 1810],
                    [14.972, 37.810, 1745],
                    [15.015, 37.822, 1840],
                    [15.042, 37.795, 1800],
                    [14.982, 37.698, 1740],
                ]
            }
        )

        Waypoint.objects.filter(tour=t1).delete()
        Waypoint.objects.create(
            tour=t1,
            title='Rifugio Galvarina (1875 m)',
            description='Bivacco storico della forestale in pietra lavica. Vista spettacolare sulla Piana di Catania e sui Monti Erei.',
            poi_type='refuge',
            lat=37.749,
            lng=14.928,
            elevation_m=1875,
            km_marker=8.4,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-galvarina.mp3',
            order=1
        )
        Waypoint.objects.create(
            tour=t1,
            title='Grotta dei Lamponi (1745 m)',
            description='Tunnel lavico scavato dal flusso magmatico dell’eruzione decennale del 1614. Visita con luce frontale.',
            poi_type='cultural',
            lat=37.810,
            lng=14.972,
            elevation_m=1745,
            km_marker=21.3,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-lamponi.mp3',
            order=2
        )
        Waypoint.objects.create(
            tour=t1,
            title='Faggeta di Timparossa (1840 m)',
            description='La faggeta più a sud d’Europa: oasi ombreggiata di faggi secolari circondata da colate laviche recenti.',
            poi_type='viewpoint',
            lat=37.822,
            lng=15.015,
            elevation_m=1840,
            km_marker=28.6,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/etna-timparossa.mp3',
            order=3
        )

        # Tour 2: Dorsale dei Nebrodi (E-Bike)
        t2, _ = Tour.objects.update_or_create(
            slug='dorsale-nebrodi-maulazzo',
            defaults={
                'title': 'Dorsale dei Nebrodi: Lago Maulazzo & Monte Soro',
                'category': 'ebike',
                'short_description': 'Immergiti nella foresta più grande della Sicilia in sella a una E-MTB: strade d’alta quota, faggi secolari e mandrie di cavalli Sanfratellani.',
                'description': 'La classica traversata dei Nebrodi su pista forestale panoramica. Si costeggia il Lago Maulazzo dalle acque smeraldo e si conquista la cima di Monte Soro (1847 m), la vetta più alta della catena con vista fino al Mar Tirreno e alle Isole Eolie.',
                'difficulty': 'Facile',
                'distance_km': 31.0,
                'elevation_gain_m': 680,
                'estimated_duration': '3 h 15 min',
                'price_per_person': 42.00,
                'cover_image': '/images/faggeta.png',
                'gpx_file_url': 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/nebrodi-maulazzo.gpx',
                'starting_point': 'Portella Femmina Morta (Cesarò)',
                'bike_rental_available': True,
                'is_featured': True,
                'coordinates_geojson': [
                    [14.652, 37.915, 1524],
                    [14.668, 37.925, 1440],
                    [14.695, 37.938, 1680],
                    [14.698, 37.942, 1847],
                    [14.675, 37.930, 1610],
                    [14.652, 37.915, 1524],
                ]
            }
        )

        Waypoint.objects.filter(tour=t2).delete()
        Waypoint.objects.create(
            tour=t2,
            title='Lago Maulazzo',
            description='Bacino lacustre montano specchio delle maestose faggete di Sollazzo Verde.',
            poi_type='water_source',
            lat=37.925,
            lng=14.668,
            elevation_m=1440,
            km_marker=7.5,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/nebrodi-maulazzo.mp3',
            order=1
        )
        Waypoint.objects.create(
            tour=t2,
            title='Vetta di Monte Soro (1847 m)',
            description='Il tetto dei Nebrodi. La guida vocale descrive la vista verso Stromboli e Vulcano nelle giornate limpide.',
            poi_type='viewpoint',
            lat=37.942,
            lng=14.698,
            elevation_m=1847,
            km_marker=15.8,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/nebrodi-montesoro.mp3',
            order=2
        )

        # Tour 3: Gole dell'Alcantara (Trekking & Canyon)
        t3, _ = Tour.objects.update_or_create(
            slug='canyon-alcantara-gurne',
            defaults={
                'title': 'Gole dell’Alcantara: Canyon Basaltico & Gurne',
                'category': 'trekking',
                'short_description': 'Un’avventura a piedi tra le pareti prismatiche di basalto vulcanico raffreddate dal fiume, piscine naturali e agrumeti in fiore.',
                'description': 'Risalita fluviale lungo il Parco Fluviale dell’Alcantara. Si attraversano le suggestive gurne (piscine d’acqua naturale nella lava) e antichi mulini medievali, fino al celebre canyon dalle colonne prismatiche a canne d’organo.',
                'difficulty': 'Facile',
                'distance_km': 9.5,
                'elevation_gain_m': 320,
                'estimated_duration': '3 h 30 min',
                'price_per_person': 32.00,
                'cover_image': '/images/torrente.png',
                'gpx_file_url': 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/gole-alcantara.gpx',
                'starting_point': 'Francavilla di Sicilia',
                'bike_rental_available': False,
                'is_featured': True,
                'coordinates_geojson': [
                    [15.132, 37.895, 330],
                    [15.148, 37.886, 330],
                    [15.165, 37.880, 420],
                    [15.178, 37.876, 310],
                    [15.132, 37.895, 330],
                ]
            }
        )

        Waypoint.objects.filter(tour=t3).delete()
        Waypoint.objects.create(
            tour=t3,
            title='Gurne Fluviali di Francavilla',
            description='Bacini d’acqua trasparente incastonati nel basalto. Sosta ideale per rinfrescarsi i piedi.',
            poi_type='water_source',
            lat=37.886,
            lng=15.148,
            elevation_m=330,
            km_marker=3.2,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/alcantara-gurne.mp3',
            order=1
        )
        Waypoint.objects.create(
            tour=t3,
            title='Canyon delle Colonne Basaltiche',
            description='Pareti verticali scolpite oltre 8.000 anni fa dal raffreddamento rapido della colata a contatto con le acque gelide.',
            poi_type='viewpoint',
            lat=37.876,
            lng=15.178,
            elevation_m=310,
            km_marker=8.8,
            audio_guide_url='https://outdoora-assets.s3.eu-south-1.amazonaws.com/audio/alcantara-canyon.mp3',
            order=2
        )

        # Tour 4: Riserva Naturale dello Zingaro (Trekking Costiero)
        t4, _ = Tour.objects.update_or_create(
            slug='riserva-zingaro-scopello',
            defaults={
                'title': 'Riserva dello Zingaro: Il Sentiero Costiero',
                'category': 'trekking',
                'short_description': 'Il trekking costiero più iconico della Sicilia: mare turchese, palme nane e calette solitarie da Scopello a San Vito Lo Capo.',
                'description': 'Primo parco naturale istituito in Sicilia. Cammino a picco sul mare cobalto circondati dalla palma nana e dalla macchia mediterranea incontaminata, con soste bagno nelle calette bianche di ciottoli.',
                'difficulty': 'Intermedia',
                'distance_km': 14.0,
                'elevation_gain_m': 450,
                'estimated_duration': '4 h 30 min',
                'price_per_person': 36.00,
                'cover_image': '/images/hero-bosco.png',
                'gpx_file_url': 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/riserva-zingaro.gpx',
                'starting_point': 'Tonnara di Scopello (Castellammare)',
                'bike_rental_available': False,
                'is_featured': True,
                'coordinates_geojson': [
                    [12.822, 38.075, 40],
                    [12.818, 38.090, 15],
                    [12.805, 38.115, 320],
                    [12.790, 38.140, 20],
                ]
            }
        )

        # Tour 5: Canyon di Pantalica (Gravel & Archeologia)
        t5, _ = Tour.objects.update_or_create(
            slug='canyon-pantalica-gravel',
            defaults={
                'title': 'Gravel Pantalica: Valle dell’Anapo & Necropoli',
                'category': 'gravel',
                'short_description': 'Un itinerario magico sull’ex ferrovia a scartamento ridotto tra le gole del fiume Anapo e le 5.000 tombe rupestri Patrimonio UNESCO.',
                'description': 'Pedalata fluida e spettacolare sul tracciato dell’antica ferrovia Ciclope. Gallerie scavate a mano nella roccia, ponticelli in ferro sul torrente Anapo e la vista sbalorditiva sulla necropoli rupestre preistorica scavata nella falesia.',
                'difficulty': 'Facile',
                'distance_km': 26.0,
                'elevation_gain_m': 390,
                'estimated_duration': '2 h 45 min',
                'price_per_person': 38.00,
                'cover_image': '/images/rifugio.png',
                'gpx_file_url': 'https://outdoora-assets.s3.eu-south-1.amazonaws.com/gpx/pantalica-anapo.gpx',
                'starting_point': 'Ex Stazione di Cassaro-Ferla',
                'bike_rental_available': True,
                'is_featured': True,
                'coordinates_geojson': [
                    [15.012, 37.125, 220],
                    [15.035, 37.138, 260],
                    [15.060, 37.142, 340],
                    [15.045, 37.135, 290],
                    [15.012, 37.125, 220],
                ]
            }
        )

        self.stdout.write(self.style.SUCCESS('Database popolato con successo con 5 itinerari siciliani (Etna, Nebrodi, Alcantara, Zingaro, Pantalica)!'))

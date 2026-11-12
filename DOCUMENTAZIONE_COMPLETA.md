# 🌋 Wild Sicily · Outdoora Experience Platform
## Documentazione Tecnica e Funzionale Completa

---

## 📑 Indice dei Contenuti
1. [Visione del Progetto e Valore di Business](#1-visione-del-progetto-e-valore-di-business)
2. [Panoramica dell’Architettura di Sistema](#2-panoramica-dellarchitettura-di-sistema)
3. [Descrizione Dettagliata delle Sezioni Web (Next.js)](#3-descrizione-dettagliata-delle-sezioni-web-nextjs)
4. [Gli Itinerari Caratteristici della Sicilia](#4-gli-itinerari-caratteristici-della-sicilia)
5. [La Scena 3D Immersiva e Procedurale (Three.js & R3F)](#5-la-scena-3d-immersiva-e-procedurale-threejs--r3f)
6. [Visualizzatore GPX, Altimetria e Waypoints Audio](#6-visualizzatore-gpx-altimetria-e-waypoints-audio)
7. [Architettura Backend e API REST (Django)](#7-architettura-backend-e-api-rest-django)
8. [Modulo Mobile e Navigazione GPS Vocale (React Native)](#8-modulo-mobile-e-navigazione-gps-vocale-react-native)
9. [Cloud, Storage e Strategia di Deployment](#9-cloud-storage-e-strategia-di-deployment)
10. [Guida alla Presentazione per la Candidatura Outdoora](#10-guida-alla-presentazione-per-la-candidatura-outdoora)

---

## 1. Visione del Progetto e Valore di Business

Il progetto **"Wild Sicily · Outdoora Experience"** nasce come piattaforma integrata per il turismo attivo e sostenibile in Sicilia, incentrata sui più celebri percorsi in **bicicletta (Gravel, E-Bike)** ed escursioni a piedi: dall'anello vulcanico dell'**Etna** alle faggete dei **Nebrodi**, dal canyon delle **Gole dell'Alcantara** alla costa incontaminata della **Riserva dello Zingaro** e della necropoli di **Pantalica**.

### Obiettivi chiave:
* **Coinvolgimento Emozionale**: superare la classica landing page turistica statica offrendo un'esperienza 3D fotorealistica interattiva in WebGL, che porta l'utente letteralmente "dentro il bosco" mentre naviga.
* **Auto-Guida Intelligente**: digitalizzare i percorsi outdoor con tracce GPX verificate e punti di interesse (POI) geolocalizzati, integrati con la navigazione vocale per smartphone.
* **Ecosistema Unificato**: collegare il portale web Next.js a un backend robusto in Django per la gestione dei tour e delle prenotazioni, condividendo gli stessi modelli dati con l'applicazione mobile per i ciclisti.

---

## 2. Panoramica dell’Architettura di Sistema

L'ecosistema si suddivide in 4 livelli logici modulari:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND WEB (Next.js 16)                       │
│  - Landing Page Reattiva (App Router, React 19, TypeScript)            │
│  - Scena 3D procedurale in Three.js sincronizzata allo scroll          │
│  - Modalità Esplorazione Libera FPS (WASD + mouse pointer lock)        │
│  - Modal GPX con grafico altimetrico vettoriale SVG                    │
│  - Form di prenotazione e noleggio con calcolo preventivi              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Chiamate REST (JSON)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND API (Django 5.1)                        │
│  - Django REST Framework (DRF) per endpoint pubblici e privati         │
│  - Modelli: Tour, Waypoint con guida vocale, Booking con codici univoci│
│  - Pannello Django Admin personalizzato per tour operator              │
│  - Gestione database (SQLite per dev, PostgreSQL per produzione)       │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌─────────────────────────────────────┐ ┌────────────────────────────────┐
│      AMAZON S3 / CLOUD STORAGE      │ │   MOBILE APP (React Native)    │
│  - Tracciati GPX dei sentieri       │ │  - Tracciamento GPS ciclista   │
│  - File audio MP3 delle guide vocali│ │  - Geofencing Haversine (35m)  │
│  - Fotografie e media ad alta ris.  │ │  - Audio guida vocale automatica│
└─────────────────────────────────────┘ └────────────────────────────────┘
```

---

## 3. Descrizione Dettagliata delle Sezioni Web (Next.js)

L'applicazione web è una *Single Page Application* con routing avanzato in Next.js 16:

### 3.1 Header Fisso (`components/site/header.tsx`)
* Barra di navigazione trasparente con effetto *blur* e gradiente scuro.
* Include il brand "Faggeta Alta · Outdoora Experience", i link di ancoraggio rapido (`#percorsi`, `#metodo`, `#guida`, `#rifugio`, `#prenota`).
* Pulsante interattivo **"Outdoora Stack"** che apre la modale descrittiva dell'architettura tecnica per i selezionatori.

### 3.2 Sezione Hero (`components/site/hero.tsx`)
* Schermata iniziale d'impatto visivo con tipografia curata (Bricolage Grotesque).
* Badge di categoria (*"Trekking & Gravel/E-Bike"*).
* Call to Action primarie: *"Scopri i Tour & GPX"*, *"Prenota Tour o Bici"* e il launcher **"Esplora il bosco in 3D"**.
* Indicatore animato di scroll verso il basso.

### 3.3 Sezione Filosofia & Metodo (`components/site/method.tsx`)
* Presentazione del valore aggiunto: piccoli gruppi (massimo 8 persone per minimizzare il disturbo alla fauna), guide naturalistiche certificate e partenze strategiche all'alba.

### 3.4 Vetrina Tour & Schede Tecniche (`components/site/trails.tsx`)
* **Filtro Categorie**: pulsanti a pillola per filtrare istantaneamente tra *"Tutti i Tour"*, *"Gravel & All-Road"*, *"E-Bike Panoramico"* e *"Trekking a Piedi"*.
* **Schede Tour**: ogni card mostra copertina, badge livello di difficoltà, disponibilità noleggio e-bike, distanza in km, dislivello positivo (+m), durata stimata e prezzo per persona.
* **Tasto "Mappa & GPX"**: apre il visualizzatore cartografico e altimetrico dedicato.

### 3.5 La Guida Naturalistica (`components/site/guide.tsx`)
* Profilo biografico e certificazione GAE (Guida Ambientale Escursionistica), che trasmette fiducia e professionalità al cliente finale.

### 3.6 Il Rifugio nel Bosco (`components/site/refuge.tsx`)
* Presentazione del punto di sosta in quota (Rifugio del Cervo): cena con prodotti tipici, ricarica per le biciclette elettriche e pernottamento sotto le stelle.

### 3.7 Form di Prenotazione e Noleggio (`components/site/booking.tsx`)
* Selezione del tour e della data desiderata.
* Selezione del numero di partecipanti.
* **Checkbox Noleggio Bici**: calcola in tempo reale il costo aggiuntivo del noleggio di biciclette E-Bike o Gravel.
* **Invio al Backend**: effettua una chiamata `POST` alle API Django (`/api/bookings/`) e restituisce una ricevuta visiva con codice univoco `OUT-XXXXXXXX` e riepilogo dei costi.

### 3.8 Footer (`components/site/footer.tsx`)
* Recapiti, orari del centro outdoor e copyright.

---

## 4. Gli Itinerari Caratteristici della Sicilia

Il catalogo comprende 5 tour iconici georeferenziati con tracce GPX, altimetria e waypoint audio:

### 4.1 Pista Altomontana dell’Etna: Crateri & Lave (Gravel / All-Road)
* **Distanza**: 36.0 km | **Dislivello**: +780 m | **Quota**: 1700-1900 m s.l.m.
* **Partenza**: Piano Vetore / Rifugio Sapienza (Nicolosi).
* **Descrizione**: L’itinerario gravel più celebre della Sicilia. Un anello vulcanico su sterrato compatto che circonda l'Etna da ovest a nord. Attraversa colate laviche storiche, deserti di cenere nera, la Grotta dei Lamponi (tunnel lavico del 1614) e la faggeta di Timparossa.

### 4.2 Dorsale dei Nebrodi: Lago Maulazzo & Monte Soro (E-Bike Panoramica)
* **Distanza**: 31.0 km | **Dislivello**: +680 m | **Quota max**: 1847 m s.l.m.
* **Partenza**: Portella Femmina Morta (Cesarò).
* **Descrizione**: Pedalata assistita nel polmone verde della Sicilia tra le faggete più imponenti dell'isola, le sponde smeraldo del Lago Maulazzo e la conquista della cima di Monte Soro, con vista sulle Isole Eolie.

### 4.3 Gole dell’Alcantara: Canyon Basaltico & Gurne (Trekking Fluviale)
* **Distanza**: 9.5 km | **Dislivello**: +320 m
* **Partenza**: Francavilla di Sicilia / Castiglione.
* **Descrizione**: Escursione a piedi lungo il fiume Alcantara tra prismi basaltici colonnari unici al mondo, laghetti naturali balneabili (gurne) e agrumeti in fiore.

### 4.4 Riserva Naturale dello Zingaro: Il Sentiero Costiero (Trekking Costiero)
* **Distanza**: 14.0 km | **Dislivello**: +450 m
* **Partenza**: Tonnara di Scopello (Castellammare del Golfo).
* **Descrizione**: Il trekking litoraneo più spettacolare dell'isola. Sentieri a picco sul mare cobalto tra palme nane, calette di ciottoli bianchi (Cala Capreria) e l'antico borgo contadino di Cusenza.

### 4.5 Gravel Pantalica: Valle dell’Anapo & Necropoli (Gravel & Archeologia)
* **Distanza**: 26.0 km | **Dislivello**: +390 m
* **Partenza**: Ex Stazione ferroviaria di Cassaro-Ferla.
* **Descrizione**: Pedalata lungo la vecchia ferrovia a scartamento ridotto trasformata in ciclabile verde sterrata, tra le gole del fiume Anapo e le oltre 5.000 tombe a grotticella scavate nella roccia (Patrimonio UNESCO).

---

## 5. La Scena 3D Immersiva e Procedurale (Three.js & R3F)

La caratteristica tecnica più spettacolare del sito è la scena 3D renderizzata in WebGL via `@react-three/fiber` e Three.js, adattata per ricreare l'ambiente naturale dei **boschi siciliani** (Etna e Nebrodi).

### 5.1 Meccanica dello Scroll Cinematico (`components/forest/forest-canvas.tsx` & `scene.tsx`)
* Lo sfondo è un elemento `<Canvas>` unico a schermo intero (`fixed inset-0`).
* Un listener di scroll calcola il progresso continuo `window.scrollY / maxScroll` compreso tra 0 e 1.
* Nel ciclo di rendering (`useFrame`), una telecamera virtuale interpola la propria posizione lungo una spline tridimensionale (`CatmullRomCurve3` definita in `lib/forest-data.ts`).
* Man mano che l'utente scorre la pagina, la telecamera "cammina" lungo il sentiero, con un leggero beccheggio naturale del passo (*head bobbing*), fino ad arrivare al rifugio illuminato da una lanterna a fine pagina.

### 5.2 Ambientazione Siciliana & Generazione Procedurale
* **Botanica e Geologia Siciliana (`ground.tsx` & `undergrowth.tsx`)**:
  * **Terreno Vulcanico**: sfumature di basalto e lapilli scuri dell'Etna lungo il sentiero miscelati a muschio e aghi di pino.
  * **Ginestra dell'Etna (*Genista aetnensis*)**: 160 cespugli con fioritura giallo oro brillante sparsi lungo il percorso.
  * **Rocce Basaltiche**: massi lavici scuri ad alta porosità.
  * **Pini Larici e Faggi**: alberi vetusti tipici di Ragabo, Timparossa e dei Nebrodi.
  * **Atmosfera Mediterranea (`atmosphere.tsx`)**: cielo azzurro limpido e luce solare calda e dorata.
* **Zero modelli pesanti da scaricare**: tronchi, rami e fogliame (`lib/tree-geometry.ts`) e texture Canvas 2D (`lib/procedural-textures.ts`) vengono generati proceduralmente all'avvio.
* **InstancedMesh (`components/forest/trees.tsx`)**: centinaia di alberi e arbusti disegnati con pochissime *draw call* alla GPU, garantendo 60 FPS stabili.
* **Post-Processing Cinematico**: *Bloom* (bagliore lanterna/sole), *Vignette* e *Tone Mapping ACES Filmic*.

### 5.3 Modalità Esplorazione Libera in Prima Persona (`components/forest/forest-explorer.tsx`)
* **Architettura a Canvas Unico (`lib/explorer-state.ts`)**: il passaggio tra scroll e gioco 3D avviene sullo stesso contesto WebGL per garantire zero latenza e nessun conflitto sulle texture GPU.
* **Fisica sul Terreno**: la telecamera in prima persona calcola dinamicamente ad ogni frame `heightAt(x, z) + 1.75` mantenendo sempre l'altezza degli occhi al di sopra delle colline del sentiero.
* **Controlli FPS**: `PointerLockControls` per guardarsi intorno a 360° col mouse e tasti **W, A, S, D** o frecce direzionali per camminare liberamente.

---

## 6. Visualizzatore GPX, Altimetria e Waypoints Audio

Creato nel componente `components/site/trail-map-modal.tsx`:
* **Traccia Vettoriale Interattiva**: visualizza la curva del sentiero e la dislocazione spaziale dei waypoint.
* **Waypoints Cliccabili**: cliccando sui pin (Rifugio Galvarina, Grotta dei Lamponi, Lago Maulazzo, ecc.) vengono mostrate quota altimetrica, descrizione e indicatore della voce narrante.
* **Profilo Altimetrico SVG**: diagramma vettoriale dinamico calcolato in base alle quote del percorso (+m dislivello vs km percorsi).
* **Download Traccia GPX**: pulsante che consente all'utente di scaricare il file GPX per caricarlo sul proprio ciclocomputer (Garmin, Wahoo, Bryton) o aprirlo con l'app mobile.

---

## 7. Architettura Backend e API REST (Django)

La cartella `backend/` ospita un'applicazione solida in **Django 5.1** e **Django REST Framework**:

### 7.1 Struttura del Backend
```
backend/
├── manage.py
├── requirements.txt           # Django, DRF, django-cors-headers, boto3, whitenoise
├── Procfile                   # Comando di avvio per Heroku Gunicorn
├── .env.example               # Configurazione PostgreSQL, AWS S3 e CORS
├── outdoora_backend/          # Configurazione centrale, middleware e routing
└── tours/                     # Applicazione di dominio
    ├── models.py              # Modelli Tour, Waypoint, Booking
    ├── serializers.py         # Serializzatori JSON DRF
    ├── views.py               # ViewSet con filtri per categoria e difficoltà
    ├── admin.py               # Interfaccia CMS per operatori
    └── management/commands/
        └── seed_tours.py      # Popolamento dati iniziale (Etna, Nebrodi, Alcantara, Zingaro, Pantalica)
```

### 7.2 Endpoint API REST Principali
| Metodo | Endpoint | Descrizione |
| :--- | :--- | :--- |
| `GET` | `/api/` | Informazioni generali sullo stato del servizio e tech stack |
| `GET` | `/api/tours/` | Elenco di tutti i tour (supporta `?category=ebike`, `?difficulty=Facile`) |
| `GET` | `/api/tours/featured/` | Elenco dei tour in evidenza per l'Hero |
| `GET` | `/api/tours/categories/` | Elenco categorie con conteggio dei tour disponibili |
| `GET` | `/api/tours/<slug>/` | Dettaglio completo del tour con waypoints e coordinate GeoJSON |
| `POST`| `/api/bookings/` | Creazione di una nuova prenotazione (con generazione codice univoco) |
| `GET` | `/api/bookings/<code_code>/` | Dettaglio e stato di avanzamento della prenotazione |
| `GET` | `/admin/` | Interfaccia grafica amministrativa Django |

---

## 8. Modulo Mobile e Navigazione GPS Vocale (React Native)

La cartella `mobile/` implementa l'architettura dell'applicazione smartphone per i ciclisti con **React Native** ed **Expo**:

### 8.1 L'Engine di Geofencing Vocale (`mobile/src/hooks/useGpsAudioGuide.ts`)
* Il ciclista avvia il tour e ripone il telefono nel supporto manubrio.
* Il modulo GPS si registra con `Location.watchPositionAsync` a intervalli di 5 metri o 2 secondi.
* Ad ogni cambio di coordinate, viene calcolata la distanza metrica verso ciascun waypoint non ancora visitato mediante la **Formula di Haversine**:
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\varphi}{2}\right) + \cos(\varphi_1)\cos(\varphi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
* Quando la distanza scende sotto i **35 metri** (*geofence threshold*):
  1. L'ID del waypoint viene marcato come completato per evitare ripetizioni.
  2. Viene riprodotto il file audio registrato in studio (`expo-av`) caricato su Amazon S3, oppure la sintesi vocale text-to-speech multilingua (`expo-speech`).
  3. Il ciclista ascolta storie, aneddoti sul territorio e indicazioni di svolta senza dover staccare le mani dal manubrio o guardare lo schermo.

---

## 9. Cloud, Storage e Strategia di Deployment

* **Deploy Frontend Web**: Ottimizzato per **Vercel** o Heroku con zero configurazione aggiuntiva.
* **Deploy Backend API**: Predisposto con [`Procfile`](file:///c:/Users/giuse/OneDrive/Desktop/sito-trekking-boschi/backend/Procfile) (`web: gunicorn outdoora_backend.wsgi`) e middleware `whitenoise` per il rilascio immediato su **Heroku** o Railway.
* **Storage Amazon S3**: In [`backend/outdoora_backend/settings.py`](file:///c:/Users/giuse/OneDrive/Desktop/sito-trekking-boschi/backend/outdoora_backend/settings.py) è già predisposta l'integrazione con `django-storages` e `boto3`. I file statici e multimediali (tracciati GPX, audio guide MP3, foto ad alta risoluzione) possono essere serviti direttamente da un bucket AWS S3 con CDN CloudFront.

---

## 10. Guida alla Presentazione per la Candidatura Outdoora

Quando presenterai questo progetto nella candidatura o durante il colloquio con Outdoora, ecco i punti di forza da evidenziare:

1. **Allineamento Perfetto con le Esigenze di Outdoora**:
   - Hai scelto di realizzare una piattaforma nel loro stesso dominio di mercato (cicloturismo, percorsi outdoor, navigazione GPS auto-guidata).
2. **Dimostrazione Pratica dello Stack Tecnico Richiesto**:
   - Mostri padronanza di **Next.js** e **TypeScript** nel frontend.
   - Mostri padronanza di **Django** e **Django REST Framework** nel backend.
   - Mostri comprensione delle problematiche mobile di navigazione con **React Native** (geolocalizzazione, consumo batteria, geofencing, audio guide).
3. **Il Fattore "Wow" Tecnologico**:
   - L'integrazione 3D con Three.js procedurale e la modalità esploratore WASD dimostrano una cura per l'interattività grafica che va ben oltre il livello di uno sviluppatore web convenzionale.
4. **Codice Pulito e Pratico**:
   - Condivisione dei tipi dati tra client e server, gestione dei casi offline con fallback automatici e documentazione chiara.

# Outdoora Mobile App (React Native / Expo)
## Self-Guided Cyclist & Outdoor GPS Voice Navigation in Sicily

Questa cartella contiene il modulo dell'applicazione mobile sviluppata in **React Native** con **Expo**, progettata per cicloturisti ed escursionisti che affrontano tour auto-guidati in Sicilia (Etna, Nebrodi, Alcantara, Zingaro, Pantalica).

---

### Caratteristiche Principali

1. **Navigazione GPS Vocale Intelligente (`src/hooks/useGpsAudioGuide.ts`)**:
   - Tracciamento GPS in tempo reale del ciclista con `expo-location`.
   - Riconoscimento di prossimità (*Geofencing*) basato sulla formula di Haversine per identificare quando il ciclista entra nel raggio di un punto di interesse (35 metri).
   - Riproduzione automatica di file audio da **Amazon S3** (`expo-av`) o Text-to-Speech (`expo-speech`) per raccontare storia, aneddoti naturalistici e indicazioni di svolta senza dover guardare lo schermo.
   - Prevenzione delle ripetizioni: i waypoint visitati vengono memorizzati nella sessione.

2. **Visualizzazione Traccia GPX & Altimetria**:
   - Rendering su mappa interattiva del tracciato GPX (coordinate caricate dinamicamente dall'API Django).
   - Marcatori interattivi per fonti d'acqua, rifugi, bivi e punti panoramici.

3. **Integrazione API Django REST Framework (`src/services/api.ts`)**:
   - Condivisione dei tipi TypeScript (`src/types/tour.ts`) identici a quelli del portale web Next.js e del backend Django.
   - Supporto offline-first con fallback intelligente dei tour in caso di assenza di segnale cellulare nei boschi o in montagna.

---

### Struttura File

```
mobile/
├── package.json                   # Dipendenze React Native, Expo, React Navigation, Maps
├── README.md                      # Questa documentazione
└── src/
    ├── types/tour.ts              # Modelli dati condivisi (Tour, Waypoint, Booking)
    ├── services/api.ts            # Client HTTP per backend Django
    ├── hooks/
    │   └── useGpsAudioGuide.ts    # Engine di geofencing e riproduzione audio GPS
    └── screens/
        ├── TourListScreen.tsx     # Catalogo tour (E-Bike, Gravel, MTB, Trekking)
        └── GpsNavigationScreen.tsx# Schermo navigatore GPS in tempo reale con telemetria
```

### Come avviare l'app mobile

```bash
cd mobile
npm install
npm run start # Avvia Expo dev server (apribile con l'app Expo Go su Android/iOS)
```

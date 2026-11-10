import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Waypoint } from '../types/tour';

interface UseGpsAudioGuideProps {
  waypoints: Waypoint[];
  geofenceRadiusMeters?: number; // Raggio di attivazione audio in metri (default 35m)
}

/**
 * Calcola la distanza tra due coordinate geografiche in metri (Formula di Haversine)
 */
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Raggio della terra in metri
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function useGpsAudioGuide({
  waypoints,
  geofenceRadiusMeters = 35,
}: UseGpsAudioGuideProps) {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTracking, setIsTracking] = useState(false);

  // Set di ID dei waypoint già annunciati per evitare ripetizioni
  const triggeredPoiIds = useRef<Set<number>>(new Set());
  const soundRef = useRef<Audio.Sound | null>(null);

  /**
   * Riproduce il commento audio del waypoint (audio registrato da S3 oppure sintesi vocale)
   */
  async function playWaypointAudio(waypoint: Waypoint) {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    setActiveWaypoint(waypoint);

    try {
      if (waypoint.audio_guide_url) {
        // Riproduzione file audio registrato in studio
        const { sound } = await Audio.Sound.createAsync(
          { uri: waypoint.audio_guide_url },
          { shouldPlay: true }
        );
        soundRef.current = sound;
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlayingAudio(false);
          }
        });
      } else {
        // Fallback su Text-To-Speech multilingua
        const textToSpeak = `${waypoint.title}. ${waypoint.description}`;
        Speech.speak(textToSpeak, {
          language: 'it-IT',
          pitch: 1.0,
          rate: 0.95,
          onDone: () => setIsPlayingAudio(false),
          onError: () => setIsPlayingAudio(false),
        });
      }
    } catch (err) {
      console.error('Errore riproduzione audio waypoint:', err);
      setIsPlayingAudio(false);
    }
  }

  // Avvia il tracking continuo GPS
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startGps() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permessi GPS non concessi');
        return;
      }

      setIsTracking(true);
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Notifica ogni 5 metri di spostamento del ciclista
          timeInterval: 2000,   // O ogni 2 secondi
        },
        (location) => {
          const coords = location.coords;
          setCurrentLocation(coords);

          // Controlla se il ciclista è vicino a uno dei waypoint non ancora ascoltati
          for (const wp of waypoints) {
            if (triggeredPoiIds.current.has(wp.id)) continue;

            const dist = getDistanceMeters(coords.latitude, coords.longitude, wp.lat, wp.lng);
            if (dist <= geofenceRadiusMeters) {
              triggeredPoiIds.current.add(wp.id);
              playWaypointAudio(wp);
              break;
            }
          }
        }
      );
    }

    startGps();

    return () => {
      subscription?.remove();
      soundRef.current?.unloadAsync();
      Speech.stop();
    };
  }, [waypoints, geofenceRadiusMeters]);

  return {
    currentLocation,
    activeWaypoint,
    isPlayingAudio,
    isTracking,
    manuallyTriggerWaypoint: playWaypointAudio,
  };
}

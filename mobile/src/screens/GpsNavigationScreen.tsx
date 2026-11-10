import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Tour } from '../types/tour';
import { useGpsAudioGuide } from '../hooks/useGpsAudioGuide';

interface Props {
  tour: Tour;
  onExit: () => void;
}

export function GpsNavigationScreen({ tour, onExit }: Props) {
  const waypoints = tour.waypoints || [];
  const { currentLocation, activeWaypoint, isPlayingAudio, isTracking, manuallyTriggerWaypoint } =
    useGpsAudioGuide({ waypoints });

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar navigazione */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onExit}>
          <Text style={styles.backButtonText}>← Esci</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.tourTitle} numberOfLines={1}>{tour.title}</Text>
          <Text style={styles.gpsStatus}>
            {isTracking ? '🟢 GPS Agganciato (Precisione Alta)' : '🟡 Ricerca satelliti GPS...'}
          </Text>
        </View>
      </View>

      {/* Mappa / Vista Tracciato GPX */}
      <View style={styles.mapContainer}>
        {/* Rappresentazione mockup della mappa Mapbox/react-native-maps */}
        <View style={styles.mapMockup}>
          <Text style={styles.mapText}>Tracciato GPX Attivo</Text>
          <Text style={styles.mapSubtext}>
            {tour.coordinates_geojson?.length || 10} coordinate registrate
          </Text>

          {currentLocation && (
            <View style={styles.cyclistMarker}>
              <Text style={{ fontSize: 20 }}>🚴</Text>
              <Text style={styles.cyclistSpeed}>
                {Math.round((currentLocation.speed || 4.2) * 3.6)} km/h
              </Text>
            </View>
          )}

          {/* Waypoints marker lungo il sentiero */}
          <View style={styles.waypointsPreview}>
            {waypoints.map((wp, idx) => (
              <TouchableOpacity
                key={wp.id}
                style={[
                  styles.waypointPin,
                  activeWaypoint?.id === wp.id && styles.waypointPinActive,
                ]}
                onPress={() => manuallyTriggerWaypoint(wp)}
              >
                <Text style={styles.waypointPinText}>#{idx + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Scheda Guida Vocale / Audio attiva */}
      <View style={styles.bottomCard}>
        {activeWaypoint ? (
          <View>
            <View style={styles.audioPlayingHeader}>
              <Text style={styles.audioPulse}>
                {isPlayingAudio ? '🔊 GUIDA VOCALE ATTIVA' : 'ℹ️ PUNTO DI INTERESSE'}
              </Text>
              <Text style={styles.kmBadge}>km {activeWaypoint.km_marker}</Text>
            </View>
            <Text style={styles.activeTitle}>{activeWaypoint.title}</Text>
            <Text style={styles.activeDesc}>{activeWaypoint.description}</Text>
            <Text style={styles.elevationBadge}>Quota: {activeWaypoint.elevation_m} m s.l.m.</Text>
          </View>
        ) : (
          <View>
            <Text style={styles.waitingText}>
              In movimento lungo la traccia. La voce narrante si attiverà automaticamente in prossimità del prossimo punto panoramico o bivio.
            </Text>
            <Text style={styles.nextPoiHint}>
              Prossimo POI: {waypoints[0]?.title || 'Rifugio'} (+{waypoints[0]?.km_marker || 4} km)
            </Text>
          </View>
        )}

        <View style={styles.telemetryRow}>
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryVal}>{tour.distance_km} km</Text>
            <Text style={styles.telemetryLabel}>Distanza</Text>
          </View>
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryVal}>+{tour.elevation_gain_m} m</Text>
            <Text style={styles.telemetryLabel}>Dislivello</Text>
          </View>
          <View style={styles.telemetryItem}>
            <Text style={styles.telemetryVal}>{waypoints.length}</Text>
            <Text style={styles.telemetryLabel}>Punti Audio</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#071510' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0f241a',
    borderBottomWidth: 1,
    borderBottomColor: '#1d3e2f',
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1b3a2c',
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: { color: '#ffffff', fontWeight: 'bold' },
  headerInfo: { flex: 1 },
  tourTitle: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  gpsStatus: { color: '#7de0a3', fontSize: 11, marginTop: 2 },
  mapContainer: { flex: 1, position: 'relative' },
  mapMockup: {
    flex: 1,
    backgroundColor: '#13281f',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1e4031',
    margin: 12,
    borderRadius: 16,
  },
  mapText: { color: '#f1c56b', fontSize: 16, fontWeight: 'bold' },
  mapSubtext: { color: '#88a897', fontSize: 12, marginTop: 4 },
  cyclistMarker: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#1c3e30',
    padding: 10,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#f1c56b',
  },
  cyclistSpeed: { color: '#ffffff', fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  waypointsPreview: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 24,
  },
  waypointPin: {
    backgroundColor: '#274f3d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  waypointPinActive: {
    backgroundColor: '#f1c56b',
  },
  waypointPinText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
  bottomCard: {
    backgroundColor: '#10251c',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#234436',
  },
  audioPlayingHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  audioPulse: { color: '#f1c56b', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
  kmBadge: { color: '#88a897', fontSize: 12 },
  activeTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  activeDesc: { color: '#d2ded8', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  elevationBadge: { color: '#f1c56b', fontSize: 12, fontWeight: '600' },
  waitingText: { color: '#a0b3a8', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  nextPoiHint: { color: '#f1c56b', fontSize: 13, fontWeight: '600' },
  telemetryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1d3e2f',
  },
  telemetryItem: { alignItems: 'center' },
  telemetryVal: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  telemetryLabel: { color: '#88a897', fontSize: 11, marginTop: 2 },
});

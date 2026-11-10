import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { OutdooraApi } from '../services/api';
import { Tour } from '../types/tour';

interface Props {
  onSelectTour: (tour: Tour) => void;
}

export function TourListScreen({ onSelectTour }: Props) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await OutdooraApi.getTours(selectedCategory);
      setTours(data);
      setLoading(false);
    }
    load();
  }, [selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.badge}>OUTDOORA GPS TOURS</Text>
        <Text style={styles.title}>Scegli la tua avventura</Text>
        <Text style={styles.subtitle}>
          Tour cicloturistici auto-guidati con navigazione vocale intelligente
        </Text>
      </View>

      {/* Filtri categoria */}
      <View style={styles.filterRow}>
        {[
          { id: 'all', label: 'Tutti' },
          { id: 'ebike', label: 'E-Bike' },
          { id: 'gravel', label: 'Gravel' },
          { id: 'trekking', label: 'Trekking' },
        ].map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.filterChip, selectedCategory === cat.id && styles.filterChipActive]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text
              style={[styles.filterText, selectedCategory === cat.id && styles.filterTextActive]}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#f1c56b" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={tours}
          keyExtractor={(item) => item.slug}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelectTour(item)}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardCategory}>{item.category_display}</Text>
                <Text style={styles.cardDifficulty}>{item.difficulty_display}</Text>
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.short_description}
              </Text>
              <View style={styles.statsRow}>
                <Text style={styles.stat}>🚴 {item.distance_km} km</Text>
                <Text style={styles.stat}>⛰️ +{item.elevation_gain_m} m</Text>
                <Text style={styles.stat}>⏱️ {item.estimated_duration}</Text>
              </View>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => onSelectTour(item)}
              >
                <Text style={styles.navButtonText}>Avvia Navigazione GPS</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0c1a14' },
  header: { padding: 20 },
  badge: { color: '#f1c56b', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#ffffff', fontSize: 26, fontWeight: 'bold', marginTop: 4 },
  subtitle: { color: '#a0b3a8', fontSize: 14, marginTop: 4 },
  filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 12, gap: 8 },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#162e24',
    borderWidth: 1,
    borderColor: '#244537',
  },
  filterChipActive: { backgroundColor: '#f1c56b', borderColor: '#f1c56b' },
  filterText: { color: '#d2ded8', fontSize: 13, fontWeight: '500' },
  filterTextActive: { color: '#0c1a14', fontWeight: 'bold' },
  list: { padding: 20, gap: 16 },
  card: {
    backgroundColor: '#13281f',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#234436',
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  cardCategory: { color: '#f1c56b', fontSize: 12, fontWeight: '600' },
  cardDifficulty: { color: '#88a897', fontSize: 12 },
  cardTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  cardDesc: { color: '#a0b3a8', fontSize: 13, lineHeight: 18, marginBottom: 12 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  stat: { color: '#c9ded3', fontSize: 13 },
  navButton: {
    backgroundColor: '#f1c56b',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  navButtonText: { color: '#0c1a14', fontWeight: 'bold', fontSize: 14 },
});

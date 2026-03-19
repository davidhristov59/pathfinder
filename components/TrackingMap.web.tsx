import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Coordinate } from '../services/distance';

interface TrackingMapProps {
  coordinates: Coordinate[];
  currentLocation: Coordinate | null;
  isTracking: boolean;
  staticMode?: boolean;
}

export default function TrackingMap({
  coordinates,
  currentLocation,
  isTracking,
  staticMode = false,
}: TrackingMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Map View</Text>
        <Text style={styles.subtitle}>
          Maps are only available on iOS & Android.
        </Text>
        {currentLocation && (
          <Text style={styles.coords}>
            📍 {currentLocation.latitude.toFixed(5)}, {currentLocation.longitude.toFixed(5)}
          </Text>
        )}
        {coordinates.length > 0 && (
          <Text style={styles.info}>
            {coordinates.length} point{coordinates.length !== 1 ? 's' : ''} recorded
          </Text>
        )}
        {isTracking && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>● TRACKING</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1E293B',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F1F5F9',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  coords: {
    fontSize: 13,
    color: '#6366F1',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    color: '#94A3B8',
  },
  badge: {
    marginTop: 16,
    backgroundColor: '#6366F130',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#6366F1',
    fontWeight: '600',
    fontSize: 12,
  },
});

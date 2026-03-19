import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline, UrlTile } from 'react-native-maps';
import { MAPTILER_TILE_URL, MAPTILER_ATTRIBUTION } from '../constants/mapTiler';
import { Coordinate } from '../services/distance';
import CurrentLocationDot from './CurrentLocationDot';

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
  const initialRegion = useMemo(() => {
    if (coordinates.length > 0) {
      return {
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    } else if (currentLocation) {
      return {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }
    return {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 100,
      longitudeDelta: 100,
    };
  }, []);

  const bottomLeftCoord = useMemo(() => {
    if (coordinates.length > 0) {
      return coordinates[0];
    } else if (currentLocation) {
      return currentLocation;
    }
    return { latitude: -80, longitude: -180 };
  }, [coordinates, currentLocation]);

  return (
    <MapView
      style={StyleSheet.absoluteFillObject}
      provider={undefined}
      mapType="none"
      showsUserLocation={false}
      initialRegion={initialRegion}
    >
      <UrlTile
        urlTemplate={MAPTILER_TILE_URL}
        maximumZ={19}
        flipY={false}
        tileSize={256}
      />
      {/* Attribution — required by MapTiler ToS */}
      <Marker coordinate={bottomLeftCoord} anchor={{ x: 0, y: 1 }}>
        <Text style={{ fontSize: 9, color: '#555' }}>{MAPTILER_ATTRIBUTION}</Text>
      </Marker>
      {(isTracking || staticMode) && coordinates.length > 1 && (
        <Polyline
          coordinates={coordinates}
          strokeColor="#6366F1"
          strokeWidth={4}
        />
      )}
      {currentLocation && !staticMode && <CurrentLocationDot coordinate={currentLocation} />}
    </MapView>
  );
}
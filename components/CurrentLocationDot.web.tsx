import React from 'react';
import { View } from 'react-native';
import { Coordinate } from '../services/distance';

// No-op on web — the native Marker from react-native-maps doesn't exist here.
export default function CurrentLocationDot({ coordinate }: { coordinate: Coordinate }) {
  return <View />;
}

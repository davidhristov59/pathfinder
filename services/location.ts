import { Platform } from 'react-native';
import { BACKGROUND_LOCATION_TASK } from './backgroundTask';
import { Coordinate } from './distance';

// ── Web implementation using browser Geolocation API ────────────────

async function webRequestPermissions(): Promise<'granted' | 'denied' | 'undetermined'> {
  if (!navigator.geolocation) return 'denied';
  try {
    await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
    );
    return 'granted';
  } catch {
    return 'denied';
  }
}

async function webStartLocationWatch(callback: (coord: Coordinate) => void): Promise<{ remove: () => void }> {
  const watchId = navigator.geolocation.watchPosition(
    (pos) => callback({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
    undefined,
    { enableHighAccuracy: true }
  );
  return { remove: () => navigator.geolocation.clearWatch(watchId) };
}

// ── Native implementation using expo-location ───────────────────────

async function nativeRequestPermissions(): Promise<'granted' | 'denied' | 'undetermined'> {
  const Location = require('expo-location');
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== 'granted') return 'denied';

  try {
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') {
      console.warn("Background location permission denied.");
    }
  } catch (error) {
    console.warn(
      "Could not request background location permissions. " +
      "If you are using Expo Go, it does not support custom Info.plist keys for background location. " +
      "You will only get foreground location. To test background location, create a development build. Error:", error
    );
  }

  // We return granted if foreground is granted, so the app can still basically function.
  return 'granted';
}

async function nativeStartLocationWatch(callback: (coord: Coordinate) => void) {
  const Location = require('expo-location');
  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.BestForNavigation,
      distanceInterval: 3,
      timeInterval: 1000,
    },
    (location: any) => {
      callback({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  );
}

// ── Exported functions ──────────────────────────────────────────────

export async function requestPermissions(): Promise<'granted' | 'denied' | 'undetermined'> {
  return Platform.OS === 'web' ? webRequestPermissions() : nativeRequestPermissions();
}

export async function startLocationWatch(callback: (coord: Coordinate) => void) {
  return Platform.OS === 'web' ? webStartLocationWatch(callback) : nativeStartLocationWatch(callback);
}

export async function startBackgroundTracking(): Promise<void> {
  if (Platform.OS === 'web') return; // not supported on web
  const Location = require('expo-location');
  try {
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      distanceInterval: 3,
      deferredUpdatesInterval: 1000,
      showsBackgroundLocationIndicator: true,
    });
  } catch (error) {
    console.warn("Could not start background tracking error:", error);
  }
}

export async function stopBackgroundTracking(): Promise<void> {
  if (Platform.OS === 'web') return; // not supported on web
  const Location = require('expo-location');
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  if (hasStarted) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
}
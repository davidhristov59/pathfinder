import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { BACKGROUND_LOCATION_TASK } from '../services/backgroundTask';
import { trackingStore } from '../store/trackingStore';
import { initDB } from '../services/database';
import { StatusBar } from 'expo-status-bar';

import '../global.css';

// TaskManager & background location only work on native
if (Platform.OS !== 'web') {
  const TaskManager = require('expo-task-manager');
  const Location = require('expo-location');
  TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }: any) => {
    if (error) return;
    const { locations } = data as { locations: any[] };
    locations.forEach((loc: any) => {
      trackingStore.getState().addCoordinate({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      trackingStore.getState().setCurrentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    });
  });
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    async function setup() {
      try {
        await initDB();
      } catch (e) {
        console.warn(e);
      } finally {
        setDbReady(true);
        await SplashScreen.hideAsync();
      }
    }
    setup();
  }, []);

  if (!dbReady) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#0F172A' } }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}
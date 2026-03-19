import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Play, Square } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useTrackingStore, trackingStore } from '../../store/trackingStore';
import { requestPermissions, startBackgroundTracking, stopBackgroundTracking, startLocationWatch } from '../../services/location';
import { getTotalDistance } from '../../services/distance';
import { saveActivity } from '../../services/database';
import TrackingMap from '../../components/TrackingMap';
import StatsBar from '../../components/StatsBar';
import PermissionGate from '../../components/PermissionGate';
import { LocationSubscription } from 'expo-location';

export default function TrackingScreen() {
  const router = useRouter();
  const {
    isTracking,
    elapsedSeconds,
    coordinates,
    currentLocation,
    locationPermission,
    startTracking,
    stopTracking,
    setCurrentLocation,
    addCoordinate,
    tick,
    setPermission,
    reset,
  } = useTrackingStore();

  const [distance, setDistance] = useState('0.00');
  const locationSubRef = useRef<LocationSubscription | null>(null);

  useEffect(() => {
    (async () => {
      const status = await requestPermissions();
      setPermission(status);
      if (status === 'granted') {
        locationSubRef.current = await startLocationWatch((coord) => {
          setCurrentLocation(coord);
          if (trackingStore.getState().isTracking) {
            addCoordinate(coord);
          }
        });
      }
    })();
    return () => {
      if (locationSubRef.current) {
        locationSubRef.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  useEffect(() => {
    setDistance((getTotalDistance(coordinates) / 1000).toFixed(2));
  }, [coordinates]);

  const handleStart = async () => {
    reset();
    startTracking();
    await startBackgroundTracking();
  };

  const handleStop = async () => {
    await stopBackgroundTracking();
    stopTracking();
    
    const dist = getTotalDistance(coordinates);
    const id = await saveActivity({
      date: new Date().toISOString(),
      distance: dist,
      duration: elapsedSeconds,
      coordinates: coordinates,
    });
    
    reset();
    router.push(`/activity/${id}`);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  if (locationPermission === 'undetermined') {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  if (locationPermission === 'denied') {
    return <PermissionGate />;
  }

  return (
    <View className="flex-1 bg-background relative">
      <TrackingMap
        coordinates={coordinates}
        currentLocation={currentLocation}
        isTracking={isTracking}
      />

      <StatsBar
        isTracking={isTracking}
        distance={distance}
        duration={formatDuration(elapsedSeconds)}
      />

      <BlurView intensity={80} tint="dark" className="absolute bottom-0 left-0 right-0 p-6 pt-8 pb-10">
        <MotiView
          animate={{ translateY: isTracking ? 100 : 0, opacity: isTracking ? 0 : 1 }}
          transition={{ type: 'spring', damping: 18 }}
          className={isTracking ? 'absolute z-[-1]' : 'w-full'}
        >
          {!isTracking && (
            <MotiView
              from={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <TouchableOpacity
                onPress={handleStart}
                className="w-full bg-accent rounded-full py-4 flex-row items-center justify-center"
              >
                <Play size={24} color="white" fill="white" className="mr-2" />
                <Text className="text-white text-xl font-bold">Start Tracking</Text>
              </TouchableOpacity>
            </MotiView>
          )}
        </MotiView>

        <MotiView
          animate={{ translateY: isTracking ? 0 : 100, opacity: isTracking ? 1 : 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className={!isTracking ? 'absolute z-[-1]' : 'w-full'}
        >
          {isTracking && (
            <TouchableOpacity
              onPress={handleStop}
              className="w-full bg-danger rounded-full py-4 flex-row items-center justify-center"
            >
              <Square size={24} color="white" fill="white" className="mr-2" />
              <Text className="text-white text-xl font-bold">Stop & Save</Text>
            </TouchableOpacity>
          )}
        </MotiView>
      </BlurView>
    </View>
  );
}
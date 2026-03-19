import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Trash2 } from 'lucide-react-native';
import { Activity, getActivityById, deleteActivity } from '../../services/database';
import TrackingMap from '../../components/TrackingMap';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (id) {
      getActivityById(Number(id)).then(setActivity);
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteActivity(Number(id));
            router.back();
          },
        },
      ]
    );
  };

  if (!activity) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
  };

  const avgSpeed = activity.duration > 0 ? ((activity.distance / 1000) / (activity.duration / 3600)).toFixed(1) : '0.0';

  return (
    <View className="flex-1 bg-background relative">
      <View className="absolute top-12 left-4 right-4 z-10 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-12 h-12 bg-surface/80 rounded-full items-center justify-center backdrop-blur-md"
        >
          <ArrowLeft size={24} color="#F1F5F9" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDelete}
          className="w-12 h-12 bg-surface/80 rounded-full items-center justify-center backdrop-blur-md"
        >
          <Trash2 size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <TrackingMap
        coordinates={activity.coordinates}
        currentLocation={null}
        isTracking={false}
        staticMode={true}
      />

      <View className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-3xl p-6 shadow-2xl border-t border-border">
        <Text className="text-2xl font-bold text-primary mb-1">
          {activity.title || 'Unknown Route'}
        </Text>
        <Text className="text-muted mb-6">
          {new Date(activity.date).toLocaleString()}
        </Text>

        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <Text className="text-muted text-sm font-semibold mb-1">Distance</Text>
            <Text className="text-primary text-2xl font-bold">
              {(activity.distance / 1000).toFixed(2)} <Text className="text-base text-muted font-normal">km</Text>
            </Text>
          </View>
          <View className="w-[48%] mb-4">
            <Text className="text-muted text-sm font-semibold mb-1">Duration</Text>
            <Text className="text-primary text-2xl font-bold">
              {formatDuration(activity.duration)}
            </Text>
          </View>
          <View className="w-[48%]">
            <Text className="text-muted text-sm font-semibold mb-1">Avg Speed</Text>
            <Text className="text-primary text-2xl font-bold">
              {avgSpeed} <Text className="text-base text-muted font-normal">km/h</Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
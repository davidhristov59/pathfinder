import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Footprints, Timer } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Activity } from '../services/database';

export default function ActivityCard({ activity }: { activity: Activity }) {
  const router = useRouter();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m ${s}s`;
  };

  return (
    <TouchableOpacity
      onPress={() => router.push(`/activity/${activity.id}`)}
      className="bg-surface p-4 rounded-xl mb-4 border border-border shadow-sm"
    >
      <Text className="text-primary font-bold text-lg mb-1">
        {activity.title || 'Unknown Route'}
      </Text>
      <Text className="text-muted text-sm mb-4">
        {formatDate(activity.date)}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Footprints size={18} color="#94A3B8" className="mr-2" />
          <Text className="text-primary font-semibold">
            {(activity.distance / 1000).toFixed(2)} km
          </Text>
        </View>
        <View className="flex-row items-center">
          <Timer size={18} color="#94A3B8" className="mr-2" />
          <Text className="text-primary font-semibold">
            {formatDuration(activity.duration)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { Map } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { MotiView } from 'moti';
import { Activity, getAllActivities } from '../../services/database';
import ActivityCard from '../../components/ActivityCard';

export default function HistoryScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadActivities = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadActivities();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadActivities();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-background p-4">
        {[1, 2, 3, 4].map((i) => (
          <MotiView
            key={i}
            from={{ opacity: 0.3 }}
            animate={{ opacity: 0.7 }}
            transition={{ type: 'timing', duration: 1000, loop: true }}
            className="bg-surface h-32 rounded-xl mb-4"
          />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ActivityCard activity={item} />}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366F1"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center">
            <Map size={64} color="#6366F1" className="mb-4 opacity-50" />
            <Text className="text-xl font-bold text-primary mb-2">No activities yet</Text>
            <Text className="text-muted text-center">
              Start moving and track your first route!
            </Text>
          </View>
        }
      />
    </View>
  );
}
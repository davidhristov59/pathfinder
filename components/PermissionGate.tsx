import React from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Map } from 'lucide-react-native';
import { requestPermissions } from '../services/location';
import { useTrackingStore } from '../store/trackingStore';

export default function PermissionGate() {
  const setPermission = useTrackingStore((state) => state.setPermission);

  const handleRequest = async () => {
    const status = await requestPermissions();
    setPermission(status);
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Map size={64} color="#6366F1" className="mb-6" />
      <Text className="text-2xl font-bold text-primary mb-2 text-center">Location Access Required</Text>
      <Text className="text-base text-muted text-center mb-8">
        PathFinder needs location permission to track your routes.
      </Text>
      
      <TouchableOpacity 
        onPress={handleRequest}
        className="w-full bg-accent rounded-xl py-4 mb-4"
      >
        <Text className="text-white text-center font-bold text-lg">Request Permission</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => Linking.openSettings()}
        className="w-full bg-surface border border-border rounded-xl py-4"
      >
        <Text className="text-primary text-center font-bold text-lg">Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
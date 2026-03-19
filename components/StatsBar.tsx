import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

interface StatsBarProps {
  isTracking: boolean;
  distance: string;
  duration: string;
}

export default function StatsBar({ isTracking, distance, duration }: StatsBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(isTracking ? 0 : 200, {
            damping: 15,
            stiffness: 100,
          }),
        },
      ],
      opacity: withSpring(isTracking ? 1 : 0),
    };
  });

  return (
    <Animated.View
      style={[animatedStyle]}
      className="absolute bottom-32 left-6 right-6 bg-surface p-6 rounded-2xl shadow-lg border border-border flex-row justify-between"
    >
      <View>
        <Text className="text-muted text-sm font-semibold mb-1">Duration</Text>
        <Text className="text-primary text-3xl font-bold">{duration}</Text>
      </View>
      <View className="items-end">
        <Text className="text-muted text-sm font-semibold mb-1">Distance</Text>
        <Text className="text-primary text-3xl font-bold">{distance} km</Text>
      </View>
    </Animated.View>
  );
}
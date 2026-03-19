import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { Marker } from 'react-native-maps';
import { Coordinate } from '../services/distance';

export default function CurrentLocationDot({ coordinate }: { coordinate: Coordinate }) {
  const pulse = useSharedValue(0.5);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value * 2 }],
      opacity: 1 - pulse.value,
    };
  });

  return (
    <Marker coordinate={coordinate} anchor={{ x: 0.5, y: 0.5 }}>
      <View className="items-center justify-center w-8 h-8">
        <Animated.View
          style={[animatedStyle]}
          className="absolute w-8 h-8 rounded-full bg-accent"
        />
        <View className="w-4 h-4 rounded-full border-2 border-white bg-accent" />
      </View>
    </Marker>
  );
}
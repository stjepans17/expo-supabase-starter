import { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Gesture } from 'react-native-gesture-handler';

export const useSwipeBack = (enabled: boolean = true) => {
  const screenWidth = Dimensions.get('window').width;

  const swipeGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(enabled)
      .activeOffsetX(10) // Start recognizing after 10px horizontal movement
      .failOffsetY([-30, 30]) // Fail if vertical movement is too much
      .onStart((event) => {
        // Only allow swipe from left edge (first 50px of screen)
        if (event.x > 50) return;
      })
      .onEnd((event) => {
        // Only proceed if swipe started from left edge
        if (event.x > 50) return;
        
        // Check if swipe right with sufficient distance or velocity
        if (event.translationX > screenWidth * 0.3 || event.velocityX > 500) {
          router.back();
        }
      });
  }, [enabled, screenWidth]);

  return { swipeGesture };
};
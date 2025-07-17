import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import ExerciseBox from '@/components/mine/ExerciseBox';
import { spacingX, spacingY } from '@/constants/spacings';
import { router } from 'expo-router';
import ScreenWrapperMidMargin from '@/components/mine/ScreenWrapperMidMargin';

const exercises = () => {

  function handlePress(muscleGroupId: number) {
    router.push({
      pathname: '/exercises2',
      params: { 
        muscleGroupId: muscleGroupId.toString()
      }
    });
  }

  return (
    <ScreenWrapperMidMargin>
      <View style={styles.wrapper}>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Abs & Core'
              onPress={() => handlePress(6)}
            />
          </View>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Arms'
              onPress={() => handlePress(3)}
            />
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Back'
              onPress={() => handlePress(2)}
            />
          </View>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Chest'
              onPress={() => handlePress(1)}
            />
          </View>
        </View>
        <View style={styles.contentRow}>
           <View style={styles.contentColumn}>
            <ExerciseBox
              title='Legs'
              onPress={() => handlePress(5)}
            />
          </View>
          <View style={styles.contentColumn}>
            <ExerciseBox
              title='Shoulders'
              onPress={() => handlePress(4)}
            />
          </View>
        </View>
        <View style={styles.contentRow}></View>
        <View style={styles.contentRow}></View>
      </View>
    </ScreenWrapperMidMargin>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',
    height: '100%',
    marginBottom: spacingX._15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1
  },
  contentRow: {
    flex: 1,
    width: '100%',
    flexDirection: 'row'
  },
  contentColumn: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  backButton: {
    padding: spacingX._3,
    marginBottom: spacingX._5,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});

export default exercises;
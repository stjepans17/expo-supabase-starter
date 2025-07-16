import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import { spacingX } from '@/constants/spacings';
import { fetchAllExercises, fetchExerciseById, fetchExercisesByMuscleId } from '@/lib/exercise';
import { Exercise } from '@/types';
import Typo from '@/components/mine/Typo';
import ExercisesList from '@/components/mine/ExercisesList';

const muscles = () => {
  const { muscleId } = useLocalSearchParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    if (muscleId) {
      loadExercises();
    }
  }, [muscleId]);

  async function loadExercises() {
    setLoading(true);

    try {
      const exercises = await fetchExercisesByMuscleId(Number(muscleId));
      setExercises(exercises);
    } catch (error) {
      console.error('Error fetching muscles:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenWrapper>
    );
  };

  return (
    <ScreenWrapperMinMargin>
      <View style={styles.wrapper}>
        <ExercisesList exercises={exercises} />
      </View>
    </ScreenWrapperMinMargin>
  )
}

export default muscles

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  muscleItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
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
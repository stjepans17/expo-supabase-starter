import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import ExerciseBox from '@/components/mine/ExerciseBox';
import { spacingX, spacingY } from '@/constants/spacings';
import { fetchMusclesByMuscleGroupId } from '@/lib/muscle';
import { Muscle, MuscleGroup } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import Typo from '@/components/mine/Typo';
import ScreenWrapperMidMargin from '@/components/mine/ScreenWrapperMidMargin';

const Exercises2 = () => {
  const { muscleGroupId } = useLocalSearchParams();

  const [muscles, setMuscles] = useState<Muscle[]>([]);
  const [loading, setLoading] = useState(false);

  function handlePress(muscleId: number) {
    router.push({
      pathname: '/exercises3',
      params: {
        muscleId: muscleId.toString(),
      }
    });
  };

  useEffect(() => {
    if (muscleGroupId) {
      loadMuscles();
    } else {
      setLoading(true);
    }
  }, [muscleGroupId]);

  async function loadMuscles() {
    setLoading(true);

    try {
      const fetchedMuscles = await fetchMusclesByMuscleGroupId(Number(muscleGroupId));
      setMuscles(fetchedMuscles);
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
  }

  return (
    <ScreenWrapperMidMargin>
      <View style={styles.wrapper} collapsable={false}>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            {muscles[0] &&
              <ExerciseBox
                title={muscles[0].name}
                onPress={() => handlePress(muscles[0].id)}
              />
            }
          </View>
          <View style={styles.contentColumn}>
            {muscles[1] &&
              <ExerciseBox
                title={muscles[1].name}
                onPress={() => handlePress(muscles[1].id)}
              />
            }
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            {muscles[2] &&
              <ExerciseBox
                title={muscles[2].name}
                onPress={() => handlePress(muscles[2].id)}
              />
            }
          </View>
          <View style={styles.contentColumn}>
            {muscles[3] &&
              <ExerciseBox
                title={muscles[3].name}
                onPress={() => handlePress(muscles[3].id)}
              />
            }
          </View>
        </View>
        <View style={styles.contentRow}>
          <View style={styles.contentColumn}>
            {muscles[4] &&
              <ExerciseBox
                title={muscles[4].name}
                onPress={() => handlePress(muscles[4].id)}
              />
            }
          </View>
          <View style={styles.contentColumn}>
            {muscles[5] &&
              <ExerciseBox
                title={muscles[5].name}
                onPress={() => handlePress(muscles[5].id)}
              />
            }
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
    height: '98%',
    marginBottom: spacingX._15,
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

export default Exercises2;
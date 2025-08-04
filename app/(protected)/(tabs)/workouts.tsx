import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import { spacingX, spacingY } from '@/constants/spacings'
import Typo from '@/components/mine/Typo'
import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin'
import { Workout } from '@/types'
import ViewBox from '@/components/mine/ViewBox'
import { fetchExercisesLengthFromWorkoutId, fetchWorkoutByUserId } from '@/lib/workout';
import { useAuth } from "@/context/supabase-provider";
import PlusIcon from '@/assets/PlusIcon.svg';
import { router } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as Icons from 'phosphor-react-native';

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const iconSize = Math.max(20, SCREEN_WIDTH * 0.06);

const workouts = () => {
  const { session } = useAuth();

  const [view, setView] = useState<string>("Workouts");
  const [dummyWorkouts, setDummyWorkouts] = useState<Workout[] | null>();
  const [favoriteWorkouts, setFavoriteWorkouts] = useState<Workout[] | null>();
  const [exerciseCounts, setExerciseCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(false);

  function handleViewBoxPress() {
    router.push('/active-workout');
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      if (!session?.user.id) {
        return;
      }

      const workoutsResult = await fetchWorkoutByUserId(session?.user.id);
      setDummyWorkouts(workoutsResult);

      // Then fetch exercise counts for all workouts
      if (workoutsResult && workoutsResult.length > 0) {
        const countsPromises = workoutsResult.map(async (workout) => {
          const count = await fetchExercisesLengthFromWorkoutId(workout.id);
          return { workoutId: workout.id, count };
        });

        const counts = await Promise.all(countsPromises);
        const countsObject = counts.reduce((acc, { workoutId, count }) => {
          acc[workoutId] = count ?? 0;
          return acc;
        }, {} as { [key: string]: number });

        setExerciseCounts(countsObject);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
      </ScreenWrapper>
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.innerWrapper}>
            <View style={[styles.innerWrapperLeftHalf]}>
              <View style={[{ width: '80%', height: '80%', justifyContent: 'center', alignItems: 'center' }, view === "Workouts" && styles.activeTab]}>
                <TouchableOpacity onPress={() => setView("Workouts")}>
                  <Typo style={styles.title}>Workouts</Typo>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.innerWrapperRightHalf]}>
              <View style={[{ width: '80%', height: '80%', justifyContent: 'center', alignItems: 'center' }, view === "Plans" && styles.activeTab]}>
                <TouchableOpacity onPress={() => setView("Plans")}>
                  <Typo style={styles.title}>Plans</Typo>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickStartSection}>
          <View style={styles.quickStartHeader}>
            <Typo style={styles.quickStartTitle}>Quick Start</Typo>
          </View>
          <View style={styles.quickStartMain}>
            <TouchableOpacity style={styles.quickStartButton}>
              <Icons.Plus size={iconSize} color="#000000" style={{ marginLeft: spacingX._10 }}/>
              <Typo style={styles.quickStartButtonTitle}>Start Empty Workout</Typo>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.quickStartSection}>
          <View style={styles.quickStartHeader}>
            <Typo style={styles.quickStartTitle}>Routines</Typo>
          </View>
          <View style={styles.quickStartMain}>
            <TouchableOpacity style={styles.quickStartButton}>
              <Icons.Notebook size={iconSize} color="#000000" style={{ marginLeft: spacingX._10 }}/>
              <Typo style={styles.quickStartButtonTitle}>New Routine</Typo>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.myRoutinesSection}>
          <Typo style={styles.myRoutinesTitle}>My Routines (3)</Typo>
          <View style={styles.myRoutinesContent}>
            <View style={styles.routineViewBoxWrapper}>
              <View style={styles.routineViewBox}>
                <View style={styles.routineViewBoxHeader}>
                  <Typo style={{color: '#000000', letterSpacing: -0.72, fontSize: 24, fontFamily: 'Inter-Bold', marginTop: spacingY._5}}>PUSH</Typo>
                  <Typo style={{color: '#8E8E93', letterSpacing: -0.72, fontSize: 16, fontFamily: 'Inter', marginTop: spacingY._5}}>12 Exercises</Typo>
                </View>
                <View style={styles.routineViewBoxFooter}>
                  <TouchableOpacity style={{backgroundColor: '#4600DE', borderRadius: 8, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Typo style={{color: '#FFFFFF', letterSpacing: -0.72}}>Start Routine</Typo>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.routineViewBoxWrapper}>
              <View style={styles.routineViewBox}>
                 <View style={styles.routineViewBoxHeader}>
                  <Typo style={{color: '#000000', letterSpacing: -0.72, fontSize: 24, fontFamily: 'Inter-Bold', marginTop: spacingY._5}}>PULL</Typo>
                  <Typo style={{color: '#8E8E93', letterSpacing: -0.72, fontSize: 16, fontFamily: 'Inter', marginTop: spacingY._5}}>8 Exercises</Typo>
                </View>
                <View style={styles.routineViewBoxFooter}>
                  <TouchableOpacity style={{backgroundColor: '#4600DE', borderRadius: 8, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Typo style={{color: '#FFFFFF', letterSpacing: -0.72}}>Start Routine</Typo>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.routineViewBoxWrapper}>
              <View style={styles.routineViewBox}>
                 <View style={styles.routineViewBoxHeader}>
                  <Typo style={{color: '#000000', letterSpacing: -0.72, fontSize: 24, fontFamily: 'Inter-Bold', marginTop: spacingY._5}}>LEGS</Typo>
                  <Typo style={{color: '#8E8E93', letterSpacing: -0.72, fontSize: 16, fontFamily: 'Inter', marginTop: spacingY._5}}>6 Exercises</Typo>
                </View>
                <View style={styles.routineViewBoxFooter}>
                  <TouchableOpacity style={{backgroundColor: '#4600DE', borderRadius: 8, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Typo style={{color: '#FFFFFF', letterSpacing: -0.72}}>Start Routine</Typo>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          {/* <View style={styles.quickStartHeader}>
          </View>
          <View style={styles.quickStartMain}>
            <TouchableOpacity style={styles.quickStartButton}>
              <Icons.Notebook size={iconSize} color="#000000" style={{ marginLeft: spacingX._10 }}/>
              <Typo style={styles.quickStartButtonTitle}>New Routine</Typo>
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
    </ScrollView>
  )
}

export default workouts

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F2F0',
    justifyContent: 'flex-start',
    minHeight: SCREEN_HEIGHT,
    width: "100%",
    alignItems: "center",
  },
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    height: SCREEN_HEIGHT * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12.3,
    elevation: 5,
  },
  innerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    flexDirection: 'row'
  },
  innerWrapperLeftHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerWrapperRightHalf: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  activeTab: {
    borderBottomColor: '#4600DE',
    borderBottomWidth: 2,
  },
  quickStartSection: {
    height: SCREEN_HEIGHT * 0.135,
    width: '100%',
  },
  addRoutineSection: {
    height: SCREEN_HEIGHT * 0.135,
    width: '100%',
    // backgroundColor: 'green',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  myRoutinesSection: {
    height: SCREEN_HEIGHT * 0.8,
    width: '100%',
    // backgroundColor: 'black',
    // alignItems: 'flex-start',
    // justifyContent: 'center'
  },
  myRoutinesContent: {
    width: '100%',
    height: '100%',
    gap: spacingY._10
  },
  quickStartHeader: {
    flex: 1,
    // backgroundColor: 'purple',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  quickStartMain: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacingX._10,
  },
  quickStartTitle: {
    marginLeft: spacingX._10,
    fontSize: 18,
    color: '#000000',
    letterSpacing: -0.72,
    fontFamily: 'Inter-Bold'
  },
  myRoutinesTitle: {
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
    marginLeft: spacingX._10,
    fontSize: 18,
    color: '#000000',
    letterSpacing: -0.72,
    fontFamily: 'Inter-Bold'
  },
  quickStartButtonTitle: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Bold'
  },
  quickStartButton: {
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    height: '90%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5, // Android shadow,
    flexDirection: 'row',
    gap: spacingX._5,
  },
  routineViewBoxWrapper: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.7 * 0.25
  },
  routineViewBox: {
    margin: spacingX._10,
    backgroundColor: '#FFFFFF',
    flex: 1,
    borderRadius: 10
  },
  routineViewBoxHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: spacingX._10
  },
  routineViewBoxFooter: {
    flex: 1,
    margin: spacingX._10
  }
})
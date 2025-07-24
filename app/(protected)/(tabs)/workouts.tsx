import { ScrollView, StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import { spacingX } from '@/constants/spacings'
import Typo from '@/components/mine/Typo'
import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin'
import { Workout } from '@/types'
import ViewBox from '@/components/mine/ViewBox'
import { fetchExercisesLengthFromWorkoutId, fetchWorkoutByUserId } from '@/lib/workout';
import { useAuth } from "@/context/supabase-provider";
import PlusIcon from '@/assets/PlusIcon.svg'
import { router } from 'expo-router'

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
    <ScreenWrapperMinMargin style={{ backgroundColor: '#F2F2F0', justifyContent: 'flex-start', alignItems: 'stretch' }}>
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
        <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.mainInnerWrapper}>
            <View style={styles.mainTitleWrapper}>
              <Typo style={styles.mainTitle}>Your {view}</Typo>
              <TouchableOpacity>
                <PlusIcon width={50} height={25}/>
              </TouchableOpacity>
            </View>
            <View style={styles.mainContentWrapper}>
              {favoriteWorkouts &&
                <View style={styles.mainCategorySection}>
                  <View style={styles.mainCategoryTitleWrapper}>
                    <Typo style={styles.title}>Favorites</Typo>
                  </View>
                  <ScrollView contentContainerStyle={styles.mainCategoryContentWrapper} horizontal={true}>
                    {favoriteWorkouts?.map((workoutData, index) => (
                      <View key={index} style={styles.mainSubcontentWrapper}>
                        <ViewBox workoutData={workoutData} exerciseCount={exerciseCounts[workoutData.id]} />
                      </View>
                    ))}
                  </ScrollView>
                </View>}
              <View style={styles.mainCategorySection}>
                <View style={styles.mainCategoryTitleWrapper}>
                  <Typo style={styles.title}>Specific Category #1</Typo>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mainCategoryContentWrapper}
                >
                  {dummyWorkouts?.map((workoutData, index) => (
                    <View key={index} style={styles.mainSubcontentWrapper}>
                      <ViewBox
                        workoutData={workoutData}
                        exerciseCount={exerciseCounts[workoutData.id]}
                        onPress={() => handleViewBoxPress()}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.mainCategorySection}>
                <View style={styles.mainCategoryTitleWrapper}>
                  <Typo style={styles.title}>Specific Category #2</Typo>
                </View>
                <View style={styles.mainCategoryContentWrapper}>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                  <View style={styles.mainSubcontentWrapper}>
                    <View style={styles.viewBox}>

                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ScreenWrapperMinMargin>
  )
}

export default workouts

const styles = StyleSheet.create({
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
    height: '10%',
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
  scrollArea: {
    height: '100%',
  },
  innerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    height: '80%',
    flexDirection: 'row'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
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
  infoText: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 16
  },
  infoTextTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 18,
    marginBottom: spacingX._5
  },
  infoTextSubtitle: {
    letterSpacing: -0.72,
    fontSize: 16,
    color: '#9C9DA1'
  },
  mainTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 28
  },
  activeTab: {
    borderBottomColor: '#4600DE',
    borderBottomWidth: 2,
  },
  mainInnerWrapper: {
    width: '90%',
    height: '95%',
  },
  mainTitleWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: spacingX._20,
    flexDirection: 'row',
    gap: '1%'
  },
  mainContentWrapper: {
    flex: 8
  },
  mainCategorySection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacingX._15,
    minHeight: Dimensions.get('window').height * 0.25,
  },
  mainCategoryTitleWrapper: {
    flex: 1,
    alignSelf: 'flex-start'
  },
  mainCategoryContentWrapper: {
    flex: 8,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  mainCategoryContentWrapperHorizontal: {
    // justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,

    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  mainSubcontentWrapper: {
    // flex: 1,
    flexGrow: 0,         
    flexShrink: 0,       
    justifyContent: 'center',
    alignItems: 'flex-start',
    minWidth: Dimensions.get('window').width * 0.4,
    width: Dimensions.get('window').width * 0.45
  },
  viewBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    height: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5, // Android shadow
  },
  viewBoxMain: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBoxInner: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  viewBoxInnerRow: {
    width: '80%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row'
  }
})
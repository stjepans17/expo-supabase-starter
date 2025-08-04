import Typo from '@/components/mine/Typo';
import { spacingX, spacingY } from '@/constants/spacings';
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Calendar } from 'react-native-calendars';
import ProgressChart70 from '@/assets/ProgressChart70.svg';
import HomeRectangle from '@/assets/HomeRectangle.svg';
import BlackClockSmallIcon from '@/assets/BlackClockSmallIcon.svg';
import WorkoutCard from '@/components/mine/WorkoutCard';
import { useAuth } from '@/context/supabase-provider';
import { fetchAllWorkoutDatesForUser } from '@/lib/workout';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import { router } from 'expo-router';
import { useWorkout } from '@/context/WorkoutProvider';
import { formatTime, formatTimeOnlyMinutes } from '@/lib/helpers/DateTimeHelper';
import workouts from './workouts';

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Type definitions
interface ProgressItemProps {
  title: string;
  percentage: string;
}

interface WorkoutCardProps {
  title: string;
  subtitle: string;
  duration: string;
  rightText: string;
}

interface SectionHeaderProps {
  title: string;
}

interface ProgressData {
  title: string;
  percentage: string;
}

// Reusable Progress Item Component
const ProgressItem: React.FC<ProgressItemProps> = ({ title, percentage }) => (
  <View style={styles.progressItem}>
    <View style={styles.progressChartContainer}>
      <ProgressChart70 />
    </View>
    <View style={styles.progressTextContainer}>
      <Typo style={styles.titleText}>{title}</Typo>
      <Typo style={styles.percentageText}>{percentage}</Typo>
    </View>
  </View>
);

// Reusable Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => (
  <View style={styles.sectionHeader}>
    <HomeRectangle style={styles.headerIcon} />
    <Typo style={styles.titleText}>{title}</Typo>
  </View>
);

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [completedWorkoutDates, setCompletedWorkoutDates] = useState<{ [key: string]: any }>({});

  const [loading, setLoading] = useState<boolean>(false);
  const { session } = useAuth();
  const { state, dispatch } = useWorkout();

  // TODO: dynamically
  const progressData: ProgressData[] = [
    { title: 'Daily', percentage: '70%' },
    { title: 'Weekly', percentage: '40%' },
    { title: 'Monthly', percentage: '20%' }
  ];

  // TODO: modal on day press (?)
  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      if (!session?.user.id) {
        setLoading(false);
        return;
      }

      try {
        const allWorkoutDates = await fetchAllWorkoutDatesForUser(session?.user.id);

        const uniqueDates = [...new Set(
          allWorkoutDates.map((item: { performed_at: string }) =>
            item.performed_at.split('T')[0]
          )
        )];

        const workoutDatesObj = uniqueDates.reduce((acc, date) => {
          acc[date] = {
            marked: true,
            dotColor: '#4600DE'
          };
          return acc;
        }, {} as { [key: string]: any });

        const today = new Date().toISOString().split('T')[0];
        if (workoutDatesObj[today]) {
          workoutDatesObj[today] = {
            ...workoutDatesObj[today],
            selected: true,
            selectedColor: '#4600DE'
          };
        } else {
          workoutDatesObj[today] = {
            selected: true,
            selectedColor: '#4600DE'
          };
        }

        setCompletedWorkoutDates(workoutDatesObj);
      } catch (error) {
        console.error('Error fetching workout dates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session?.user.id]);

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
    <ScrollView contentContainerStyle={styles.container}>
      {/* Calendar Section */}
      <View style={styles.calendarSection}>
        <View style={styles.calendarContainer}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            minDate={'2025-01-01'}
            maxDate={'2025-12-31'}
            onDayPress={onDayPress}
            markedDates={completedWorkoutDates}
            theme={{
              backgroundColor: 'white',
              calendarBackground: 'white',
              textSectionTitleColor: '#4600DE',
              selectedDayBackgroundColor: '#4600DE',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#4600DE',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#4600DE',
              selectedDotColor: '#ffffff',
              arrowColor: '#4600DE',
              disabledArrowColor: '#d9e1e8',
              monthTextColor: '#2d4150',
              indicatorColor: '#4600DE',
              textDayFontFamily: 'Inter-Bold',
              textMonthFontFamily: 'Inter-Bold',
              textDayHeaderFontFamily: 'Inter-Bold',
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14
            }}
            style={styles.calendar}
            hideExtraDays={true}
            firstDay={1}
            showWeekNumbers={false}
            enableSwipeMonths={true}
            showSixWeeks={true}
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View style={styles.mainContent}>
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressSectionInner}>
            {progressData.map((item, index) => (
              <ProgressItem
                key={index}
                title={item.title}
                percentage={item.percentage}
              />
            ))}
          </View>
        </View>

        {/* Training Section */}
        <View style={styles.trainingSection}>
          {/* Active Workout Section */}
          <View style={styles.sectionWrapper}>
            <View style={styles.sectionInner}>
              <SectionHeader title="Active Workout" />
              <View style={styles.sectionContent}>
                <View style={styles.cardContainer}>
                  {
                    state.workout ? (
                      <WorkoutCard
                        title={state.workout.name || "New Empty Workout"}
                        subtitle={`${state.exercises.length.toString()} Exercises`}
                        duration={"In Progress"}
                        rightText="."
                        onPress={() => router.push('/active-workout')}
                      />
                    ) : (
                      <WorkoutCard
                        title="No Workout Started Yet"
                        subtitle="Click to start a new workout"
                        duration=""
                        rightText=""
                        onPress={() => router.push('/active-workout')}
                      />
                    )
                  }
                </View>
              </View>
            </View>
          </View>

          {/* Current Plan Section */}
          <View style={[styles.sectionWrapper, styles.planSectionOffset]}>
            <View style={styles.sectionInner}>
              <SectionHeader title="Current Plan" />
              <View style={styles.sectionContent}>
                <View style={styles.cardContainer}>
                  {/* if plan exists add it here from context(?) otherwise offer to make a new one/redirect to plan maker screen */}
                  <WorkoutCard
                    title="No Plan Started Yet"
                    subtitle="Click to create a new plan"
                    duration=""
                    rightText=""
                    onPress={() => Alert.alert("", "Not yet implemented")} // TODO: implement
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  // Main container
  container: {
    backgroundColor: '#F2F2F0',
    justifyContent: 'flex-start',
    minHeight: SCREEN_HEIGHT,
    width: "100%",
    alignItems: "center",
  },

  // Calendar section
  calendarSection: {
    height: SCREEN_HEIGHT * 0.4,
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
  },
  calendar: {
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  // Main content area
  mainContent: {
    width: '100%',
    minHeight: SCREEN_HEIGHT
  },

  // Progress section styles
  progressSection: {
    marginTop: spacingX._15,
    height: '20%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressSectionInner: {
    width: '90%',
    height: '90%',
    flexDirection: 'row'
  },
  progressItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressChartContainer: {
    flex: 3,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  progressTextContainer: {
    flex: 2,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Text styles
  titleText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#4600DE'
  },
  subtitleText: {
    letterSpacing: -0.72,
    fontSize: 16,
    color: '#9C9DA1',
    marginTop: spacingX._5
  },

  // Training section styles
  trainingSection: {
    height: '60%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionInner: {
    width: '90%',
    height: '90%',
    marginTop: -spacingX._5
  },
  sectionWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planSectionOffset: {
    marginTop: -spacingX._30
  },
  sectionHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: spacingY._20
  },
  headerIcon: {
    marginRight: spacingY._10
  },
  sectionContent: {
    flex: 3,
  },
  cardContainer: {
    marginLeft: spacingY._20,
    width: '90%',
    height: '85%',
    justifyContent: 'center',
    alignItems: 'center'
  },

  // Workout card styles
  workoutCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5
  },
  workoutCardTop: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  workoutInfo: {
    width: '90%',
    height: '60%'
  },
  workoutCardBottom: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  workoutCardFooter: {
    width: '90%',
    height: '60%',
    flexDirection: 'row'
  },
  durationSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  rightTextSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  durationContainer: {
    flexDirection: 'row',
    gap: '5%'
  },
  clockIcon: {
    marginTop: spacingX._3
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});



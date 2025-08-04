import { Dimensions, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import WorkoutList from '@/components/mine/ExercisesList'
import { spacingX, spacingY } from '@/constants/spacings'
import ScreenWrapperMinMargin from '@/components/mine/ScreenWrapperMinMargin';
import Typo from '@/components/mine/Typo';
import ProgressChart from '@/components/mine/progress/ProgressChart'

let { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    data: [50, 80, 60, 45, 75, 10, 0]
  }]
};

const progress = () => {
  const categories = ["Abs & Core", "Arms", "Back", "Chest", "Legs", "Shoulders"];
  const [chosenCategory, setChosenCategory] = useState<string>("Abs & Core");
  const [timeInterval, setTimeInterval] = useState<string>("Week"); // week, month, year, all

  useEffect(() => {
    fetchDataForInterval()
  }, [timeInterval,]);

  function fetchDataForInterval() {
    console.log('Function not implemented.');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.header}>
          <View style={styles.innerWrapper}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} onPress={() => setChosenCategory(category)}>
                <Text style={styles.categoryTitle}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ProgressChart chartData={chartData} onIntervalChange={setTimeInterval} interval={timeInterval} />
        <View style={styles.achievementsWrapper}>
          <View style={styles.achievementsHeader}>
            <Typo style={styles.achievementsTitle}>Achievements</Typo>
            <Typo style={styles.achievementsSubtitle}>View All</Typo>
          </View>
          <ScrollView
            style={styles.achievementScrollView}
            contentContainerStyle={styles.achievementsContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.contentBox}>
              <View style={styles.contentBoxHeader}>
                <Typo style={styles.achievementsHeaderText}>Heaviest lift</Typo>
              </View>
              <View style={styles.contentBoxMain}>
                <Typo style={styles.achievementsMainText}>110 kg</Typo>
              </View>
              <View style={styles.contentBoxFooter}>
                <Typo style={styles.achievementsFooterText}>Leg press</Typo>
              </View>
            </View>
            <View style={styles.contentBox}>
              <View style={styles.contentBoxHeader}>
                <Typo style={styles.achievementsHeaderText}>Longest Workout</Typo>
              </View>
              <View style={styles.contentBoxMain}>
                <Typo style={styles.achievementsMainText}>1h 45 min</Typo>
              </View>
              <View style={styles.contentBoxFooter}>
                <Typo style={styles.achievementsFooterText}>Workout Name</Typo>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.bodyweightTrackerWrapper}>
          <View style={styles.achievementsHeader}>
            <Typo style={styles.achievementsTitle}>Body Weight Tracker</Typo>
            <Typo style={styles.achievementsSubtitle}>View All</Typo>
            <Typo style={styles.bodyweightPlusIcon}>+</Typo>
          </View>
          <ScrollView
            style={styles.achievementScrollView}
            contentContainerStyle={styles.achievementsContent}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.contentBox}>
              <View style={styles.contentBoxHeader}>
                <Typo style={styles.achievementsHeaderText}>02.07.2025</Typo>
              </View>
              <View style={styles.contentBoxMain}>
                <Typo style={styles.achievementsMainText}>86 kg</Typo>
              </View>
              <View style={styles.contentBoxFooter}>
              </View>
            </View>
            <View style={styles.contentBox}>
              <View style={styles.contentBoxHeader}>
                <Typo style={styles.achievementsHeaderText}>12.5.2025</Typo>
              </View>
              <View style={styles.contentBoxMain}>
                <Typo style={styles.achievementsMainText}>88 kg</Typo>
              </View>
              <View style={styles.contentBoxFooter}>
              </View>
            </View>
            <View style={styles.contentBox}>
              <View style={styles.contentBoxHeader}>
                <Typo style={styles.achievementsHeaderText}>10.4.2025</Typo>
              </View>
              <View style={styles.contentBoxMain}>
                <Typo style={styles.achievementsMainText}>90 kg</Typo>
              </View>
              <View style={styles.contentBoxFooter}>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  )
}

export default progress

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    gap: spacingY._20
  },
  outerWrapper: {
    backgroundColor: '#F2F2F0',
    justifyContent: 'flex-start',
    alignItems: 'stretch'
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
    width: '100%',
    height: '80%',
    flexDirection: 'row',
    gap: spacingY._10,
  },
  categoryTitle: {
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    fontSize: 16
  },
  container: {
    backgroundColor: '#F2F2F0',
    justifyContent: 'flex-start',
    minHeight: SCREEN_HEIGHT,
    width: "100%",
    alignItems: "center",
  },
  barchartWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacingY._15
  },
  barchartHeader: {
    width: '90%',
    height: '15%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    gap: spacingX._15,
    flexDirection: 'row'
  },
  barchartContent: {
    width: '90%',
    height: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  periodChooserTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#9C9C9C'
  },
  periodChooserTitleActive: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#BEA3F8'
  },
  achievementsWrapper: {
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  achievementScrollView: {
    width: '90%',
    height: '70%',
  },
  bodyweightTrackerWrapper: {
    height: SCREEN_HEIGHT * 0.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  achievementsHeader: {
    width: '90%',
    height: '30%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacingX._30
  },
  achievementsContent: {
    // width: '100%',
    // height: '100%',
    // backgroundColor: 'blue',
    // justifyContent: 'center',
    // alignItems: 'center',
    // gap: spacingX._10

    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX._20
  },
  achievementsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  achievementsSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    letterSpacing: -0.72,
    color: '#9C9DA1'
  },
  bodyweightPlusIcon: {
    fontSize: 30,
    fontFamily: 'Inter',
    letterSpacing: -0.72,
    color: '#4600DE',
    marginBottom: spacingY._5,
    marginLeft: spacingX._10
  },
  achievementsFooterText: {
    fontSize: 14,
    fontFamily: 'Inter',
    letterSpacing: -0.72,
    color: '#9C9DA1',
    marginLeft: spacingX._10
  },
  achievementsMainText: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    color: '#4600DE',
    marginLeft: spacingX._10
  },
  achievementsHeaderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    color: '#000000',
    marginLeft: spacingX._10
  },
  contentBox: {
    width: SCREEN_HEIGHT * 0.2,
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10
  },
  contentBoxHeader: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'flex-end'
  },
  contentBoxFooter: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  contentBoxMain: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
});


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import WorkoutList from '@/components/mine/WorkoutList'
import { spacingX } from '@/constants/spacings'

const progress = () => {
  return (
    <View style={styles.outerWrapper}>
      <View style={styles.wrapper}>
        <WorkoutList workouts={["Bench Press", "Incline Bench Press"]}></WorkoutList>
      </View>
    </View>
  )
}

export default progress

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  outerWrapper: {
    
  }
})
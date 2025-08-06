// components/WorkoutsContent.tsx
import React from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Typo from '@/components/mine/Typo'
import * as Icons from 'phosphor-react-native'
import RoutineViewBox from '@/components/mine/routine/RoutineViewBox'
import { deleteRoutine } from '@/lib/routine'
import { router } from 'expo-router'
import { spacingX, spacingY } from '@/constants/spacings'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const iconSize = Math.max(20, SCREEN_WIDTH * 0.06)

export interface WorkoutsContentProps {
  routines: { id: string; name: string; exercise_ids: number[] }[]
  loading: boolean
  retrieveRoutineData: () => Promise<void>
  setLoading: (loading: boolean) => void
}

const WorkoutsContent: React.FC<WorkoutsContentProps> = ({
  routines,
  loading,
  retrieveRoutineData,
  setLoading,
}) => {
  return (
    <View>
      {/* Quick Start */}
      <View style={styles.quickStartSection}>
        <View style={styles.quickStartHeader}>
          <Typo style={styles.quickStartTitle}>Quick Start</Typo>
        </View>
        <View style={styles.quickStartMain}>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() => router.push('/active-workout')}
          >
            <Icons.Plus
              size={iconSize}
              color="#000"
              style={{ marginLeft: spacingX._10 }}
            />
            <Typo style={styles.quickStartButtonTitle}>
              Start Empty Workout
            </Typo>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Routine */}
      <View style={styles.quickStartSection}>
        <View style={styles.quickStartHeader}>
          <Typo style={styles.quickStartTitle}>Routines</Typo>
        </View>
        <View style={styles.quickStartMain}>
          <TouchableOpacity
            style={styles.quickStartButton}
            onPress={() => console.log('/new-routine')}
          >
            <Icons.Notebook
              size={iconSize}
              color="#000"
              style={{ marginLeft: spacingX._10 }}
            />
            <Typo style={styles.quickStartButtonTitle}>New Routine</Typo>
          </TouchableOpacity>
        </View>
      </View>

      {/* My Routines List */}
      <View style={styles.myRoutinesSection}>
        <Typo style={styles.myRoutinesTitle}>
          My Routines ({routines.length})
        </Typo>
        <View style={styles.myRoutinesContent}>
          {routines.map((routine) => (
            <RoutineViewBox
              key={routine.id}
              routineName={routine.name}
              exerciseCount={routine.exercise_ids.length}
              onStartRoutine={() => {
                // router.push(`/routine/${routine.id}`)
                console.log('starting routine')
              }}
              onDeleteRoutine={() =>
                Alert.alert(
                  'Delete Routine',
                  `Are you sure you want to delete "${routine.name}"?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: async () => {
                        try {
                          setLoading(true)
                          await deleteRoutine(routine.id)
                          await retrieveRoutineData()
                        } catch {
                          Alert.alert(
                            'Error',
                            'Failed to delete routine. Please try again.'
                          )
                        } finally {
                          setLoading(false)
                        }
                      },
                    },
                  ]
                )
              }
            />
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  quickStartSection: {
    height: SCREEN_WIDTH * 0.3,
    width: '100%',
  },
  quickStartHeader: {
    flex: 1,
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
    color: '#000',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
  },
  quickStartButton: {
    flexDirection: 'row',
    gap: spacingX._5,
    borderRadius: 12,
    backgroundColor: '#FFF',
    height: '90%',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.04,
    shadowRadius: 10.3,
    elevation: 5,
  },
  quickStartButtonTitle: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter-Bold',
  },
  myRoutinesSection: {
    width: '100%',
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._10,
  },
  myRoutinesTitle: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.72,
    marginBottom: spacingY._10,
  },
  myRoutinesContent: {
    width: '100%',
    gap: spacingY._10,
  },
})

export default WorkoutsContent

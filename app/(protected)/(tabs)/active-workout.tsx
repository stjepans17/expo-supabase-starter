import { spacingX, spacingY } from '@/constants/spacings';
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import PauseIconSmall from '@/assets/PauseIconSmall.svg';
import PlayIconSmall from '@/assets/PlayIconSmall.svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const iconSize = Math.max(20, screenWidth * 0.08);

// Types for your data structure
interface WorkoutSet {
  id: string;
  weight: number | null;
  reps: number | null;
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  imageUrl?: string;
  sets: WorkoutSet[];
}

interface WorkoutSession {
  id: string;
  name: string;
  startTime: Date;
  exercises: Exercise[];
}

enum WorkoutStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Paused = "Paused",
  Finished = "Finished",
  // Started = "Started",
}

const WorkoutTracker = () => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds

  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>(WorkoutStatus.NotStarted);
  const [workout, setWorkout] = useState<WorkoutSession>({
    id: '1',
    name: 'Push Workout',
    startTime: new Date(),
    exercises: [
      {
        id: '1',
        name: 'Bench Press',
        imageUrl: 'https://example.com/bench-press.jpg',
        sets: []
      },
      {
        id: '2',
        name: 'Shoulder Press',
        imageUrl: 'https://example.com/shoulder-press.jpg',
        sets: []
      },
      {
        id: '3',
        name: 'Push Ups',
        sets: []
      }
    ]
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (workoutStatus === WorkoutStatus.InProgress && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(diffInSeconds);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [workoutStatus, startTime]);

  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle workout start
  const startWorkout = () => {
    const now = new Date();
    setStartTime(now);
    setElapsedTime(0);
    setWorkoutStatus(WorkoutStatus.InProgress);
  };

  // Handle workout pause
  const pauseWorkout = () => {
    setWorkoutStatus(WorkoutStatus.Paused);
  };

  // Handle workout resume
  const resumeWorkout = () => {
    // Adjust start time to account for paused time
    if (startTime) {
      const now = new Date();
      const newStartTime = new Date(now.getTime() - (elapsedTime * 1000));
      setStartTime(newStartTime);
    }
    setWorkoutStatus(WorkoutStatus.InProgress);
  };

  // Add a set to an exercise
  const addSet = (exerciseId: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === exerciseId
          ? {
            ...exercise,
            sets: [
              ...exercise.sets,
              {
                id: Date.now().toString(),
                weight: null,
                reps: null,
                completed: false
              }
            ]
          }
          : exercise
      )
    }));
  };

  // Update set data
  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(exercise =>
        exercise.id === exerciseId
          ? {
            ...exercise,
            sets: exercise.sets.map(set =>
              set.id === setId ? { ...set, [field]: value } : set
            )
          }
          : exercise
      )
    }));
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      {
        (workoutStatus === WorkoutStatus.InProgress || 
        workoutStatus === WorkoutStatus.Paused) &&
        <View style={styles.headerContainer}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <Text style={styles.workoutTimer}>{formatTime(elapsedTime)}</Text>
            <View style={styles.workoutStats}>
              <Text style={styles.statText}>12 exercises</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>24 sets completed</Text>
              <View style={styles.statIconsWrapper}>
                <TouchableOpacity onPress={resumeWorkout} style={workoutStatus === WorkoutStatus.InProgress ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
                  <MaterialIcons name="play-arrow" size={iconSize} color={workoutStatus === WorkoutStatus.InProgress ? "#8E8E93" : "#FFFFFF"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={pauseWorkout} style={workoutStatus === WorkoutStatus.Paused ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
                  <MaterialIcons name="pause" size={iconSize} color={workoutStatus === WorkoutStatus.Paused ? "#8E8E93" : "#FFFFFF"} />
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </View>
      }

      {
        workoutStatus === WorkoutStatus.NotStarted  &&
        <View style={styles.headerContainer}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            <View style={styles.workoutStats}>
              <Text style={styles.statText}>12 exercises</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>24 sets to go</Text>
            </View>
            <TouchableOpacity style={styles.startWorkoutBtn} onPress={startWorkout}>
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      }

      {/* Exercise List */}
      {workout.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onAddSet={() => addSet(exercise.id)}
          onUpdateSet={updateSet}
        />
      ))}

      {
        (workoutStatus === WorkoutStatus.InProgress ||
        workoutStatus === WorkoutStatus.Paused) &&
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: spacingX._30 }}>
          <TouchableOpacity style={styles.finishWorkoutBtn} onPress={() => setWorkoutStatus(WorkoutStatus.Finished)}>
            <Text style={styles.finishWorkoutText}>Finish Workout</Text>
          </TouchableOpacity>
        </View>
      }

      {/* Bottom padding for better UX */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

// Separate component for each exercise card
const ExerciseCard = ({
  exercise,
  onAddSet,
  onUpdateSet
}: {
  exercise: Exercise;
  onAddSet: () => void;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
}) => {
  return (
    <View style={styles.exerciseCard}>
      {/* Exercise Header - Always visible */}
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseImageContainer}>
          {exercise.imageUrl ? (
            <Image source={{ uri: exercise.imageUrl }} style={styles.exerciseImage} />
          ) : (
            <View style={[styles.exerciseImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>💪</Text>
            </View>
          )}
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseSubtext}>
            {exercise.sets.length === 0 ? 'Tap to add first set' : `${exercise.sets.length} sets`}
          </Text>
        </View>
      </View>

      {/* Dynamic Sets Section - Expands based on content */}
      <View style={styles.setsContainer}>
        {exercise.sets.map((set, index) => (
          <SetRow
            key={set.id}
            set={set}
            setNumber={index + 1}
            exerciseId={exercise.id}
            onUpdateSet={onUpdateSet}
          />
        ))}

        {/* Add Set Button */}
        <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
          <Text style={styles.addSetText}>+ Add Set</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Individual set row component
const SetRow = ({
  set,
  setNumber,
  exerciseId,
  onUpdateSet
}: {
  set: WorkoutSet;
  setNumber: number;
  exerciseId: string;
  onUpdateSet: (exerciseId: string, setId: string, field: 'weight' | 'reps', value: number) => void;
}) => {
  return (
    <View style={styles.setRow}>
      <Text style={styles.setNumber}>{setNumber}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="lbs"
          value={set.weight?.toString() || ''}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            onUpdateSet(exerciseId, set.id, 'weight', value);
          }}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.separator}>×</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="reps"
          value={set.reps?.toString() || ''}
          onChangeText={(text) => {
            const value = parseInt(text) || 0;
            onUpdateSet(exerciseId, set.id, 'reps', value);
          }}
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.checkButton}>
        <Text style={styles.checkButtonText}>✓</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    flexGrow: 1,
  },

  // Header Styles (Now part of scrollable content)
  headerContainer: {
    height: screenHeight * 0.2, // 25% of screen height
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: '5%',
    marginBottom: spacingX._10
  },
  workoutHeader: {
    alignItems: 'flex-start',
    //justifyContent: 'flex-start'
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutTimer: {
    fontSize: 32,
    fontWeight: '600',
    color: '#4600DE',
    marginBottom: 12,
    letterSpacing: -0.72
  },
  workoutStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacingX._10
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  statIconsWrapper: {
    marginLeft: spacingY._20,
    flexDirection: 'row',
    gap: spacingY._20
  },
  startWorkoutBtn: {
    color: "#4600DE",
    borderRadius: 12,
    backgroundColor: '#4600DE',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacingX._3,
    width: '70%'
  },
  finishWorkoutBtn: {
    color: "#FFFFFF",
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacingX._3,
    width: '70%',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.3,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 16 },
  },
  finishWorkoutText: {
    color: "#4600DE",
    letterSpacing: -0.72,
    fontSize: 18
  },
  // Exercise Card Styles
  exerciseCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '3%',
  },
  exerciseImageContainer: {
    marginRight: 12,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 20,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  exerciseSubtext: {
    fontSize: 14,
    color: '#666',
  },

  // Sets Container (Dynamic expansion)
  setsContainer: {
    // This will expand based on content
  },

  // Set Row Styles
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  setNumber: {
    width: 30,
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
  },
  separator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  checkButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Add Set Button
  addSetButton: {
    backgroundColor: '#4600DE',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetText: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: -0.72
  },
  startWorkoutText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: '600',
  },
  // Bottom padding for scroll
  bottomPadding: {
    height: 50,
  },
  workoutBtnActive: {
    backgroundColor: '#4600DE', 
    borderRadius: 5
  },  
  workoutBtnDisabled: {
    backgroundColor: '#D9D9D9', 
    borderRadius: 5
  },
});

export default WorkoutTracker;
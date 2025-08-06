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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Exercise } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import { addRoutine } from '@/lib/routine';
import { useAuth } from '@/context/supabase-provider';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const iconSize = Math.max(20, screenWidth * 0.06);

export default function CreateRoutine() {
  const { workoutName, selectedExercise } = useLocalSearchParams();
  const { session } = useAuth();

  useEffect(() => {
    if (selectedExercise) {
      try {
        const exercise = JSON.parse(selectedExercise as string);
        setExercises(prev => {
          // Check if exercise already exists to avoid duplicates
          if (prev.some(ex => ex.id === exercise.id)) {
            return prev;
          }
          return [...prev, exercise];
        });

        router.replace('/create-routine');
      } catch (error) {
        console.error('Error parsing selected exercise:', error);
      }
    }
  }, [selectedExercise]);

  const [loading, setLoading] = useState<boolean>(false);
  const [routineName, setRoutineName] = useState<string>(workoutName as string || 'New Routine');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExerciseOnPress = () => {
    router.push('/search-by-name?mode=routine');
  };

  const removeExercise = (exerciseId: number) => {
    Alert.alert(
      'Remove Exercise',
      'Are you sure you want to remove this exercise from the routine?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setExercises(prev => prev.filter(ex => ex.id !== exerciseId));
          }
        }
      ]
    );
  };

  async function saveRoutine() {
  if (!routineName.trim()) {
    Alert.alert('Error', 'Please enter a routine name');
    return;
  }

  if (exercises.length === 0) {
    Alert.alert('Error', 'Please add at least one exercise to the routine');
    return;
  }

  if(session?.user.id) {
    setLoading(true);
    const result = await addRoutine(routineName, exercises, session?.user.id);
    setLoading(false);
    
    if (result.success) {
      Alert.alert('Success', 'Routine saved successfully!', [
        {
          text: 'OK', 
          onPress: () => {
            router.push({
              pathname: '/workouts',
              params: {
                refresh: 'true'
              }
            });
          }
        }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to save routine');
    }
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
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.headerContainer}>
        <View style={styles.routineHeader}>
          <TextInput
            style={styles.routineNameInput}
            value={routineName}
            onChangeText={setRoutineName}
            placeholder="Enter routine name"
            placeholderTextColor="#999"
          />
          <View style={styles.routineStats}>
            <Text style={styles.statText}>{exercises.length} exercises</Text>
            <Text style={styles.statText}>•</Text>
            <Text style={styles.statText}>Blueprint</Text>
          </View>
          <TouchableOpacity style={styles.saveRoutineBtn} onPress={saveRoutine}>
            <Text style={styles.saveRoutineText}>Save Routine</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Exercise List */}
      {exercises.map((exercise, index) => (
        <View key={exercise.id} style={styles.exerciseCard}>
          <View style={styles.exerciseHeader}>
            <View style={styles.exerciseImageContainer}>
              <View style={[styles.exerciseImage, styles.placeholderImage]}>
                <Text style={styles.placeholderText}>💪</Text>
              </View>
            </View>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseSubtext}>Exercise</Text>
            </View>
            <TouchableOpacity
              onPress={() => removeExercise(exercise.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={iconSize} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Exercise Notes/Instructions placeholder */}
          {/* <View style={styles.exerciseNotes}>
            <Text style={styles.exerciseNotesLabel}>Notes:</Text>
            <Text style={styles.exerciseNotesText}>
              {exercise.description || 'No instructions available'}
            </Text>
          </View> */}
        </View>
      ))}

      {/* Add Exercise Button */}
      <View style={styles.addExerciseContainer}>
        <TouchableOpacity style={styles.addExerciseBtn} onPress={addExerciseOnPress}>
          <MaterialIcons name="add" size={24} color="#FFFFFF" />
          <Text style={styles.addExerciseText}>Add Exercise</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
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
  deleteButton: {
    padding: 4,
    marginTop: spacingY._5
  },
  // Header Styles
  headerContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: '5%',
    paddingVertical: spacingY._20,
    marginBottom: spacingX._10
  },
  routineHeader: {
    alignItems: 'flex-start',
  },
  routineNameInput: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    width: '100%',
  },
  routineStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacingX._20,
    marginLeft: spacingX._5
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  saveRoutineBtn: {
    backgroundColor: '#4600DE',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: 'rgba(70, 0, 222, 0.3)',
    shadowOpacity: 0.3,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 8 },
  },
  saveRoutineText: {
    color: "#FFFFFF",
    letterSpacing: -0.5,
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 12,
  },
  exerciseImageContainer: {
    marginRight: 12,
  },
  exerciseImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 24,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exerciseSubtext: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  exerciseNotes: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  exerciseNotesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  exerciseNotesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
  },

  // Add Exercise Button
  addExerciseContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacingX._25,
    marginBottom: spacingX._20,
  },
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4600DE',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: 'rgba(70, 0, 222, 0.2)',
    shadowOpacity: 0.3,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 8 },
    gap: 8,
  },
  addExerciseText: {
    color: "#FFFFFF",
    letterSpacing: -0.5,
    fontSize: 16,
    fontWeight: '600',
  },

  // Bottom padding for scroll
  bottomPadding: {
    height: screenHeight * 0.1,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
});
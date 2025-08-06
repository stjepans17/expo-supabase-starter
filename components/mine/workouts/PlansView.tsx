import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import * as Icons from 'phosphor-react-native';
import { spacingX, spacingY } from '@/constants/spacings';
import Typo from '@/components/mine/Typo';
import { router } from 'expo-router';

import { fetchRoutinesForUser } from '@/lib/routine';
import { useAuth } from '@/context/supabase-provider';
import { CreatePlanData, Plan, WeekWorkouts } from '@/types';
import { createPlan, deletePlan, getUserPlans, setActivePlan } from '@/lib/plans';
import { supabase } from '@/config/supabase';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const iconSize = Math.max(20, screenWidth * 0.06);

type Routine = {
  id: string;
  name: string;
};

export const PlansView: React.FC = () => {
  const { session } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  
  // Create plan state
  const [planName, setPlanName] = useState('');
  const [totalWeeks, setTotalWeeks] = useState(4);
  const [weeks, setWeeks] = useState<WeekWorkouts[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      fetchPlansData();
      fetchRoutinesData();
    }
  }, [session?.user.id]);

  useEffect(() => {
    // Initialize weeks when totalWeeks changes
    const newWeeks: WeekWorkouts[] = [];
    for (let i = 1; i <= totalWeeks; i++) {
      newWeeks.push({
        week_number: i,
        workouts: [
          { order: 1, routine_id: '' },
          { order: 2, routine_id: '' },
          { order: 3, routine_id: '' }
        ]
      });
    }
    setWeeks(newWeeks);
  }, [totalWeeks]);

  const fetchPlansData = async () => {
    if (!session?.user.id) return;
    
    setLoading(true);
    try {
      const result = await getUserPlans(session.user.id);
      if (result.success) {
        setPlans(result.plans || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoutinesData = async () => {
    if (!session?.user.id) return;
    
    try {
      const routinesData = await fetchRoutinesForUser(session.user.id);
      const formattedRoutines = routinesData?.map(routine => ({
        id: routine.id,
        name: routine.name
      })) || [];
      setRoutines(formattedRoutines);
    } catch (error) {
      console.error('Error fetching routines:', error);
    }
  };

  const handleActivatePlan = async (planId: string, planName: string, isCurrentlyActive: boolean) => {
    if (!session?.user.id) return;

    if (isCurrentlyActive) {
      // Deactivate current plan
      Alert.alert(
        'Deactivate Plan',
        `Are you sure you want to deactivate "${planName}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Deactivate',
            onPress: async () => {
              setLoading(true);
              try {
                // Set plan as inactive by updating the database directly
                const { error } = await supabase
                  .from('plan')
                  .update({ is_active: false })
                  .eq('id', planId)
                  .eq('user_id', session.user.id);

                if (error) {
                  Alert.alert('Error', 'Failed to deactivate plan');
                  console.error('Error deactivating plan:', error);
                } else {
                  await fetchPlansData(); // Refresh the plans list
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to deactivate plan');
                console.error('Error deactivating plan:', error);
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    } else {
      // Activate plan
      Alert.alert(
        'Activate Plan',
        `Activate "${planName}"? This will deactivate any currently active plan.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Activate',
            onPress: async () => {
              setLoading(true);
              try {
                const result = await setActivePlan(planId, session.user.id);
                
                if (result.success) {
                  await fetchPlansData(); // Refresh the plans list
                  Alert.alert('Success', `"${planName}" is now your active plan!`);
                } else {
                  Alert.alert('Error', result.error || 'Failed to activate plan');
                }
              } catch (error) {
                Alert.alert('Error', 'Failed to activate plan');
                console.error('Error activating plan:', error);
              } finally {
                setLoading(false);
              }
            }
          }
        ]
      );
    }
  };

  const handleCreatePlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    if (!session?.user.id) return;

    // Validate that all workouts have routines selected
    const hasEmptyWorkouts = weeks.some(week => 
      week.workouts.some(workout => !workout.routine_id)
    );

    if (hasEmptyWorkouts) {
      Alert.alert('Error', 'Please select routines for all workouts');
      return;
    }

    setLoading(true);
    try {
      const planData: CreatePlanData = {
        name: planName,
        total_weeks: totalWeeks,
        weeks: weeks
      };

      const result = await createPlan(planData, session.user.id);
      
      if (result.success) {
        Alert.alert('Success', 'Plan created successfully!');
        setShowCreatePlan(false);
        setPlanName('');
        setTotalWeeks(4);
        await fetchPlansData();
      } else {
        Alert.alert('Error', result.error || 'Failed to create plan');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create plan');
      console.error('Error creating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string, planName: string) => {
    if (!session?.user.id) return;

    Alert.alert(
      'Delete Plan',
      `Are you sure you want to delete "${planName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const result = await deletePlan(planId, session.user.id);
              if (result.success) {
                await fetchPlansData();
              } else {
                Alert.alert('Error', 'Failed to delete plan');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete plan');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const updateWeekWorkout = (weekIndex: number, workoutIndex: number, routineId: string) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].workouts[workoutIndex].routine_id = routineId;
    setWeeks(newWeeks);
  };

  const addWorkoutToWeek = (weekIndex: number) => {
    const newWeeks = [...weeks];
    const newOrder = newWeeks[weekIndex].workouts.length + 1;
    newWeeks[weekIndex].workouts.push({
      order: newOrder,
      routine_id: ''
    });
    setWeeks(newWeeks);
  };

  const removeWorkoutFromWeek = (weekIndex: number, workoutIndex: number) => {
    const newWeeks = [...weeks];
    newWeeks[weekIndex].workouts.splice(workoutIndex, 1);
    // Reorder remaining workouts
    newWeeks[weekIndex].workouts.forEach((workout, index) => {
      workout.order = index + 1;
    });
    setWeeks(newWeeks);
  };

  if (loading && !showCreatePlan) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (showCreatePlan) {
    return (
      <ScrollView style={styles.createPlanContainer}>
        <View style={styles.createPlanHeader}>
          <TouchableOpacity onPress={() => setShowCreatePlan(false)}>
            <Icons.ArrowLeft size={24} color="#4600DE" />
          </TouchableOpacity>
          <Text style={styles.createPlanTitle}>Create Plan</Text>
          <TouchableOpacity onPress={handleCreatePlan} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#4600DE" />
            ) : (
              <Text style={styles.saveButton}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.planInfoSection}>
          <Text style={styles.sectionLabel}>Plan Name</Text>
          <TextInput
            style={styles.textInput}
            value={planName}
            onChangeText={setPlanName}
            placeholder="Enter plan name"
            placeholderTextColor="#999"
          />

          <Text style={styles.sectionLabel}>Total Weeks</Text>
          <View style={styles.weekSelector}>
            <TouchableOpacity 
              style={styles.weekButton}
              onPress={() => setTotalWeeks(Math.max(1, totalWeeks - 1))}
            >
              <Icons.Minus size={iconSize} color="#4600DE" />
            </TouchableOpacity>
            <Text style={styles.weekNumber}>{totalWeeks} Week{totalWeeks !== 1 ? 's' : ''}</Text>
            <TouchableOpacity 
              style={styles.weekButton}
              onPress={() => setTotalWeeks(Math.min(52, totalWeeks + 1))}
            >
              <Icons.Plus size={iconSize} color="#4600DE" />
            </TouchableOpacity>
          </View>
        </View>

        {weeks.map((week, weekIndex) => (
          <View key={week.week_number} style={styles.weekSection}>
            <Text style={styles.weekTitle}>Week {week.week_number}</Text>
            
            {week.workouts.map((workout, workoutIndex) => (
              <View key={workoutIndex} style={styles.workoutRow}>
                <View style={styles.workoutInfo}>
                  <Text style={styles.workoutLabel}>Workout {workout.order}</Text>
                  <TouchableOpacity 
                    style={styles.routineSelector}
                    onPress={() => {
                      // Show routine picker
                      Alert.alert(
                        'Select Routine',
                        'Choose a routine for this workout',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          ...routines.map(routine => ({
                            text: routine.name,
                            onPress: () => updateWeekWorkout(weekIndex, workoutIndex, routine.id)
                          }))
                        ]
                      );
                    }}
                  >
                    <Text style={styles.routineSelectorText}>
                      {workout.routine_id 
                        ? routines.find(r => r.id === workout.routine_id)?.name || 'Select Routine'
                        : 'Select Routine'
                      }
                    </Text>
                    <Icons.CaretDown size={iconSize} color="#666" />
                  </TouchableOpacity>
                </View>
                
                {week.workouts.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeWorkoutButton}
                    onPress={() => removeWorkoutFromWeek(weekIndex, workoutIndex)}
                  >
                    <Ionicons name="trash-outline" size={iconSize} color="#8E8E93" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addWorkoutButton}
              onPress={() => addWorkoutToWeek(weekIndex)}
            >
              <Icons.Plus size={16} color="#4600DE" />
              <Text style={styles.addWorkoutText}>Add Workout</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.quickStartSection}>
        <View style={styles.quickStartHeader}>
          <Typo style={styles.quickStartTitle}>Plans</Typo>
        </View>
        <View style={styles.quickStartMain}>
          <TouchableOpacity 
            style={styles.quickStartButton} 
            onPress={() => setShowCreatePlan(true)}
          >
            <Icons.CalendarPlus size={iconSize} color="#000000" style={{ marginLeft: spacingX._10 }} />
            <Typo style={styles.quickStartButtonTitle}>Create New Plan</Typo>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.myPlansSection}>
        <Typo style={styles.myPlansTitle}>
          My Plans ({plans.length})
        </Typo>
        <View style={styles.myPlansContent}>
          {plans.map((plan, index) => (
            <View key={plan.id} style={styles.planCard}>
              <View style={styles.planCardHeader}>
                <View>
                  <Text style={styles.planName}>{plan.name}</Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePlan(plan.id, plan.name)}
                >
                  <Ionicons name="trash-outline" size={iconSize * 0.8} color="#8E8E93" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.planCardFooter}>
                <Text style={styles.planStats}>
                  {plan.total_weeks} Week{plan.total_weeks !== 1 ? 's' : ''} • {plan.is_active ? 'Active' : 'Inactive'}
                </Text>
                <TouchableOpacity 
                  style={[
                    styles.activateButton, 
                    plan.is_active && styles.activeButton
                  ]}
                  onPress={() => handleActivatePlan(plan.id, plan.name, plan.is_active)}
                  disabled={loading}
                >
                  <Text style={[
                    styles.activateButtonText,
                    plan.is_active && styles.activeButtonText
                  ]}>
                    {plan.is_active ? 'Active' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  quickStartSection: {
    height: 120,
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
    elevation: 5,
    flexDirection: 'row',
    gap: spacingX._5,
  },
  myPlansSection: {
    flex: 1,
    width: '100%',
  },
  myPlansContent: {
    width: '100%',
    gap: spacingY._10,
    paddingHorizontal: spacingX._10,
  },
  myPlansTitle: {
    marginTop: spacingY._10,
    marginBottom: spacingY._10,
    marginLeft: spacingX._10,
    fontSize: 18,
    color: '#000000',
    letterSpacing: -0.72,
    fontFamily: 'Inter-Bold'
  },
  planCard: {
    backgroundColor: '#FFFFFF',
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
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  planCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planStats: {
    fontSize: 12,
    color: '#999',
  },
  activateButton: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeButton: {
    backgroundColor: '#4600DE',
    borderColor: '#4600DE',
  },
  activateButtonText: {
    color: '#666',
    fontSize: 12,
    fontFamily: "Inter-Bold"
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  
  // Create Plan Styles
  createPlanContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  createPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacingX._15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: spacingY._10
  },
  createPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    color: '#4600DE',
    fontSize: 16,
    fontWeight: '600',
  },
  planInfoSection: {
    backgroundColor: '#FFFFFF',
    padding: spacingX._15,
    marginBottom: spacingY._10,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  weekButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    minWidth: 80,
    textAlign: 'center',
  },
  weekSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  routineSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  routineSelectorText: {
    fontSize: 16,
    color: '#333',
  },
  removeWorkoutButton: {
    padding: spacingX._5,
    marginLeft: spacingY._10,
    marginTop: spacingY._20
  },
  addWorkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4600DE',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  addWorkoutText: {
    color: '#4600DE',
    fontSize: 14,
    fontWeight: '600',
  },
});
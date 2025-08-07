// import { spacingX, spacingY } from '@/constants/spacings';
// import React, { startTransition, useEffect, useState } from 'react';
// import {
//   View,
//   ScrollView,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';

// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { formatTime } from '@/lib/helpers/DateTimeHelper';
// import { Exercise, Workout, WorkoutExercise, WorkoutSet } from '@/types';
// import { useAuth } from '@/context/supabase-provider';
// import { ChooseExerciseModal } from '@/components/mine/ChooseExerciseModal';
// import { router, useLocalSearchParams } from 'expo-router';
// import { saveStartWorkout } from '@/lib/workout';
// import uuid from 'react-native-uuid';
// import { useWorkout } from '@/context/WorkoutProvider';
// import { Alert } from 'react-native';
// import ScreenWrapper from '@/components/mine/ScreenWrapper';

// const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
// const iconSize = Math.max(20, screenWidth * 0.08);

// // TODO: move to context probably
// enum WorkoutStatus {
//   NotStarted = "Not Started",
//   InProgress = "In Progress",
//   Paused = "Paused",
//   Finished = "Finished",
//   // Started = "Started",
// }

// // TODO: 
// // 2. do something with finish workout button

// export const WorkoutTracker: React.FC = () => {
//   const { session } = useAuth();
//   const [loading, setLoading] = useState<boolean>(false);

//   const { state, dispatch, finishWorkout } = useWorkout();
//   const { workout, exercises, sets } = state;

//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>(
//     WorkoutStatus.NotStarted,
//   );

//   // 1. AddSet very slow, fix ui on the card, change any
//   function onAddSetUI(id: string) {
//     startTransition(() => {
//       dispatch({ type: 'ADD_SET', workoutExerciseId: id });
//     });
//   }

//   useEffect(() => {
//     let interval: NodeJS.Timeout | null = null;

//     if (workoutStatus === WorkoutStatus.InProgress && startTime) {
//       interval = setInterval(() => {
//         const now = new Date();
//         const diffInSeconds = Math.floor((now.getTime() - startTime.getTime()) / 1000);
//         setElapsedTime(diffInSeconds);
//       }, 1000);
//     }

//     return () => {
//       if (interval) {
//         clearInterval(interval);
//       }
//     };
//   }, [workoutStatus, startTime]);


//   function addExerciseOnPress() {
//     router.push('/search-by-name');
//   };

//   const startWorkout = async () => {
//     const now = new Date();
//     const newWorkout = {
//       id: uuid.v4() as string,
//       user_id: session!.user.id,
//       performed_at: now,
//       name: 'Push Workout',
//     };

//     try {
//       await saveStartWorkout(newWorkout);
//       dispatch({ type: 'START_WORKOUT', workout: newWorkout });
//       setStartTime(now);
//       setElapsedTime(0);
//       setWorkoutStatus(WorkoutStatus.InProgress);
//     } catch (error) {
//       console.error(error);
//       router.push('/');
//     }
//   };

//   function onFinishWorkout() {
//     Alert.alert('Finish Workout', 'Are you sure you want to finish your current workout? ', [
//       {
//         text: 'Yes',
//         onPress: () => onFinishWorkoutPressed(),
//       },
//       {
//         text: 'No',
//         onPress: () => console.log('Cancel Pressed'),
//       }
//     ]);
//   }

//   const pauseWorkout = () => {
//     setWorkoutStatus(WorkoutStatus.Paused);
//   };

//   const resumeWorkout = () => {
//     if (startTime) {
//       const now = new Date();
//       setStartTime(new Date(now.getTime() - elapsedTime * 1000));
//     }
//     setWorkoutStatus(WorkoutStatus.InProgress);
//   };

//   const addSet = (workoutExerciseId: string) =>
//     dispatch({ type: 'ADD_SET', workoutExerciseId });

//   const updateSet = (
//     setId: string,
//     field: 'weight' | 'reps',
//     value: number,
//   ) => dispatch({ type: 'UPDATE_SET', setId, field, value });

//   // const addExerciseToWorkout = (exercise: Exercise) => {
//   //   // store full details locally for quick render (optional)
//   //   setExerciseDetails(prev => ({ ...prev, [exercise.id]: exercise }));
//   //   dispatch({ type: 'ADD_EXERCISE', exercise });
//   // };

//   // helper
//   const getSetsForExercise = (wid: string) =>
//     sets.filter(s => s.workout_exercise_id === wid).sort((a, b) => a.set_number - b.set_number);

//   const onFinishWorkoutPressed = async () => {
//     setLoading(true);
//     if (!workout) return;
//     await finishWorkout(new Date(), elapsedTime);
//     setLoading(false);

//     // TODO: maybe show modal or sum shi on finish
//     //setWorkoutStatus(WorkoutStatus.Finished);
//     setWorkoutStatus(WorkoutStatus.NotStarted);
//   };

//   if (loading) {
//     return (
//       <ScreenWrapper>
//         <View style={styles.loader}>
//           <ActivityIndicator size="large" />
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={styles.scrollContent}
//     >
//       {/* Header */}
//       {
//         (workoutStatus === WorkoutStatus.InProgress ||
//           workoutStatus === WorkoutStatus.Paused) &&
//         <View style={styles.headerContainer}>
//           <View style={styles.workoutHeader}>
//             <Text style={styles.workoutTitle}>{"Push Workout"}</Text>
//             <Text style={styles.workoutTimer}>{formatTime(elapsedTime)}</Text>
//             <View style={styles.workoutStats}>
//               <Text style={styles.statText}>{state.exercises.length} exercises</Text>
//               <Text style={styles.statText}>•</Text>
//               <Text style={styles.statText}>{state.sets.length} sets completed</Text>
//               <View style={styles.statIconsWrapper}>
//                 <TouchableOpacity onPress={resumeWorkout} style={workoutStatus === WorkoutStatus.InProgress ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
//                   <MaterialIcons name="play-arrow" size={iconSize} color={workoutStatus === WorkoutStatus.InProgress ? "#8E8E93" : "#FFFFFF"} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={pauseWorkout} style={workoutStatus === WorkoutStatus.Paused ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
//                   <MaterialIcons name="pause" size={iconSize} color={workoutStatus === WorkoutStatus.Paused ? "#8E8E93" : "#FFFFFF"} />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <TouchableOpacity style={styles.finishWorkoutBtn} onPress={onFinishWorkout}>
//               <Text style={styles.finishWorkoutText}>Finish Workout</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       }

//       {
//         workoutStatus === WorkoutStatus.NotStarted &&
//         <View style={styles.headerContainer}>
//           <View style={styles.workoutHeader}>
//             <Text style={styles.workoutTitle}>{"Push Workout"}</Text>
//             <View style={styles.workoutStats}>
//               <Text style={styles.statText}>{exercises.length} exercises</Text>
//               <Text style={styles.statText}>•</Text>
//               <Text style={styles.statText}>? sets to go</Text>
//             </View>
//             <TouchableOpacity style={styles.startWorkoutBtn} onPress={startWorkout}>
//               <Text style={styles.startWorkoutText}>Start Workout</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       }

//       {/* Exercise list */}
//       {exercises.map(ex => {
//         const exercise = state.exercisesDict[ex.exercise_id];
//         if (!exercise) return null;
//         return (
//           <ExerciseCard
//             key={ex.id}
//             workoutExercise={ex}
//             exercise={exercise}
//             sets={getSetsForExercise(ex.id)}
//             onAddSet={() => onAddSetUI(ex.id)}
//             onUpdateSet={updateSet}
//           />
//         );
//       })}

//       {
//         (workoutStatus === WorkoutStatus.InProgress ||
//           workoutStatus === WorkoutStatus.Paused) &&
//         <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: spacingX._25 }}>
//           <TouchableOpacity style={styles.addExerciseBtn} onPress={addExerciseOnPress}>
//             <Text style={styles.addExerciseText}> + Add Exercise</Text>
//           </TouchableOpacity>
//         </View>
//       }

//       {/* Bottom padding for better UX */}
//       <View style={styles.bottomPadding} />
//     </ScrollView>
//   );
// };

// const ExerciseCard = ({
//   workoutExercise,
//   exercise,
//   sets,
//   onAddSet,
//   onUpdateSet
// }: {
//   workoutExercise: WorkoutExercise;
//   exercise: Exercise;
//   sets: WorkoutSet[];
//   onAddSet: () => void;
//   onUpdateSet: (setId: string, field: 'weight' | 'reps', value: number) => void;
// }) => {
//   return (
//     <View style={styles.exerciseCard}>
//       {/* Exercise Header */}
//       <View style={styles.exerciseHeader}>
//         <View style={styles.exerciseImageContainer}>
//           {exercise.image_key ? (
//             <Image source={{ uri: '' }} style={styles.exerciseImage} />
//           ) : (
//             <View style={[styles.exerciseImage, styles.placeholderImage]}>
//               <Text style={styles.placeholderText}>💪</Text>
//             </View>
//           )}
//         </View>

//         <View style={styles.exerciseInfo}>
//           <Text style={styles.exerciseName}>{exercise.name}</Text>
//           <Text style={styles.exerciseSubtext}>
//             {sets.length === 0 ? 'Tap to add first set' : `${sets.length} sets`}
//           </Text>
//         </View>
//       </View>

//       {/* Table Header */}
//       <View style={styles.tableContainer}>
//         <View style={styles.tableHeader}>
//           <View style={styles.headerSetContainer}>
//             <Text style={styles.headerText}>SET</Text>
//           </View>
//           <View style={styles.headerInputContainer}>
//             <Text style={styles.headerText}>REPS</Text>
//           </View>
//           <View style={styles.headerInputContainer}>
//             <Text style={styles.headerText}>KG</Text>
//           </View>
//           <View style={styles.headerCheckContainer}>
//             <Text style={styles.headerText}>✓</Text>
//           </View>
//         </View>

//         {/* Sets */}
//         <View style={styles.setsContainer}>
//           {sets.map((set, index) => (
//             <SetRow
//               key={set.id}
//               set={set}
//               setIndex={index}
//               onUpdateSet={onUpdateSet}
//             />
//           ))}
//         </View>
//       </View>

//       {/* Add Set Button */}
//       <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
//         <Text style={styles.addSetText}>+ Add Set</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const SetRow = ({
//   set,
//   setIndex,
//   onUpdateSet
// }: {
//   set: WorkoutSet;
//   setIndex: number;
//   onUpdateSet: (setId: string, field: 'weight' | 'reps', value: number) => void;
// }) => {
//   const [isCompleted, setIsCompleted] = useState(false);

//   return (
//     <View style={styles.setRow}>
//       {/* Set Number */}
//       <View style={styles.setNumberContainer}>
//         <Text style={styles.setNumber}>{set.set_number}</Text>
//       </View>

//       {
//         isCompleted ? (
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.inputComplete}
//               placeholder="12"
//               value={set.reps?.toString() || ''}
//               onChangeText={(text) => {
//                 const value = parseInt(text);
//                 if (!isNaN(value)) {
//                   onUpdateSet(set.id, 'reps', value);
//                 }
//               }}
//               keyboardType="numeric"
//             />
//           </View>

//         ) : (
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="12"
//               value={set.reps?.toString() || ''}
//               onChangeText={(text) => {
//                 const value = parseInt(text);
//                 if (!isNaN(value)) {
//                   onUpdateSet(set.id, 'reps', value);
//                 }
//               }}
//               keyboardType="numeric"
//             />
//           </View>
//         )};

//       {
//         isCompleted ? (
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.inputComplete}
//               placeholder="50"
//               value={set.weight?.toString() || ''}
//               onChangeText={(text) => {
//                 const value = parseFloat(text);
//                 if (!isNaN(value)) {
//                   onUpdateSet(set.id, 'weight', value);
//                 }
//               }}
//               keyboardType="numeric"
//             />
//           </View>
//         ) : (
//           <View style={styles.inputContainer}>
//             <TextInput
//               style={styles.input}
//               placeholder="50"
//               value={set.weight?.toString() || ''}
//               onChangeText={(text) => {
//                 const value = parseFloat(text);
//                 if (!isNaN(value)) {
//                   onUpdateSet(set.id, 'weight', value);
//                 }
//               }}
//               keyboardType="numeric"
//             />
//           </View>
//         )};

//       <TouchableOpacity
//         style={[styles.checkButton, isCompleted && styles.checkButtonCompleted]}
//         onPress={() => setIsCompleted(!isCompleted)}
//       >
//         {isCompleted && <Text style={styles.checkButtonText}>✓</Text>}
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContent: {
//     flexGrow: 1,
//   },
//   // Header Styles (Now part of scrollable content)
//   headerContainer: {
//     height: screenHeight * 0.25, // 25% of screen height
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//     justifyContent: 'center',
//     paddingHorizontal: '5%',
//     marginBottom: spacingX._10
//   },
//   workoutHeader: {
//     alignItems: 'flex-start',
//     //justifyContent: 'flex-start'
//   },
//   workoutTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   workoutTimer: {
//     fontSize: 32,
//     fontWeight: '600',
//     color: '#4600DE',
//     marginBottom: 12,
//     letterSpacing: -0.72
//   },
//   workoutStats: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginBottom: spacingX._10
//   },
//   statText: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statIconsWrapper: {
//     marginLeft: spacingY._20,
//     flexDirection: 'row',
//     gap: spacingY._20
//   },
//   startWorkoutBtn: {
//     color: "#4600DE",
//     borderRadius: 12,
//     backgroundColor: '#4600DE',
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: spacingX._3,
//     width: '70%'
//   },
//   finishWorkoutBtn: {
//     color: "#FFFFFF",
//     borderRadius: 12,
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 12,
//     alignItems: 'center',
//     // marginTop: spacingX._3,
//     width: '60%',
//     shadowColor: 'rgba(0, 0, 0, 0.3)',
//     shadowOpacity: 0.3,
//     elevation: 6,
//     shadowRadius: 15,
//     shadowOffset: { width: 1, height: 16 },
//   },
//   finishWorkoutText: {
//     color: "#4600DE",
//     letterSpacing: -0.72,
//     fontSize: 18
//   },
//   addExerciseBtn: {
//     color: "#4600DE",
//     borderRadius: 12,
//     backgroundColor: '#4600DE',
//     paddingVertical: 12,
//     alignItems: 'center',
//     marginTop: spacingX._3,
//     width: '40%',
//     shadowColor: 'rgba(0, 0, 0, 0.1)',
//     shadowOpacity: 0.3,
//     elevation: 6,
//     shadowRadius: 15,
//     shadowOffset: { width: 1, height: 16 },
//   },
//   addExerciseText: {
//     color: "#FFFFFF",
//     letterSpacing: -0.72,
//     fontSize: 18
//   },
//   // Exercise Card Styles
//   exerciseCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     marginBottom: 12,
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   exerciseHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: '3%',
//   },
//   exerciseImageContainer: {
//     marginRight: 12,
//   },
//   exerciseImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//   },
//   placeholderImage: {
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   placeholderText: {
//     fontSize: 20,
//   },
//   exerciseInfo: {
//     flex: 1,
//   },
//   exerciseName: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 2,
//   },
//   exerciseSubtext: {
//     fontSize: 14,
//     color: '#666',
//   },

//   // Sets Container (Dynamic expansion)
//   setsContainer: {
//     // This will expand based on content
//   },
//   separator: {
//     fontSize: 16,
//     color: '#666',
//     marginHorizontal: 8,
//   },
//   startWorkoutText: {
//     color: '#fff',
//     fontSize: 16,
//     // fontWeight: '600',
//   },
//   // Bottom padding for scroll
//   bottomPadding: {
//     height: 50,
//   },
//   workoutBtnActive: {
//     backgroundColor: '#4600DE',
//     borderRadius: 5
//   },
//   workoutBtnDisabled: {
//     backgroundColor: '#D9D9D9',
//     borderRadius: 5
//   },
//   loader: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flex: 1
//   },
//   headerCheckmark: {
//     width: 40,
//     alignItems: 'center',
//   },
//   setNumberContainer: {
//     width: 40,
//     alignItems: 'center',
//   },
//   prevText: {
//     fontSize: 14,
//     color: '#8E8E93',
//     textAlign: 'center',
//   },
//   checkButtonCompleted: {
//     backgroundColor: '#4600DE',
//     borderColor: '#4600DE',
//   },
//   tableContainer: {
//     marginTop: 16,
//   },
//   headerSetContainer: {
//     width: 40,
//     alignItems: 'center',
//   },

//   headerInputContainer: {
//     width: 60,
//     alignItems: 'center',
//     marginHorizontal: 8,
//   },
//   headerCheckContainer: {
//     width: 40,
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   tableHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     marginBottom: 8,
//     gap: spacingY._15
//   },

//   headerText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#8E8E93',
//     textAlign: 'center',
//   },

//   // Updated Set Row Styles
//   setRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//     gap: spacingY._15
//   },
//   setNumber: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#4600DE',
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     lineHeight: 32,
//   },
//   prevContainer: {
//     flex: 1,
//     paddingHorizontal: 12,
//   },
//   inputContainer: {
//     width: 60,
//     marginHorizontal: 8,
//   },

//   input: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#E5E5EA',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     textAlign: 'center',
//     backgroundColor: '#fff',
//   },
//   inputComplete: {
//     height: 40,
//     borderWidth: 1,
//     borderColor: '#E5E5EA',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     fontSize: 16,
//     textAlign: 'center',
//     backgroundColor: '#4600DE',
//     color: '#ffffff'
//   },
//   checkButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     borderWidth: 2,
//     borderColor: '#E5E5EA',
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginLeft: 8,
//   },
//   checkButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   // Updated Add Set Button
//   addSetButton: {
//     backgroundColor: '#4600DE',
//     paddingVertical: 14,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   addSetText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     letterSpacing: -0.72
//   },
// });

// export default WorkoutTracker;

import { spacingX, spacingY } from '@/constants/spacings';
import React, { startTransition, useEffect, useRef, useState } from 'react';
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
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { formatTime } from '@/lib/helpers/DateTimeHelper';
import { Exercise, Workout, WorkoutExercise, WorkoutSet } from '@/types';
import { useAuth } from '@/context/supabase-provider';
import { ChooseExerciseModal } from '@/components/mine/ChooseExerciseModal';
import { router, useLocalSearchParams } from 'expo-router';
import { saveStartWorkout } from '@/lib/workout';
import { getRoutineExercises } from '@/lib/routine';
import uuid from 'react-native-uuid';
import { useWorkout } from '@/context/WorkoutProvider';
import { Alert } from 'react-native';
import ScreenWrapper from '@/components/mine/ScreenWrapper';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const iconSize = Math.max(20, screenWidth * 0.08);

// TODO: move to context probably
enum WorkoutStatus {
  NotStarted = "Not Started",
  InProgress = "In Progress",
  Paused = "Paused",
  Finished = "Finished",
  // Started = "Started",
}

export const WorkoutTracker: React.FC = () => {
  const { session } = useAuth();
  const {
    fromPlan,
    routineId,
    routineName,
    planId,
    planName,
    weekNumber,
    workoutOrder,
  } = useLocalSearchParams();
  const { state, dispatch, finishWorkout } = useWorkout();
  const { workout, exercises, sets } = state;
  const [loading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workoutStatus, setWorkoutStatus] = useState<WorkoutStatus>(
    WorkoutStatus.NotStarted,
  );

  const [workoutTitle, setWorkoutTitle] = useState('New Empty Workout');

  // 🔒 Ensure the plan workout loads ONLY once
  const hasLoadedRef = useRef(false);

  // Check if we're starting from a plan
  useEffect(() => {
    if (
      hasLoadedRef.current ||
      fromPlan !== 'true' ||
      !routineId ||
      !routineName
    )
      return;

    hasLoadedRef.current = true;

    const loadPlanWorkout = async () => {
      setLoading(true);
      try {
        const result = await getRoutineExercises(routineId as string);

        if (result.success && result.exercises) {
          const now = new Date();
          const newWorkout: Workout = {
            id: uuid.v4() as string,
            user_id: session!.user.id,
            performed_at: now,
            name: `${routineName}`,
          };

          await saveStartWorkout(newWorkout);

          const planInfo = {
            planId: planId as string,
            planName: planName as string,
            weekNumber: parseInt(weekNumber as string) || 1,
            workoutOrder: parseInt(workoutOrder as string) || 1,
            routineId: routineId as string,
          };

          dispatch({
            type: 'START_WORKOUT_FROM_PLAN',
            workout: newWorkout,
            exercises: result.exercises,
            planInfo,
          });

          setWorkoutTitle(`${routineName}`);
          setStartTime(now);
          setElapsedTime(0);
          setWorkoutStatus(WorkoutStatus.InProgress);
        } else {
          Alert.alert(
            'Error',
            result.error || 'Failed to load routine exercises',
          );
          router.back();
        }
      } catch (error) {
        console.error('Error loading plan workout:', error);
        Alert.alert('Error', 'Failed to start workout from plan');
        router.back();
      } finally {
        setLoading(false); // << only here
      }
    };

    loadPlanWorkout();
  }, [
    fromPlan,
    routineId,
    routineName,
    planId,
    planName,
    weekNumber,
    workoutOrder,
    dispatch,
    session,
  ]);


  // 1. AddSet very slow, fix ui on the card, change any
  function onAddSetUI(id: string) {
    startTransition(() => {
      dispatch({ type: 'ADD_SET', workoutExerciseId: id });
    });
  }

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

  function addExerciseOnPress() {
    router.push('/search-by-name');
  }

  const startWorkout = async () => {
    const now = new Date();
    const newWorkout = {
      id: uuid.v4() as string,
      user_id: session!.user.id,
      performed_at: now,
      name: workoutTitle,
    };

    try {
      await saveStartWorkout(newWorkout);
      dispatch({ type: 'START_WORKOUT', workout: newWorkout });
      setStartTime(now);
      setElapsedTime(0);
      setWorkoutStatus(WorkoutStatus.InProgress);
    } catch (error) {
      console.error(error);
      router.push('/');
    }
  };

  function onFinishWorkout() {
    Alert.alert('Finish Workout', 'Are you sure you want to finish your current workout? ', [
      {
        text: 'Yes',
        onPress: () => onFinishWorkoutPressed(),
      },
      {
        text: 'No',
        onPress: () => null,
      }
    ]);
  }

  const pauseWorkout = () => {
    setWorkoutStatus(WorkoutStatus.Paused);
  };

  const resumeWorkout = () => {
    if (startTime) {
      const now = new Date();
      setStartTime(new Date(now.getTime() - elapsedTime * 1000));
    }
    setWorkoutStatus(WorkoutStatus.InProgress);
  };

  const addSet = (workoutExerciseId: string) =>
    dispatch({ type: 'ADD_SET', workoutExerciseId });

  const updateSet = (
    setId: string,
    field: 'weight' | 'reps',
    value: number,
  ) => dispatch({ type: 'UPDATE_SET', setId, field, value });

  // helper
  const getSetsForExercise = (wid: string) =>
    sets.filter(s => s.workout_exercise_id === wid).sort((a, b) => a.set_number - b.set_number);

  const onFinishWorkoutPressed = async () => {
    setLoading(true);
    if (!workout) return;
    await finishWorkout(new Date(), elapsedTime);
    //router.push("/");
    router.push({
      pathname: '/workout-complete',
      params: {
        workout_id: state.workout?.id,
      }
    });
    setLoading(false);

  };

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
      {/* Header */}
      {
        (workoutStatus === WorkoutStatus.InProgress ||
          workoutStatus === WorkoutStatus.Paused) &&
        <View style={styles.headerContainer}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>{workoutTitle}</Text>
            <Text style={styles.workoutTimer}>{formatTime(elapsedTime)}</Text>
            <View style={styles.workoutStats}>
              <Text style={styles.statText}>{state.exercises.length} exercises</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>{state.sets.length} sets completed</Text>
              <View style={styles.statIconsWrapper}>
                <TouchableOpacity onPress={resumeWorkout} style={workoutStatus === WorkoutStatus.InProgress ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
                  <MaterialIcons name="play-arrow" size={iconSize} color={workoutStatus === WorkoutStatus.InProgress ? "#8E8E93" : "#FFFFFF"} />
                </TouchableOpacity>
                <TouchableOpacity onPress={pauseWorkout} style={workoutStatus === WorkoutStatus.Paused ? styles.workoutBtnDisabled : styles.workoutBtnActive}>
                  <MaterialIcons name="pause" size={iconSize} color={workoutStatus === WorkoutStatus.Paused ? "#8E8E93" : "#FFFFFF"} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.finishWorkoutBtn} onPress={onFinishWorkout}>
              <Text style={styles.finishWorkoutText}>Finish Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      }

      {
        workoutStatus === WorkoutStatus.NotStarted &&
        <View style={styles.headerContainer}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutTitle}>{workoutTitle}</Text>
            {state.currentPlanInfo && (
              <Text style={styles.planInfo}>
                {state.currentPlanInfo.planName} - Week {state.currentPlanInfo.weekNumber}
              </Text>
            )}
            <View style={styles.workoutStats}>
              <Text style={styles.statText}>{exercises.length} exercises</Text>
              <Text style={styles.statText}>•</Text>
              <Text style={styles.statText}>? sets to go</Text>
            </View>
            <TouchableOpacity style={styles.startWorkoutBtn} onPress={startWorkout}>
              <Text style={styles.startWorkoutText}>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
      }

      {/* Exercise list */}
      {exercises.map(ex => {
        const exercise = state.exercisesDict[ex.exercise_id];
        if (!exercise) return null;
        return (
          <ExerciseCard
            key={ex.id}
            workoutExercise={ex}
            exercise={exercise}
            sets={getSetsForExercise(ex.id)}
            onAddSet={() => onAddSetUI(ex.id)}
            onUpdateSet={updateSet}
          />
        );
      })}

      {
        (workoutStatus === WorkoutStatus.InProgress ||
          workoutStatus === WorkoutStatus.Paused) &&
        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: spacingX._25 }}>
          <TouchableOpacity style={styles.addExerciseBtn} onPress={addExerciseOnPress}>
            <Text style={styles.addExerciseText}> + Add Exercise</Text>
          </TouchableOpacity>
        </View>
      }

      {/* Bottom padding for better UX */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const ExerciseCard = ({
  workoutExercise,
  exercise,
  sets,
  onAddSet,
  onUpdateSet
}: {
  workoutExercise: WorkoutExercise;
  exercise: Exercise;
  sets: WorkoutSet[];
  onAddSet: () => void;
  onUpdateSet: (setId: string, field: 'weight' | 'reps', value: number) => void;
}) => {
  return (
    <View style={styles.exerciseCard}>
      {/* Exercise Header */}
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseImageContainer}>
          {exercise.image_key ? (
            <Image source={{ uri: '' }} style={styles.exerciseImage} />
          ) : (
            <View style={[styles.exerciseImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>💪</Text>
            </View>
          )}
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseSubtext}>
            {sets.length === 0 ? 'Tap to add first set' : `${sets.length} sets`}
          </Text>
        </View>
      </View>

      {/* Table Header */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <View style={styles.headerSetContainer}>
            <Text style={styles.headerText}>SET</Text>
          </View>
          <View style={styles.headerInputContainer}>
            <Text style={styles.headerText}>REPS</Text>
          </View>
          <View style={styles.headerInputContainer}>
            <Text style={styles.headerText}>KG</Text>
          </View>
          <View style={styles.headerCheckContainer}>
            <Text style={styles.headerText}>✓</Text>
          </View>
        </View>

        {/* Sets */}
        <View style={styles.setsContainer}>
          {sets.map((set, index) => (
            <SetRow
              key={set.id}
              set={set}
              onUpdateSet={onUpdateSet}
            />
          ))}
        </View>
      </View>

      {/* Add Set Button */}
      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const SetRow = ({
  set,
  onUpdateSet,
}: {
  set: WorkoutSet;
  onUpdateSet: (setId: string, field: 'weight' | 'reps', value: number) => void;
}) => {
  const [isCompleted, setIsCompleted] = useState(false);

  return (
    <View style={styles.setRow}>
      {/* Set number */}
      <View style={styles.setNumberContainer}>
        <Text style={styles.setNumber}>{set.set_number}</Text>
      </View>

      {/* REPS input */}
      {isCompleted ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputComplete}
            placeholder="12"
            value={set.reps?.toString() || ''}
            onChangeText={text => {
              const v = parseInt(text, 10);
              if (!isNaN(v)) onUpdateSet(set.id, 'reps', v);
            }}
            keyboardType="numeric"
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="12"
            value={set.reps?.toString() || ''}
            onChangeText={text => {
              const v = parseInt(text, 10);
              if (!isNaN(v)) onUpdateSet(set.id, 'reps', v);
            }}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* KG input */}
      {isCompleted ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputComplete}
            placeholder="50"
            value={set.weight?.toString() || ''}
            onChangeText={text => {
              const v = parseFloat(text);
              if (!isNaN(v)) onUpdateSet(set.id, 'weight', v);
            }}
            keyboardType="numeric"
          />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="50"
            value={set.weight?.toString() || ''}
            onChangeText={text => {
              const v = parseFloat(text);
              if (!isNaN(v)) onUpdateSet(set.id, 'weight', v);
            }}
            keyboardType="numeric"
          />
        </View>
      )}

      {/* Complete toggle */}
      <TouchableOpacity
        style={[
          styles.checkButton,
          isCompleted && styles.checkButtonCompleted,
        ]}
        onPress={() => setIsCompleted(!isCompleted)}
      >
        {isCompleted && <Text style={styles.checkButtonText}>✓</Text>}
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  // Header Styles (Now part of scrollable content)
  headerContainer: {
    height: screenHeight * 0.25, // 25% of screen height
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
    marginBottom: 4,
  },
  planInfo: {
    fontSize: 16,
    color: '#4600DE',
    fontWeight: '600',
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
    // marginTop: spacingX._3,
    width: screenWidth * 0.5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
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
  addExerciseBtn: {
    color: "#4600DE",
    borderRadius: 12,
    backgroundColor: '#4600DE',
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: spacingX._3,
    width: '40%',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.3,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 16 },
  },
  addExerciseText: {
    color: "#FFFFFF",
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
  separator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
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
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  headerCheckmark: {
    width: 40,
    alignItems: 'center',
  },
  setNumberContainer: {
    width: 40,
    alignItems: 'center',
  },
  prevText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  checkButtonCompleted: {
    backgroundColor: '#4600DE',
    borderColor: '#4600DE',
  },
  tableContainer: {
    marginTop: 16,
  },
  headerSetContainer: {
    width: 40,
    alignItems: 'center',
  },

  headerInputContainer: {
    width: 60,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  headerCheckContainer: {
    width: 40,
    alignItems: 'center',
    marginLeft: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 8,
    gap: spacingY._15
  },

  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Updated Set Row Styles
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    gap: spacingY._15
  },
  setNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4600DE',
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  prevContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  inputContainer: {
    width: 60,
    marginHorizontal: 8,
  },

  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  inputComplete: {
    height: 40,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: '#4600DE',
    color: '#ffffff'
  },
  checkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Updated Add Set Button
  addSetButton: {
    backgroundColor: '#4600DE',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addSetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.72
  },
});

export default WorkoutTracker;
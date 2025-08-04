import React, { createContext, useContext, useReducer } from 'react';
import uuid from 'react-native-uuid';
import {
  Workout,
  WorkoutExercise,
  WorkoutSet,
  Exercise,
} from '@/types';
import { saveFinishWorkout } from '@/lib/workout';
import { Alert } from 'react-native';

type State = {
  workout: Workout | null;
  exercises: WorkoutExercise[];
  sets: WorkoutSet[];
  exercisesDict: Record<number, Exercise>
  //duration: number; // duration of a workout in seconds
};

const initialState: State = {
  workout: null,
  exercises: [],
  sets: [],
  exercisesDict: {}
  //duration: 0
};

type Action =
  | { type: 'START_WORKOUT'; workout: Workout }
  | { type: 'ADD_EXERCISE'; exercise: Exercise }
  | { type: 'ADD_SET'; workoutExerciseId: string }
  | { type: 'UPDATE_SET'; setId: string; field: 'weight' | 'reps'; value: number }
  | { type: 'FINISH_WORKOUT'; finishedAt: Date; durationSeconds: number }
  | { type: 'RESET_WORKOUT'; }

// TODO: remove those console logs once you figure out adding sets/exercises UI
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START_WORKOUT':
      return { ...state, workout: action.workout };

    case 'ADD_EXERCISE': {
      if (!state.workout) return state;
      const newWE: WorkoutExercise = {
        id: uuid.v4(),
        workout_id: state.workout.id,
        exercise_id: action.exercise.id,
        position: state.exercises.length + 1,
      };

      return {
        ...state,
        exercises: [...state.exercises, newWE],
        exercisesDict: {
          ...state.exercisesDict,
          [action.exercise.id]: action.exercise,
        },
      }
    }

    case 'ADD_SET': {
      const existing = state.sets.filter(s => s.workout_exercise_id === action.workoutExerciseId);
      const newSet: WorkoutSet = {
        id: uuid.v4(),
        workout_exercise_id: action.workoutExerciseId,
        set_number: existing.length + 1,
      };

      return { ...state, sets: [...state.sets, newSet] };
    }

    case 'UPDATE_SET':
      const a = {
        ...state,
        sets: state.sets.map(s =>
          s.id === action.setId ? { ...s, [action.field]: action.value } : s
        ),
      };

      console.log(`set added: ${JSON.stringify(a)}`);
      return a;

    case 'FINISH_WORKOUT':
      if (!state.workout) return state;
      const currState = {
        ...state,
        workout: {
          ...state.workout,
          finished_at: action.finishedAt,
          duration_seconds: action.durationSeconds,
        },
      };
      return currState;

    case 'RESET_WORKOUT':
      return initialState;

    default:
      return state;
  }
}

const WorkoutContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
  finishWorkout: (finishedAt: Date, durationSeconds: number) => Promise<void>;
} | null>(null);

export const useWorkout = () => {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkout must be inside <WorkoutProvider>');
  return ctx;
};

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const finishWorkout = async (finishedAt: Date, durationSeconds: number) => {
    if (!state.workout) return;

    const workoutForDb: Workout = {
      ...state.workout,
      finished_at: finishedAt,
      duration_seconds: durationSeconds,
    };

    try {
      await saveFinishWorkout(workoutForDb, state.exercises, state.sets);
      dispatch({ type: 'RESET_WORKOUT' });
    } catch (err) {
      console.error(err);
      Alert.alert('Save failed', 'Please check your connection and try again.');
    }
  };

  return (
    <WorkoutContext.Provider value={{ state, dispatch, finishWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
};

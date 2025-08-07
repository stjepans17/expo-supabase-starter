import { supabase } from "@/config/supabase";
import { Exercise } from "@/types";

export async function fetchRoutinesForUser(userId: string) {
  const { data, error } = await supabase
    .from('routine')
    .select(`
    id,
    name,
    routine_exercise(exercise_id)
  `)
    .eq('user_id', userId);

  if(error) {
    throw error;
  }

  return data;
};

export async function deleteRoutine(routineId: string) {
 const { error } = await supabase
   .from('routine')
   .delete()
   .eq('id', routineId);
   
 if (error) throw error;
 
 return { success: true };
}

export async function addRoutine(
  name: string, 
  exercises: Exercise[], 
  userId: string
) {
  try {
    // Validate inputs
    if (!name.trim()) {
      return { success: false, error: 'Routine name is required' };
    }

    if (!exercises.length) {
      return { success: false, error: 'At least one exercise is required' };
    }

    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Step 1: Insert the routine
    const { data: routineData, error: routineError } = await supabase
      .from('routine')
      .insert({
        user_id: userId,
        name: name.trim(),
      })
      .select('*')
      .single();

    if (routineError) {
      console.error('Error creating routine:', routineError);
      return { success: false, error: 'Failed to create routine' };
    }

    // Step 2: Insert routine exercises
    const routineExercises = exercises.map(exercise => ({
      routine_id: routineData.id,
      exercise_id: exercise.id,
    }));

    const { error: exercisesError } = await supabase
      .from('routine_exercise')
      .insert(routineExercises);

    if (exercisesError) {
      console.error('Error adding exercises to routine:', exercisesError);
      
      // Rollback: Delete the routine if exercises failed to insert
      await supabase
        .from('routine')
        .delete()
        .eq('id', routineData.id);
      
      return { success: false, error: 'Failed to add exercises to routine' };
    }

    return { 
      success: true, 
      routine: {
        id: routineData.id,
        user_id: routineData.user_id,
        name: routineData.name,
        created_at: new Date(routineData.created_at),
      }
    };

  } catch (error) {
    console.error('Unexpected error in addRoutine:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Add this function to your @/lib/routine.ts file

export async function getRoutineExercises(routineId: string): Promise<{
  success: boolean;
  exercises?: Exercise[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('routine')
      .select(`
        id,
        name,
        routine_exercise (
          exercise_id,
          exercise (
            id,
            name,
            description
          )
        )
      `)
      .eq('id', routineId)
      .single();

    if (error) {
      console.error('Error fetching routine exercises:', error);
      return { success: false, error: 'Failed to fetch routine exercises' };
    }

    if (!data || !data.routine_exercise) {
      return { success: false, error: 'Routine not found or has no exercises' };
    }

    const exercises: Exercise[] = data.routine_exercise
      .map((re: any) => re.exercise)
      .filter((exercise: any) => exercise !== null); // Filter out any null exercises

    return { success: true, exercises };
  } catch (error) {
    console.error('Unexpected error in getRoutineExercises:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}




// plan stuff
// Add these functions to your @/lib/routine.ts file

// Complete a plan workout
export async function completePlanWorkout(params: {
  userId: string;
  planId: string;
  weekNumber: number;
  workoutOrder: number;
  routineId: string;
  workoutId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('plan_workout_completion')
      .insert({
        user_id: params.userId,
        plan_id: params.planId,
        week_number: params.weekNumber,
        workout_order: params.workoutOrder,
        routine_id: params.routineId,
        workout_id: params.workoutId,
      });

    if (error) {
      console.error('Error completing plan workout:', error);
      return { success: false, error: 'Failed to mark workout as completed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in completePlanWorkout:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function getPlanProgress(planId: string, userId: string): Promise<{
  success: boolean;
  progress?: {
    totalWorkouts: number;
    completedWorkouts: number;
    completedByWeek: { [week: number]: number };
    nextWorkout?: {
      weekNumber: number;
      workoutOrder: number;
      routineId: string;
      routineName: string;
    };
  };
  error?: string;
}> {
  try {
    // Get the plan with workouts (without routine details first)
    const { data: planData, error: planError } = await supabase
      .from('plan')
      .select(`
        id,
        total_weeks,
        plan_workout (
          week_number,
          workout_order,
          routine_id
        )
      `)
      .eq('id', planId)
      .eq('user_id', userId)
      .single();

    if (planError) {
      console.error('Error fetching plan:', planError);
      return { success: false, error: 'Failed to fetch plan' };
    }

    // Get completed workouts
    const { data: completedData, error: completedError } = await supabase
      .from('plan_workout_completion')
      .select('week_number, workout_order')
      .eq('plan_id', planId)
      .eq('user_id', userId);

    if (completedError) {
      console.error('Error fetching completed workouts:', completedError);
      return { success: false, error: 'Failed to fetch completion data' };
    }

    // Calculate progress
    const totalWorkouts = planData.plan_workout.length;
    const completedWorkouts = completedData.length;

    // Group completions by week
    const completedByWeek: { [week: number]: number } = {};
    completedData.forEach(completion => {
      completedByWeek[completion.week_number] = (completedByWeek[completion.week_number] || 0) + 1;
    });

    // Find next workout
    const completedSet = new Set(
      completedData.map(c => `${c.week_number}-${c.workout_order}`)
    );

    const sortedWorkouts = planData.plan_workout.sort((a: any, b: any) => {
      if (a.week_number !== b.week_number) {
        return a.week_number - b.week_number;
      }
      return a.workout_order - b.workout_order;
    });

    const nextWorkout = sortedWorkouts.find((workout: any) => 
      !completedSet.has(`${workout.week_number}-${workout.workout_order}`)
    );

    // If we have a next workout, get the routine name
    let nextWorkoutWithName = undefined;
    if (nextWorkout) {
      const { data: routineData } = await supabase
        .from('routine')
        .select('name')
        .eq('id', nextWorkout.routine_id)
        .single();

      nextWorkoutWithName = {
        weekNumber: nextWorkout.week_number,
        workoutOrder: nextWorkout.workout_order,
        routineId: nextWorkout.routine_id,
        routineName: routineData?.name || 'Unknown Routine',
      };
    }

    return {
      success: true,
      progress: {
        totalWorkouts,
        completedWorkouts,
        completedByWeek,
        nextWorkout: nextWorkoutWithName,
      },
    };
  } catch (error) {
    console.error('Unexpected error in getPlanProgress:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Check if a specific workout is completed
export async function isWorkoutCompleted(
  planId: string,
  userId: string,
  weekNumber: number,
  workoutOrder: number
): Promise<{ success: boolean; isCompleted?: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('plan_workout_completion')
      .select('id')
      .eq('plan_id', planId)
      .eq('user_id', userId)
      .eq('week_number', weekNumber)
      .eq('workout_order', workoutOrder)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking workout completion:', error);
      return { success: false, error: 'Failed to check completion status' };
    }

    return { success: true, isCompleted: !!data };
  } catch (error) {
    console.error('Unexpected error in isWorkoutCompleted:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get user's plan completion history
export async function getPlanCompletionHistory(userId: string): Promise<{
  success: boolean;
  completions?: Array<{
    planName: string;
    routineName: string;
    weekNumber: number;
    workoutOrder: number;
    completedAt: Date;
    workoutDuration?: number;
  }>;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('plan_workout_completion')
      .select(`
        week_number,
        workout_order,
        completed_at,
        plan (
          name
        ),
        routine (
          name
        ),
        workout (
          duration_seconds
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Error fetching completion history:', error);
      return { success: false, error: 'Failed to fetch completion history' };
    }

    const completions = data.map((completion: any) => ({
      planName: completion.plan.name,
      routineName: completion.routine.name,
      weekNumber: completion.week_number,
      workoutOrder: completion.workout_order,
      completedAt: new Date(completion.completed_at),
      workoutDuration: completion.workout.duration_seconds,
    }));

    return { success: true, completions };
  } catch (error) {
    console.error('Unexpected error in getPlanCompletionHistory:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}
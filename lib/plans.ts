import { supabase } from "@/config/supabase";
import { Exercise } from "@/types";

// Existing routine functions...
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

// ========================
// PLAN MANAGEMENT FUNCTIONS
// ========================

// Plan Types
export type Plan = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  total_weeks: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
};

export type PlanWorkout = {
  id: string;
  plan_id: string;
  week_number: number;
  workout_order: number;
  routine_id: string;
};

export type PlanWithWorkouts = Plan & {
  workouts: (PlanWorkout & {
    routine: {
      id: string;
      name: string;
    };
  })[];
};

export type WeekWorkouts = {
  week_number: number;
  workouts: {
    order: number;
    routine_id: string;
  }[];
};

export type CreatePlanData = {
  name: string;
  description?: string;
  total_weeks: number;
  weeks: WeekWorkouts[];
};

// Create a new plan
export async function createPlan(
  planData: CreatePlanData,
  userId: string
): Promise<{ success: boolean; planId?: string; error?: string }> {
  try {
    // Validate inputs
    if (!planData.name.trim()) {
      return { success: false, error: 'Plan name is required' };
    }

    if (!planData.weeks.length) {
      return { success: false, error: 'At least one week is required' };
    }

    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    // Insert plan
    const { data: plan, error: planError } = await supabase
      .from('plan')
      .insert({
        user_id: userId,
        name: planData.name.trim(),
        description: planData.description,
        total_weeks: planData.total_weeks,
      })
      .select('id')
      .single();

    if (planError) {
      console.error('Error creating plan:', planError);
      return { success: false, error: 'Failed to create plan' };
    }

    // Insert all workouts
    const workouts = planData.weeks.flatMap(week =>
      week.workouts.map(workout => ({
        plan_id: plan.id,
        week_number: week.week_number,
        workout_order: workout.order,
        routine_id: workout.routine_id,
      }))
    );

    const { error: workoutsError } = await supabase
      .from('plan_workout')
      .insert(workouts);

    if (workoutsError) {
      console.error('Error creating plan workouts:', workoutsError);
      
      // Rollback: Delete the plan if workouts failed to insert
      await supabase
        .from('plan')
        .delete()
        .eq('id', plan.id);
      
      return { success: false, error: 'Failed to create plan workouts' };
    }

    return { success: true, planId: plan.id };
  } catch (error) {
    console.error('Unexpected error in createPlan:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get all plans for a user
export async function getUserPlans(userId: string): Promise<{
  success: boolean;
  plans?: Plan[];
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('plan')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching plans:', error);
      return { success: false, error: 'Failed to fetch plans' };
    }

    const plans = data.map(plan => ({
      ...plan,
      created_at: new Date(plan.created_at),
      updated_at: new Date(plan.updated_at),
    }));

    return { success: true, plans };
  } catch (error) {
    console.error('Unexpected error in getUserPlans:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get a plan with all its workouts
export async function getPlanWithWorkouts(planId: string): Promise<{
  success: boolean;
  plan?: PlanWithWorkouts;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('plan')
      .select(`
        *,
        plan_workout (
          *,
          routine (
            id,
            name
          )
        )
      `)
      .eq('id', planId)
      .single();

    if (error) {
      console.error('Error fetching plan with workouts:', error);
      return { success: false, error: 'Failed to fetch plan' };
    }

    const plan: PlanWithWorkouts = {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      workouts: data.plan_workout
        .sort((a: any, b: any) => {
          if (a.week_number !== b.week_number) {
            return a.week_number - b.week_number;
          }
          return a.workout_order - b.workout_order;
        })
        .map((workout: any) => ({
          ...workout,
          routine: workout.routine
        }))
    };

    return { success: true, plan };
  } catch (error) {
    console.error('Unexpected error in getPlanWithWorkouts:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function setActivePlan(planId: string, userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // First deactivate all plans for this user
    await supabase
      .from('plan')
      .update({ is_active: false })
      .eq('user_id', userId);

    // Then activate the selected plan
    const { error } = await supabase
      .from('plan')
      .update({ is_active: true })
      .eq('id', planId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error setting active plan:', error);
      return { success: false, error: 'Failed to set active plan' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in setActivePlan:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Get the currently active plan for a user
export async function getActivePlan(userId: string): Promise<{
  success: boolean;
  plan?: PlanWithWorkouts;
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('plan')
      .select(`
        *,
        plan_workout (
          *,
          routine (
            id,
            name
          )
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Error fetching active plan:', error);
      return { success: false, error: 'Failed to fetch active plan' };
    }

    if (!data) {
      return { success: true, plan: undefined };
    }

    const plan: PlanWithWorkouts = {
      ...data,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
      workouts: data.plan_workout
        .sort((a: any, b: any) => {
          if (a.week_number !== b.week_number) {
            return a.week_number - b.week_number;
          }
          return a.workout_order - b.workout_order;
        })
        .map((workout: any) => ({
          ...workout,
          routine: workout.routine
        }))
    };

    return { success: true, plan };
  } catch (error) {
    console.error('Unexpected error in getActivePlan:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Delete a plan
export async function deletePlan(planId: string, userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase
      .from('plan')
      .delete()
      .eq('id', planId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting plan:', error);
      return { success: false, error: 'Failed to delete plan' };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error in deletePlan:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

// Helper function to group workouts by week
export function groupWorkoutsByWeek(workouts: (PlanWorkout & { routine: { id: string; name: string } })[]) {
  const weeks: { [week: number]: typeof workouts } = {};
  
  workouts.forEach(workout => {
    if (!weeks[workout.week_number]) {
      weeks[workout.week_number] = [];
    }
    weeks[workout.week_number].push(workout);
  });

  // Sort workouts within each week by order
  Object.keys(weeks).forEach(weekKey => {
    const week = parseInt(weekKey);
    weeks[week].sort((a, b) => a.workout_order - b.workout_order);
  });

  return weeks;
}

// // Add this function to your @/lib/routine.ts file

// export async function setActivePlan(planId: string, userId: string): Promise<{
//   success: boolean;
//   error?: string;
// }> {
//   try {
//     const { error } = await supabase
//       .from('plan')
//       .update({ is_active: true })
//       .eq('id', planId)
//       .eq('user_id', userId);

//     if (error) {
//       console.error('Error setting active plan:', error);
//       return { success: false, error: 'Failed to set active plan' };
//     }

//     return { success: true };
//   } catch (error) {
//     console.error('Unexpected error in setActivePlan:', error);
//     return { success: false, error: 'An unexpected error occurred' };
//   }
// }
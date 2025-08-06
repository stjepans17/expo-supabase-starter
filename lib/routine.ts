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
import { supabase } from "@/config/supabase";

export const fetchWorkoutByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('workout')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw error;

  console.log('Workout by user id fetched:', data);
  return data;
};

// export const fetchExercisesLengthFromWorkoutId = async (workout_id: string) => {
//   const { data, count, error } = await supabase
//     .from('workoutexercise')
//     .select('*', { count: 'exact' })
//     .eq('workout_id', workout_id)

//   if (error) throw error;
//   console.log('Data returned:', data);
//   console.log('Count returned:', count);
//   console.log('Workout ID being searched:', workout_id);
//   return count; 
// };

export const fetchExercisesLengthFromWorkoutId = async (workout_id: string) => {
  console.log('Searching for workout_id:', workout_id);
  console.log('Type of workout_id:', typeof workout_id);

  // First, let's see ALL the data in the table
  const { data: allData, error: allError } = await supabase
    .from('workoutexercise')
    .select('*')
    .limit(5); // Just get first 5 rows to see structure

  console.log('First 5 rows from workoutexercise table:', allData);
  console.log('Column names:', allData?.[0] ? Object.keys(allData[0]) : 'No data');

  // Now try the specific query
  const { data, count, error } = await supabase
    .from('workoutexercise')
    .select('*', { count: 'exact' })
    .eq('workout_id', workout_id)

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }

  console.log('Filtered data:', data);
  console.log('Count:', count);

  return count;
};

export async function fetchAllWorkoutDatesForUser(user_id: string) {
  const { data, error } = await supabase
    .from('workout')
    .select('performed_at')
    .eq('user_id', user_id)
    .order('performed_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
};
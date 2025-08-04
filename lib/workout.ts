import { supabase } from "@/config/supabase";
import { Workout, WorkoutExercise, WorkoutSet } from "@/types";

export const fetchWorkoutByUserId = async (user_id: string) => {
  const { data, error } = await supabase
    .from('workout')
    .select('*')
    .eq('user_id', user_id);

  if (error) throw error;

  return data;
};

export const fetchExercisesLengthFromWorkoutId = async (workout_id: string) => {

  const { data, count, error } = await supabase
    .from('workout_exercise')
    .select('*', { count: 'exact' })
    .eq('workout_id', workout_id)

  if (error) {
    console.error('Query error:', error);
    throw error;
  }

  return count;
};

export async function fetchAllWorkoutDatesForUser(user_id: string) {
  const { data, error } = await supabase
    .from('workout')
    .select('performed_at')
    .eq('user_id', user_id)
    .order('performed_at', { ascending: false });

  if (error) {
    console.error('Query error:', error);
    throw error;
  }

  return data;
};

export async function saveStartWorkout(workout: Workout) {
  const { data, error } = await supabase
  .from('workout')
  .insert({ id: workout.id, user_id: workout.user_id, name: workout.name, performed_at: workout.performed_at })
  .select()

  if (error) {
    console.error('Query error:', error);
    throw error;
  }

  return data;
}

export async function saveFinishWorkout(
  workout: Workout,
  workoutExercises: WorkoutExercise[],
  workoutSets: WorkoutSet[],
) {

  // 1. update the existing entry
  const { error: workoutErr } = await supabase
    .from('workout')
    .update({
      finished_at: workout.finished_at,
      duration_seconds: workout.duration_seconds,
    })
    .eq('id', workout.id)
    .single();

  if (workoutErr) throw workoutErr;

  // 2. insert exercises
  if (workoutExercises.length) {
    const { error: exErr } = await supabase
      .from('workout_exercise')
      .insert(workoutExercises);

    if (exErr) throw exErr;
  }

  // 3. insert sets
  if (workoutSets.length) {
    const { error: setErr } = await supabase
      .from('workout_set')
      .insert(workoutSets);

    if (setErr) throw setErr;
  }

  // TODO: if anything fails roll it back
  return true;
}
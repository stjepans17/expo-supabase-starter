import { supabase } from "@/config/supabase";

export const fetchProfileById = async (userId: string) => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq("id", userId)
    .single();

  if (error) throw error;

  return data;
};

export async function updateWeight(userId: string, newWeight: number) {
  try {
    // Start a transaction-like operation
    const { data: historyData, error: historyError } = await supabase
      .from('weight_history')
      .insert({
        profile_id: userId,
        weight: newWeight,
      });

    if (historyError) throw historyError;

    const { data: profileData, error: profileError } = await supabase
      .from('profile')
      .update({ weight: newWeight })
      .eq('id', userId);

    if (profileError) throw profileError;

    return { success: true, data: { history: historyData, profile: profileData } };
  } catch (error: any) {
    console.error('Error updating weight:', error);
    return { success: false, error: error.message };
  }
}

export async function getWeightHistory(userId: string) {
  const { data, error } = await supabase
    .from('weight_history')
    .select('recorded_at, weight')
    .eq('profile_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(10);

  if (error) throw error;

  return data?.map(item => ({
    recorded_at: item.recorded_at,
    weight: item.weight.toString()
  })) || [];
}

export async function getHeaviestLift(userId: string): Promise<{
  success: boolean;
  heaviestLift?: {
    weight: number;
    exerciseName: string;
  };
  error?: string;
}> {
  try {
    const { data, error } = await supabase.rpc('get_heaviest_lift', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching heaviest lift:', error);
      return { success: false, error: 'Failed to fetch heaviest lift' };
    }

    if (!data || data.length === 0) {
      return { success: true, heaviestLift: undefined };
    }

    const result = data[0];
    const heaviestLift = {
      weight: parseFloat(result.weight),
      exerciseName: result.exercise_name,
    };

    return { success: true, heaviestLift };
  } catch (error) {
    console.error('Unexpected error in getHeaviestLift:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}



export async function getLongestWorkout(userId: string) {
  const { data, error } = await supabase
    .from('workout')
    .select('name, duration_seconds')
    .eq('user_id', userId)         
    .not('finished_at', 'is', null)                
    .order('duration_seconds', { ascending: false })
    .limit(1);                                     

  if (error) throw error;

  return (
    data?.map(({ name, duration_seconds }) => ({
      workout_name: name,
      duration: duration_seconds,
    })) || []
  );
}
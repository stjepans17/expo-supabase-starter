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

  if(error) throw error;

  return data?.map(item => ({
    recorded_at: item.recorded_at,
    weight: item.weight.toString()
  })) || [];
}
import { supabase } from "@/config/supabase";
import { Muscle } from "@/types";

export const fetchAllMuscles = async () => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*');
  
  if (error) throw error;

  return data; 
};

export const fetchMusclesByMuscleGroupId = async (muscleGroupId: number) : Promise<Muscle[]> => {
  const { data, error } = await supabase
    .from('muscle')
    .select('*')
    .eq("muscle_group_id", muscleGroupId);
  
  if (error) throw error;

  return data as Muscle[]; 
};

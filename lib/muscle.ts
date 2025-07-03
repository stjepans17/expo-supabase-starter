import { supabase } from "@/config/supabase";
import { Muscle } from "@/types";

export const fetchAllMuscles = async () => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*');
  
  if (error) throw error;

  console.log('Exercises fetched:', data);
  return data; 
};

export const fetchMusclesByMuscleGroupId = async (muscleGroupId: number) : Promise<Muscle[]> => {
  const { data, error } = await supabase
    .from('muscle')
    .select('*')
    .eq("musclegroupid", muscleGroupId);
  
  if (error) throw error;
  console.log('Data fetched:', data);

  return data as Muscle[]; 
};

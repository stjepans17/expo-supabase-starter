import { supabase } from "@/config/supabase";

export const fetchAllExercises = async () => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*');
  
  if (error) throw error;

  console.log('Exercises fetched:', data);
  return data; 
};

export const fetchExerciseById = async (id: number) => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*')
    .eq('id', id);
  
  if (error) throw error;

  console.log('Exercise by id fetched:', data);
  return data; 
};

export const fetchExercisesByMuscleId = async (muscleId: number) => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*')
    .eq('muscleid', muscleId);
  
  if (error) throw error;

  console.log('Exercises by muscle id fetched:', data);
  return data; 
};

export const fetchExerciseByName = async (name: string) => {
  const { data, error } = await supabase
    .from('exercise')
    .select('*')
    .eq('name', name);
  
  if (error) throw error;

  console.log('Exercise by name fetched:', data);
  return data; 
};

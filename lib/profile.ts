import { supabase } from "@/config/supabase";

export const fetchProfileById = async (userId: string) => {
  const { data, error } = await supabase
    .from('profile')
    .select('*')
    .eq("id", userId)
    .single();
  
  if (error) throw error;

  console.log('Profile fetched:', data);
  return data; 
};
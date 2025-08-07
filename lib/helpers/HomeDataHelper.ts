// Add these functions to your Home component or create a separate utility file

import { PlanWithWorkouts } from "@/types";
import { getPlanProgress } from "../routine";
import { supabase } from "@/config/supabase";

interface ProgressData {
  title: string;
  percentage: string;
}

// Helper function to get current week number in a month
const getWeekOfMonth = (date: Date): number => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekday = firstDayOfMonth.getDay();
  const offsetDate = date.getDate() + firstWeekday - 1;
  return Math.floor(offsetDate / 7) + 1;
};

// Helper function to get start and end of current week
const getCurrentWeekBounds = (): { start: Date; end: Date } => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const start = new Date(today);
  start.setDate(today.getDate() - dayOfWeek + 1); // Monday
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

// Helper function to get start and end of current month
const getCurrentMonthBounds = (): { start: Date; end: Date } => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
};

// Function to calculate dynamic progress data
export const calculateProgressData = async (
  activePlan: PlanWithWorkouts | null, 
  userId: string
): Promise<ProgressData[]> => {
  if (!activePlan) {
    return [
      { title: 'Daily', percentage: '0%' },
      { title: 'Weekly', percentage: '0%' },
      { title: 'Monthly', percentage: '0%' }
    ];
  }

  try {
    // Get all plan completions for this user and plan
    const { data: completions, error } = await supabase
      .from('plan_workout_completion')
      .select('completed_at, week_number, workout_order')
      .eq('user_id', userId)
      .eq('plan_id', activePlan.id);

    if (error) {
      console.error('Error fetching completions:', error);
      return [
        { title: 'Daily', percentage: '0%' },
        { title: 'Weekly', percentage: '0%' },
        { title: 'Monthly', percentage: '0%' }
      ];
    }

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayStart.getDate() + 1);

    const weekBounds = getCurrentWeekBounds();
    const monthBounds = getCurrentMonthBounds();

    // DAILY PROGRESS: 100% if any workout completed today, 0% otherwise
    const todayCompletions = completions?.filter((completion: { completed_at: string | number | Date; }) => {
      const completedDate = new Date(completion.completed_at);
      return completedDate >= todayStart && completedDate < todayEnd;
    }) || [];

    const dailyPercentage = todayCompletions.length > 0 ? 100 : 0;

    // WEEKLY PROGRESS: Get current plan week and calculate completion
    const planProgress = await getPlanProgress(activePlan.id, userId);
    let weeklyPercentage = 0;
    
    if (planProgress.success && planProgress.progress?.nextWorkout) {
      const currentPlanWeek = planProgress.progress.nextWorkout.weekNumber;
      
      // Get all workouts for current plan week
      const currentWeekWorkouts = activePlan.workouts.filter(
        workout => workout.week_number === currentPlanWeek
      );
      
      // Get completions for current plan week
      const currentWeekCompletions = completions?.filter(
        completion => completion.week_number === currentPlanWeek
      ) || [];
      
      if (currentWeekWorkouts.length > 0) {
        weeklyPercentage = Math.round((currentWeekCompletions.length / currentWeekWorkouts.length) * 100);
      }
    }

    // MONTHLY PROGRESS: Completions this calendar month vs expected for this month
    const totalPlanWorkouts = activePlan.workouts.length;
    const totalCompletions = completions.length;
    const monthlyPercentage = totalPlanWorkouts > 0
      ? Math.round((totalCompletions / totalPlanWorkouts) * 100)
      : 0;
    
    return [
      { title: 'Daily', percentage: `${dailyPercentage}%` },
      { title: 'Weekly', percentage: `${weeklyPercentage}%` },
      { title: 'Monthly', percentage: `${monthlyPercentage}%` }
    ];

  } catch (error) {
    console.error('Error calculating progress data:', error);
    return [
      { title: 'Daily', percentage: '0%' },
      { title: 'Weekly', percentage: '0%' },
      { title: 'Monthly', percentage: '0%' }
    ];
  }
};
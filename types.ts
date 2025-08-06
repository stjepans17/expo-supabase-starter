import React from "react";
import { TextInput, TextInputProps, TextProps, TextStyle, TouchableOpacityProps, ViewStyle } from "react-native";

export type ScreenWrapperProps = {
    style?: ViewStyle;
    children: React.ReactNode;
    bg?: string;
}

export type TypoProps = {
    size?: number;
    color?: string;
    fontWeight?: TextStyle["fontWeight"];
    fontFamily?: string;
    children: any | null;
    style?: TextStyle;
    textProps?: TextProps;
}

export type Profile = {
    id?: string
    created_at: string
    full_name?: string
    height?: number
    weight?: number
    birth_date?: string
}

export type Muscle = {
    id: number
    name: string
    muscle_group_id: number
    description?: string
}

export type Exercise = {
    id: number;
    name: string;
    muscle_id: number;
    description?: string;
    image_key?: string;
}

export type MuscleGroup = {
    id: number
    name: string
    description?: string
}

export type Workout = {
    id: string;
    user_id: string;
    performed_at: Date;
    duration_seconds?: number;
    name?: string;
    finished_at?: Date;
};

export type WorkoutExercise = {
    id: string;
    workout_id: string; // references id from Workout
    exercise_id: number;
    position: number;
};

export type WorkoutSet = {
    id: string;
    workout_exercise_id: string; // references id from WorkoutExercise
    set_number: number;
    reps?: number;
    weight?: number;
};

export type User = {
    id: string;
    aud: string;
    role: string;
    email: string;
    email_confirmed_at?: Date;
    phone?: string;
    confirmed_at?: Date;
    last_sign_in_at: Date;
    app_metadata: {
        provider: string;
        providers: string[];
    };
};

export type Routine = {
    id: string,
    user_id: string,
    name: string,
    created_at: Date;
}

export type RoutineExercise = {
    routine_id: string,
    exercise_id: number,
    added_at: Date
}

export type Plan = {
  id: string;
  user_id: string;
  name: string;
  total_weeks: number;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
};

export type PlanWorkout = {
  id: string;
  plan_id: string;
  week_number: number;
  workout_order: number; // 1, 2, 3, etc.
  routine_id: string;
};

// Extended types for UI
export type PlanWithWorkouts = Plan & {
  workouts: (PlanWorkout & {
    routine: {
      id: string;
      name: string;
    };
  })[];
};

export type WeekWorkouts = {
  week_number: number;
  workouts: {
    order: number;
    routine_id: string;
  }[];
};

export type CreatePlanData = {
  name: string;
  description?: string;
  total_weeks: number;
  weeks: WeekWorkouts[];
};

export interface CustomButtonProps extends TouchableOpacityProps {
    style?: ViewStyle;
    onPress?: () => void;
    loading?: boolean;
    children: React.ReactNode;
}

export interface InputProps extends TextInputProps {
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    inputStyle?: TextStyle;
    inputRef?: React.RefObject<TextInput>;
}
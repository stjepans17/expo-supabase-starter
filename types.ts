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
    musclegroupid: number
    description?: string
}

export type Exercise = {
    id: number;
    name: string;
    muscleid: number;
    description?: string;
    imagekey?: string;
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
    duration_min?: number;  
    name?: string;
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
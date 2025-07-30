import "../global.css";

import { Stack } from "expo-router";
import { AuthProvider } from "@/context/supabase-provider";
import { useColorScheme } from "@/lib/useColorScheme";
import { colors } from "@/constants/colors";
import { WorkoutProvider } from '@/context/WorkoutProvider';

export default function AppLayout() {
	const { colorScheme } = useColorScheme();

	return (
		<AuthProvider>
			<Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
				<Stack.Screen name="(protected)" />
				<Stack.Screen name="welcome" />
				<Stack.Screen
					name="sign-up"
					options={{
						presentation: "modal",
						headerShown: true,
						headerTitle: "Sign Up",
						headerStyle: {
							backgroundColor:
								colorScheme === "dark"
									? colors.dark.background
									: colors.light.background,
						},
						headerTintColor:
							colorScheme === "dark"
								? colors.dark.foreground
								: colors.light.foreground,
						gestureEnabled: true,
					}}
				/>
				<Stack.Screen
					name="sign-in"
					options={{
						presentation: "modal",
						headerShown: true,
						headerTitle: "liftlogic",
						headerStyle: {
							backgroundColor:
								// colorScheme === "dark"
								// 	? colors.dark.background
								// 	: colors.light.background,
								colors.light.background
						},
						headerTintColor:
							colors.light.foreground,
						//s colorScheme === "dark"
						// 	? colors.dark.foreground
						// 	: colors.light.foreground,
						gestureEnabled: false,
					}}
				/>
			</Stack>
		</AuthProvider>
	);
}


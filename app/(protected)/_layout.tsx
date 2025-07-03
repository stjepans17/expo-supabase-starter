import { Redirect, SplashScreen, Stack } from "expo-router";
import { useAuth } from "@/context/supabase-provider";
import { ActivityIndicator } from "react-native";
import { useEffect } from "react";

export const unstable_settings = {
	initialRouteName: "(tabs)",
};

export default function ProtectedLayout() {
	const { initialized, session } = useAuth();

	useEffect(() => {
    if (!initialized) {
      SplashScreen.preventAutoHideAsync();
    } else {
      SplashScreen.hideAsync();
    }
  }, [initialized]);
	
	if (!initialized) {
		return null;
	}

	if (!session) {
		return <Redirect href="/welcome" />;
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="(tabs)" />
			<Stack.Screen name="modal" options={{ presentation: "modal" }} />
		</Stack>
	);
}

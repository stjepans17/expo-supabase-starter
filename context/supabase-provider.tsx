import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { SplashScreen, useRouter } from "expo-router";

import { Session } from "@supabase/supabase-js";

import { supabase } from "@/config/supabase";
import { fetchAllExercises } from "@/lib/exercise";
import { Profile } from "@/types";
import { fetchProfileById } from "@/lib/profile";

SplashScreen.preventAutoHideAsync();

type AuthState = {
	initialized: boolean;
	session: Session | null;
	profile: Profile | null;
	signUp: (email: string, password: string) => Promise<void>;
	signIn: (email: string, password: string) => Promise<any>;
	signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthState>({
	initialized: false,
	session: null,
	profile: null,
	signUp: async () => { },
	signIn: async () => { },
	signOut: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: PropsWithChildren) {
	const [initialized, setInitialized] = useState(false);
	const [session, setSession] = useState<Session | null>(null);
	const [profile, setProfile] = useState<Profile | null>(null);
	const router = useRouter();

	useEffect(() => {
		// 1) keep the splash screen visible until we're ready
		SplashScreen.preventAutoHideAsync();

		// 2) fetch the initial session, then mark initialized & hide splash
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setInitialized(true);
			SplashScreen.hideAsync();
		});

		// 3) subscribe to auth‐state changes
		const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
			setSession(newSession);
		});

		// 4) cleanup on unmount
		return () => {
			data.subscription.unsubscribe();
		};
	}, []);

	// fetch profile whenever session.user.id changes...
	useEffect(() => {
		if (session?.user.id) {
			fetchProfileById(session.user.id).then(setProfile);
		} else {
			setProfile(null);
		}
	}, [session]);

	const signUp = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			console.error("Error signing up:", error);
			return;
		}

		if (data.session) {
			setSession(data.session);
			console.log("User signed up:", data.user);
		} else {
			console.log("No user returned from sign up");
		}
	};

	const signIn = async (email: string, password: string) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			console.error("Error signing in:", error);
			return { data: null, error };
		}

		if (data.session) {
			setSession(data.session);
			console.log("User signed in:", data.user);
			return { data, error: null };
		} else {
			console.log("No user returned from sign in");
		}
	};

	const signOut = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.error("Error signing out:", error);
			return;
		} else {
			console.log("User signed out");
		}
	};

	useEffect(() => {
		if (session?.user?.id) {
			fetchProfileById(session.user.id).then(setProfile);
		} else {
			setProfile(null);
		}
	}, [session]);

	return (
		<AuthContext.Provider
			value={{
				initialized,
				session,
				profile,
				signUp,
				signIn,
				signOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

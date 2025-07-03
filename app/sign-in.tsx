import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet, Alert } from "react-native";
import * as z from "zod";

import Button from "@/components/mine/Button";
import { useAuth } from "@/context/supabase-provider";
import { radius, spacingX, spacingY } from "@/constants/spacings";
import ScreenWrapper from "@/components/mine/ScreenWrapper";
import Typo from "@/components/mine/Typo";
import { ImageTemplate } from "@/components/image";
import * as Icons from 'phosphor-react-native'
import Input from "@/components/mine/Input";
import { verticalScale } from "@/constants/styling";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";

const formSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z
		.string()
		.min(6, "Please enter at least 6 characters.")
		.max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
	const { signIn, session } = useAuth();
	const [loading, setLoading] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.replace("/");
		}
	}, [session]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			setLoading(true);
			const { data, error } = await signIn(values.email, values.password);
			setLoading(false);

			if (error) {
				Alert.alert('Sign In Failed', error.message);
			}
			
			form.reset();
		} catch (error: Error | any) {
			console.error(error.message);
		}
	}

	if (loading) {
		return (
			<ScreenWrapper>
				<View style={styles.loader}>
					<ActivityIndicator size="small" />
				</View>
			</ScreenWrapper>
		);
	}

	return (
		<ScreenWrapper>
			<View style={{ height: "95%", width: "90%", alignItems: "flex-start", justifyContent: "center", marginBottom: spacingX._15 }}>
				{/* <View style={styles.header}>
					<ImageTemplate
							source={require("@/assets/liftlogic.svg")}
							resizeMode="contain"
							style={styles.logoImage}
						/>
				</View> */}
				<View style={styles.main}>
					<Typo fontFamily='Inter-Bold' size={24} style={{ letterSpacing: -0.72, marginBottom: spacingY._10 }}>Welcome back!</Typo>
					<View style={styles.form}>
						<Controller
							control={form.control}
							name="email"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Enter your email"
									icon={<Icons.At size={verticalScale(26)} color={"black"} />}
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
									autoCapitalize="none"
									keyboardType="email-address"
									autoCorrect={false}
								/>
							)}
						/>
						<Controller
							control={form.control}
							name="password"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Enter password"
									icon={<Icons.Lock size={verticalScale(26)} color={"black"} />}
									secureTextEntry
									value={value}
									onChangeText={onChange}
									onBlur={onBlur}
								/>
							)}
						/>
					</View>
				</View>
				<View style={styles.footer}>
					<View style={styles.buttonContainerNext}>
						<Button style={{ backgroundColor: "#4600DE" }} onPress={form.handleSubmit(onSubmit)}>
							<Typo color='white' fontFamily='Inter-Bold'>Next</Typo>
						</Button>
					</View>
				</View>
			</View>
		</ScreenWrapper>
	)
}

const styles = StyleSheet.create({
	header: {
		flex: 1,
		justifyContent: "center",
		alignItems: "flex-start",
		width: "100%",
		marginBottom: spacingX._15
	},
	main: {
		flex: 6,
		justifyContent: "flex-start",
		alignItems: "flex-start",
		width: "100%"
	},
	mainContent: {
		justifyContent: "flex-start",
		alignItems: "flex-start",
		flex: 1
	},
	footer: {
		flex: 2,
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: spacingY._10,
		// paddingBottom: spacingX._7, // Added bottom padding
		width: "100%",
		flexDirection: "row"
	},
	buttonContainerNext: {
		width: "100%",
		backgroundColor: "white",
		flex: 5,
		marginLeft: spacingX._3,
		marginRight: spacingX._3
	},
	buttonContainerBack: {
		width: "100%",
		backgroundColor: "white",
		flex: 1,
	},
	form: {
		gap: spacingY._3,
		flex: 1
	},
	logoImage: {
		width: "100%",
		height: "50%"
	},
	loader: { flex: 1, justifyContent: 'center', alignItems: 'center' }
})


// 	return (
// 		<SafeAreaView className="flex-1 bg-background p-4" edges={["bottom"]}>
// 			<View className="flex-1 gap-4 web:m-4">
// 				<H1 className="self-start ">Sign In</H1>
// 				<Form {...form}>
// 					<View className="gap-4">
// 						<FormField
// 							control={form.control}
// 							name="email"
// 							render={({ field }) => (
// 								<FormInput
// 									label="Email"
// 									placeholder="Email"
// 									autoCapitalize="none"
// 									autoComplete="email"
// 									autoCorrect={false}
// 									keyboardType="email-address"
// 									{...field}
// 								/>
// 							)}
// 						/>
// 						<FormField
// 							control={form.control}
// 							name="password"
// 							render={({ field }) => (
// 								<FormInput
// 									label="Password"
// 									placeholder="Password"
// 									autoCapitalize="none"
// 									autoCorrect={false}
// 									secureTextEntry
// 									{...field}
// 								/>
// 							)}
// 						/>
// 					</View>
// 				</Form>
// 			</View>
// 			<Button
// 				size="default"
// 				variant="default"
// 				onPress={form.handleSubmit(onSubmit)}
// 				disabled={form.formState.isSubmitting}
// 				className="web:m-4"
// 			>
// 				{form.formState.isSubmitting ? (
// 					<ActivityIndicator size="small" />
// 				) : (
// 					<Text>Sign In</Text>
// 				)}
// 			</Button>
// 		</SafeAreaView>
// 	);
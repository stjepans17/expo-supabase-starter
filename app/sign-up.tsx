import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import Button from "@/components/mine/Button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1 } from "@/components/ui/typography";
import { useAuth } from "@/context/supabase-provider";
import ScreenWrapper from "@/components/mine/ScreenWrapper";
import Typo from "@/components/mine/Typo";
import { spacingX, spacingY } from "@/constants/spacings";
import { verticalScale } from "@/constants/styling";
import Input from "@/components/mine/Input";
import * as Icons from "phosphor-react-native";

const formSchema = z
	.object({
		email: z.string().email("Please enter a valid email address."),
		password: z
			.string()
			.min(8, "Please enter at least 8 characters.")
			.max(64, "Please enter fewer than 64 characters.")
			.regex(
				/^(?=.*[a-z])/,
				"Your password must have at least one lowercase letter.",
			)
			.regex(
				/^(?=.*[A-Z])/,
				"Your password must have at least one uppercase letter.",
			)
			.regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
			.regex(
				/^(?=.*[!@#$%^&*])/,
				"Your password must have at least one special character.",
			),
		confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Your passwords do not match.",
		path: ["confirmPassword"],
	});

export default function SignUp() {
	const { signUp } = useAuth();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		try {
			await signUp(data.email, data.password);

			form.reset();
		} catch (error: Error | any) {
			console.error(error.message);
		}
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
					<Typo fontFamily='Inter-Bold' size={24} style={{ letterSpacing: -0.72, marginBottom: spacingY._10 }}>Let's create your account!</Typo>
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
						<Controller
							control={form.control}
							name="confirmPassword"
							render={({ field: { onChange, onBlur, value } }) => (
								<Input
									placeholder="Confirm your password"
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
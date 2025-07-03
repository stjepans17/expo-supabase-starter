import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useAuth } from '@/context/supabase-provider';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import { radius, spacingX } from '@/constants/spacings';
import { ImageTemplate } from '@/components/image';

const settings = () => {
	const { profile } = useAuth();

	function getAgeFromDateString(dateString?: string): string {
		if (!dateString) return "N/A";

		const today = new Date();
		const birthDate = new Date(dateString);

		let age = today.getFullYear() - birthDate.getFullYear();
		const monthDiff = today.getMonth() - birthDate.getMonth();
		const dayDiff = today.getDate() - birthDate.getDate();

		// Adjust age if birthday hasn't occurred yet this year
		if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
			age--;
		}

		return age.toString();
	}

	return (
		<ScreenWrapper>
			<View style={{ height: "100%", width: "95%", alignItems: "flex-start", justifyContent: "flex-start", marginBottom: spacingX._15 }}>
				<View style={styles.card}>
					<View style={{ flex: 5 }}>
						<Text style={styles.text}>Name</Text>
					</View>
					<View style={{ flex: 5, alignItems: "center" }}>
						<Text style={styles.profileText}>{profile?.full_name}</Text>
					</View>
					<View style={{ flexBasis: 20, aspectRatio: 1, alignItems: "center", justifyContent: "flex-end"}}>
						<ImageTemplate
							source={require("@/assets/purple_arrow.svg")}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
				</View>
				<View style={styles.card}>
					<View style={{ flex: 5 }}>
						<Text style={styles.text}>Age</Text>
					</View>
					<View style={{ flex: 5, alignItems: "center" }}>
						<Text style={styles.profileText}>{getAgeFromDateString(profile?.birth_date)}</Text>
					</View>
					<View style={{ flexBasis: 20, aspectRatio: 1 }}>
						<ImageTemplate
							source={require("@/assets/purple_arrow.svg")}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
				</View>
				<View style={styles.card}>
					<View style={{ flex: 5 }}>
						<Text style={styles.text}>Height</Text>
					</View>
					<View style={{ flex: 5, alignItems: "center" }}>
						<Text style={styles.profileText}>{profile?.height}</Text>
					</View>
					<View style={{ flexBasis: 20, aspectRatio: 1 }}>
						<ImageTemplate
							source={require("@/assets/purple_arrow.svg")}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
				</View>
				<View style={styles.card}>
					<View style={{ flex: 4 }}>
						<Text style={styles.text}>Weight</Text>
					</View>
					<View style={{ flex: 4, alignItems: "center" }}>
						<Text style={styles.profileText}>{profile?.weight}</Text>
					</View>
					<View style={{ flexBasis: 20, aspectRatio: 1 }}>
						<ImageTemplate
							source={require("@/assets/purple_arrow.svg")}
							style={{ width: "100%", height: "100%" }}
							contentFit="contain"
						/>
					</View>
				</View>

			</View>
		</ScreenWrapper>
	)
}

export default settings

const styles = StyleSheet.create({
	// card: {
	// 	width: '100%',
	// 	backgroundColor: '#FFFFFF',
	// 	borderRadius: radius._10,
	// 	padding: spacingX._15,
	// 	justifyContent: 'center',
	// 	alignItems: 'flex-start',
	// 	flexDirection: 'row'
	// },
	text: {
		fontWeight: "800",
		fontSize: 18
	},
	profileText: {
		color: "#9C9C9C",
		fontSize: 18
	},
	card: {
		width: '100%',
		backgroundColor: '#FFFFFF',
		borderRadius: radius._10,
		padding: spacingX._15,
		justifyContent: 'center',
		alignItems: 'flex-start',
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#F2F2F0',
	}
})
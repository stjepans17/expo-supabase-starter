import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { ImageTemplate } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import LiftLogicLogo from "@/assets/liftlogic.svg";
import { spacingX } from "@/constants/spacings";
import AnimatedHeading from "@/components/mine/AnimatedHeading";
import Typo from "@/components/mine/Typo";
import ScreenWrapper from "@/components/mine/ScreenWrapper";
import Button from "@/components/mine/Button";
import { SocialIcon } from 'react-native-elements';

export default function WelcomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const appIcon =
    colorScheme === "dark"
      ? require("@/assets/icon.png")
      : require("@/assets/icon-dark.png");

  const signInWithGoogle = async () => {
    console.log('click');
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View
          style={{
            height: "95%",
            width: "90%",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacingX._15,
          }}
        >
          <View style={styles.header}>
            <ImageTemplate
              source={require("@/assets/liftlogic.svg")}
              resizeMode="contain"
              style={styles.logoImage}
            />
          </View>

          <View style={styles.main}>
            <View style={styles.phoneImageContainer}>
              <Image
                source={require("@/assets/mockup_phone.png")}
                resizeMode="contain"
                style={styles.phoneImage}
              />
            </View>
            <View style={styles.textContainer}>
              <AnimatedHeading />
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.buttonPurple}
                  onPress={() => router.push("/sign-up")}
                >
                  <Typo
                    size={22}
                    color="white"
                    fontWeight="800"
                    style={{ letterSpacing: -0.72 }}
                  >
                    Sign Up
                  </Typo>
                </Button>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.buttonWhite}
                  onPress={() => router.push("/sign-in")}
                >
                  <Typo
                    size={22}
                    color="#4600DE"
                    fontWeight="300"
                    style={{ letterSpacing: -0.72 }}
                  >
                    Log In
                  </Typo>
                </Button>
              </View>
            </View>

            <View style={styles.footerRow}>
              {/* <View style={styles.continueTextContainer}>
                <Typo>or continue with</Typo>
              </View> */}
              <View style={styles.buttonContainer}>
                <SocialIcon
                  title="Sign in with Google"
                  button
                  type="google"
                  onPress={signInWithGoogle}
                  style={styles.socialButton}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  logoImage: {
    width: "50%",
    height: "50%",
  },
  phoneImage: {
    width: "100%",
    alignSelf: "center",
    marginRight: spacingX._10,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  main: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footer: {
    flex: 2,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  footerRow: {
    flex: 1,
    flexDirection: "row",
  },
  phoneImageContainer: {
    alignItems: "center",
    flex: 3,
    justifyContent: "center",
    width: "100%",
  },
  textContainer: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  buttonPurple: {
    backgroundColor: "#4600DE",
    width: "80%",
  },
  buttonWhite: {
    backgroundColor: "#F2F2F0",
    width: "80%",
  },
  // ---- new Google button styles ----
  buttonGoogle: {
    backgroundColor: "#FFFFFF",
    width: "80%",
    borderWidth: 1,
    borderColor: "#4600DE",
    borderRadius: 8,
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },
  continueTextContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  socialButton: { 
    flex: 1, 
    borderRadius: 8,
    height: '10%',
    width: '90%'
  }
});

// import React, { useEffect } from "react";
// import { View, StyleSheet, Image, Alert } from "react-native";
// import { useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import * as Linking from "expo-linking";
// import { makeRedirectUri } from "expo-auth-session";
// import { getQueryParams } from "expo-auth-session/build/QueryParams";

// import { ImageTemplate } from "@/components/image";
// import ScreenWrapper from "@/components/mine/ScreenWrapper";
// import AnimatedHeading from "@/components/mine/AnimatedHeading";
// import Typo from "@/components/mine/Typo";
// import Button from "@/components/mine/Button";
// import { spacingX } from "@/constants/spacings";
// import { useColorScheme } from "@/lib/useColorScheme";
// import { supabase } from "@/config/supabase";
// import { SocialIcon } from 'react-native-elements';

// WebBrowser.maybeCompleteAuthSession();

// export default function WelcomeScreen() {
//   const router = useRouter();
//   const { colorScheme } = useColorScheme();

//   // Build redirect URI using your app scheme defined in app.json
//   // const redirectUri = makeRedirectUri({ scheme: 'expo-supabase-starter' });
//   const redirectUri = makeRedirectUri({ useProxy: true });


//   // Handle deep link redirect back into the app
//   const url = Linking.useURL();
//   useEffect(() => {
//     if (url) {
//       const { params, errorCode } = getQueryParams(url);
//       if (errorCode) {
//         Alert.alert('Auth error', errorCode);
//         return;
//       }
//       const { access_token, refresh_token, error } = params;
//       if (error) {
//         Alert.alert('Auth error', error);
//         return;
//       }
//       if (access_token && refresh_token) {
//         supabase.auth
//           .setSession({ access_token, refresh_token })
//           .then(({ error }) => {
//             if (error) Alert.alert('Auth error', error.message);
//             else router.replace('/');
//           });
//       }
//     }
//   }, [url]);

//   // Kick off Supabase OAuth flow
//   const signInWithGoogle = async () => {
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'google',
//       options: { redirectTo: redirectUri, skipBrowserRedirect: true },
//     });
//     if (error) {
//       Alert.alert('Error', error.message);
//       return;
//     }
//     await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
//   };

//   return (
//     <ScreenWrapper>
//       <View style={styles.container}>
//         <View style={styles.innerContainer}>
//           <View style={styles.header}>
//             <ImageTemplate
//               source={require('@/assets/liftlogic.svg')}
//               resizeMode="contain"
//               style={styles.logoImage}
//             />
//           </View>
//           <View style={styles.main}>
//             <Image
//               source={require('@/assets/mockup_phone.png')}
//               resizeMode="contain"
//               style={styles.phoneImage}
//             />
//             <AnimatedHeading />
//           </View>
//           <View style={styles.footer}>
//             <View style={styles.footerRow}>
//               <Button style={styles.buttonPurple} onPress={() => router.push("/sign-up")}>               
//                 <Typo size={22} color="white" fontWeight="800" style={{ letterSpacing: -0.72 }}>
//                   Sign Up
//                 </Typo>
//               </Button>
//               <Button style={styles.buttonWhite} onPress={() => router.push("/sign-in")}>
//                 <Typo size={22} color="#4600DE" fontWeight="300" style={{ letterSpacing: -0.72 }}>
//                   Log In
//                 </Typo>
//               </Button>
//             </View>
//             <View style={styles.footerRow}>
//               <SocialIcon
//                 title="Sign in with Google"
//                 button
//                 type="google"
//                 onPress={signInWithGoogle}
//                 style={styles.socialButton}
//               />
//             </View>
//           </View>
//         </View>
//       </View>
//     </ScreenWrapper>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" },
//   innerContainer: { height: "95%", width: "90%", alignItems: "center", justifyContent: "center", marginBottom: spacingX._15 },
//   logoImage: { width: "50%", height: "50%" },
//   header: { flex: 1, justifyContent: "center", alignItems: "center", width: "100%" },
//   main: { flex: 6, justifyContent: "center", alignItems: "center", width: "100%" },
//   phoneImage: { width: "100%", marginRight: spacingX._10, flex: 3 },
//   footer: { flex: 2, width: "100%", justifyContent: "space-between" },
//   footerRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
//   buttonPurple: { flex: 1, backgroundColor: "#4600DE", marginRight: 10 },
//   buttonWhite: { flex: 1, backgroundColor: "#F2F2F0", marginLeft: 10 },
//   continueText: { flex: 2, textAlign: "center" },
//   buttonGoogle: { flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#4600DE" },
//   socialButton: { flex: 1, height: 48, borderRadius: 8 }
// });



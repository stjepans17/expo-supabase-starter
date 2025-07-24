import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ImageTemplate } from "@/components/image";
import { SafeAreaView } from "@/components/safe-area-view";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useColorScheme } from "@/lib/useColorScheme";
import { spacingX } from "@/constants/spacings";
import AnimatedHeading from "@/components/mine/AnimatedHeading";
import Typo from "@/components/mine/Typo";
import ScreenWrapper from "@/components/mine/ScreenWrapper";
import Button from "@/components/mine/Button";
import { SocialIcon } from 'react-native-elements';
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { getDefaultReturnUrl, makeRedirectUri } from "expo-auth-session";
import { getQueryParams } from "expo-auth-session/build/QueryParams";
import { supabase } from "@/config/supabase";
import LiftLogicLogo from "@/assets/liftlogic.svg";

WebBrowser.maybeCompleteAuthSession();

export default function WelcomeScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const appIcon =
    colorScheme === "dark"
      ? require("@/assets/icon.png")
      : require("@/assets/icon-dark.png");

  // Build redirect URI using your app scheme defined in app.json
  // const redirectUri = makeRedirectUri({ scheme: 'expo-supabase-starter' });
  const redirectUri = getDefaultReturnUrl();

  useEffect(() => {
    // handle initial URL
    Linking.getInitialURL().then(url => {
      if (url) setCallbackUrl(url);
    });
    // subscription for future URLs
    const subscription = Linking.addEventListener('url', ({ url }) => {
      setCallbackUrl(url);
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // Process OAuth callback
  useEffect(() => {
    if (!callbackUrl) return;
    const { params, errorCode } = getQueryParams(callbackUrl);
    if (errorCode) {
      Alert.alert('Auth error', errorCode);
      return;
    }
    const { access_token, refresh_token, error } = params;
    if (error) {
      Alert.alert('Auth error', error);
      return;
    }
    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) Alert.alert('Auth error', error.message);
          else router.replace('/');
        });
    }
  }, [callbackUrl]);

  // Kick off Supabase OAuth flow
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUri, skipBrowserRedirect: true },
    });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
  };

  // Handle deep link redirect back into the app
  // const url = Linking.useURL();
  // useEffect(() => {
  //   if (url) {
  //     const { params, errorCode } = getQueryParams(url);
  //     if (errorCode) {
  //       Alert.alert('Auth error', errorCode);
  //       return;
  //     }
  //     const { access_token, refresh_token, error } = params;
  //     if (error) {
  //       Alert.alert('Auth error', error);
  //       return;
  //     }
  //     if (access_token && refresh_token) {
  //       supabase.auth
  //         .setSession({ access_token, refresh_token })
  //         .then(({ error }) => {
  //           if (error) Alert.alert('Auth error', error.message);
  //           else router.replace('/');
  //         });
  //     }
  //   }
  // }, [url]);

  // // Kick off Supabase OAuth flow
  // const signInWithGoogle = async () => {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: { redirectTo: redirectUri, skipBrowserRedirect: true },
  //   });
  //   if (error) {
  //     Alert.alert('Error', error.message);
  //     return;
  //   }
  //   await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
  // };

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
            <LiftLogicLogo style={styles.logoImage}/>
            
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
    width: "70%",
    height: "70%",
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
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 16 },
  },
  buttonWhite: {
    backgroundColor: "#F2F2F0",
    width: "80%",
    borderRadius: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 16 },
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
    width: '90%',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.9,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 1, height: 16 },
  }
});

// import {
//   GoogleSignin,
//   GoogleSigninButton,
//   statusCodes,
// } from '@react-native-google-signin/google-signin'
// import { supabase } from '@/config/supabase'
// export default function () {
//   GoogleSignin.configure({
//     scopes: ['https://www.googleapis.com/auth/drive.readonly'],
//     webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',
//   })
//   return (
//     <GoogleSigninButton
//       size={GoogleSigninButton.Size.Wide}
//       color={GoogleSigninButton.Color.Dark}
//       onPress={async () => {
//         try {
//           await GoogleSignin.hasPlayServices()
//           const userInfo = await GoogleSignin.signIn()
//           if (userInfo.data && userInfo.data.idToken) {
//             const { data, error } = await supabase.auth.signInWithIdToken({
//               provider: 'google',
//               token: userInfo.data.idToken,
//             })
//             console.log(error, data)
//           } else {
//             throw new Error('no ID token present!')
//           }
//         } catch (error: any) {
//           if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//             // user cancelled the login flow
//           } else if (error.code === statusCodes.IN_PROGRESS) {
//             // operation (e.g. sign in) is in progress already
//           } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//             // play services not available or outdated
//           } else {
//             // some other error happened
//           }
//         }
//       }}
//     />
//   )
// }
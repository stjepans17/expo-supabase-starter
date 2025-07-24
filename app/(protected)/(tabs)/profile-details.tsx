import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { radius, spacingX, spacingY } from '@/constants/spacings';
import ScreenWrapper from '@/components/mine/ScreenWrapper';
import Typo from '@/components/mine/Typo';
import { useAuth } from '@/context/supabase-provider';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const { profile, signOut } = useAuth();

  const handleNavigateToSettings = () => {
    router.push("/(protected)/(tabs)/settings");
  };

  const handleSignOut = () => {
    signOut();
  };

  return (
    <ScreenWrapper style={styles.screenContainer}>
      <View style={styles.contentWrapper}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Typo fontFamily="Inter-Bold" size={28}>
            Profile
          </Typo>
        </View>

        {/* Cards Container */}
        <View style={styles.cardsContainer}>
          
          {/* User Profile Card */}
          <View style={[styles.card, styles.profileCard]}>
            <View style={styles.avatarContainer}>
              {/* <Image
                source={require('../../assets/images/userface-example.png')}
                style={styles.avatarImage}
              /> */}
            </View>

            <View style={styles.profileInfo}>
              <Typo
                fontFamily="Inter-Bold"
                size={22}
                fontWeight={800}
                style={styles.userName}
              >
                {profile?.full_name}
              </Typo>
              <Typo 
                color="#4600DE" 
                size={14} 
                fontFamily="Inter-Bold" 
                style={styles.profileSubtext}
              >
                Profile information
              </Typo>
            </View>
          </View>

          {/* Settings Card */}
          <TouchableOpacity 
            style={[styles.card, styles.actionCard]} 
            onPress={handleNavigateToSettings}
          >
            <Typo fontFamily="Inter-Bold">Settings</Typo>
          </TouchableOpacity>

          {/* Logout Card */}
          <TouchableOpacity 
            style={[styles.card, styles.actionCard]} 
            onPress={handleSignOut}
          >
            <Typo fontFamily="Inter-Bold">Logout</Typo>
          </TouchableOpacity>

        </View>
      </View>
    </ScreenWrapper>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: '#F2F2F0',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  contentWrapper: {
    width: '90%',
    alignSelf: 'center',
  },
  headerContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: spacingX._20,
  },
  cardsContainer: {
    width: '100%',
    height: '60%',
    flexDirection: 'column',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: radius._10,
    padding: spacingX._15,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  profileCard: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCard: {
    flex: 1,
    marginTop: spacingY._10,
  },
  avatarContainer: {
    width: '25%',
    aspectRatio: 1,
    borderRadius: 999,
    overflow: 'hidden',
    marginRight: spacingX._20,
  },
  avatarImage: {
    flex: 1,
    width: undefined,
    height: undefined,
    resizeMode: 'cover',
  },
  profileInfo: {
    flex: 2,
  },
  userName: {
    marginBottom: spacingY._5,
  },
  profileSubtext: {
    letterSpacing: -0.5,
  },
});
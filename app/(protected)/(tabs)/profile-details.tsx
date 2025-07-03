import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { radius, spacingX, spacingY } from '@/constants/spacings'
import ScreenWrapper from '@/components/mine/ScreenWrapper'
import Typo from '@/components/mine/Typo'
import { useAuth } from '@/context/supabase-provider'
import { useRouter } from 'expo-router'

const Profile = () => {
  const router = useRouter();
  const {profile, signOut} = useAuth();
  
  return (
    <ScreenWrapper style={{ backgroundColor: '#F2F2F0', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View style={{ width: '90%', alignSelf: 'center' }}>
        <View style={styles.header}>
          <Typo fontFamily='Inter-Bold' size={28}>Profile</Typo>
        </View>

        <View style={[styles.stackContainer, { height: '60%' }]}>
          <View style={[styles.card, { flex: 2, flexDirection: 'row', alignItems: 'center' }]}>
            <View
              style={{
                width: '25%',         
                aspectRatio: 1,       
                borderRadius: 999,    // huge number → always a circle
                overflow: 'hidden',   
                marginRight: spacingX._20,
              }}
            >
              {/* <Image
                source={require('../../assets/images/userface-example.png')}
                style={{
                  flex: 1,           
                  width: undefined,   
                  height: undefined,
                  resizeMode: 'cover' 
                }}
              /> */}
            </View>

            <View style={{ flex: 2 }}>
              <Typo
                fontFamily="Inter-Bold"
                size={22}
                fontWeight={800}
                style={{ marginBottom: spacingY._5 }}
              >
                {profile?.full_name}
              </Typo>
              <Typo color="#4600DE" size={14} fontFamily = 'Inter-Bold' style={{letterSpacing: -0.5}}>Profile information</Typo>
            </View>

            {/* <Arrow/> */}
          </View>

          <TouchableOpacity style={[styles.card, { flex: 1, marginTop: spacingY._10 }]} onPress={() => router.push("/(protected)/(tabs)/settings")}>
            <Typo fontFamily="Inter-Bold">Settings</Typo>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.card, { flex: 1, marginTop: spacingY._10 }]} onPress={() => signOut()}>
            <Typo fontFamily="Inter-Bold">Logout</Typo>
          </TouchableOpacity>

        </View>
      </View>
    </ScreenWrapper>
  )
}

export default Profile

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: spacingX._20
  },
  stackContainer: {
    width: '100%',
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
})
import { router, Tabs } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { Alert, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import LiftLogicLogo from '@/assets/liftlogic.svg';
import { spacingX } from '@/constants/spacings';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;
const iconSize = Math.max(26, screenWidth * 0.07);

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4600DE',
        tabBarInactiveTintColor: '#999',
        headerTitleAlign: 'center',
        headerStyle: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 10.3,
          elevation: 5, // Android shadow
        },
        headerTitle: () => <LiftLogicLogo width={80} height={30} style={{ marginTop: spacingX._3 }} />,

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/profile-details')}
            style={{ marginLeft: spacingX._15 }}
          >
            <Icons.UserCircle size={iconSize} color="#4600DE" />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={() => Alert.alert("Error", "Not yet implemented")}
            style={{ marginRight: spacingX._15 }}
          >
            <Icons.Bell size={iconSize} color="#4600DE" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icons.HouseSimple weight="fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ color, size }) => (
            <Icons.Barbell weight="fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Exercises',
          tabBarIcon: ({ color, size }) => (
            <Icons.Person weight="fill" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color, size }) => (
            <Icons.ChartBar weight="fill" size={size} color={color} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      /> */}
      <Tabs.Screen
        name="profile-details"
        options={{
          href: null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push('/')} style={{marginLeft: spacingX._15}}>
              <Ionicons name="arrow-back-outline" size={iconSize} color="#4600DE" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="exercises2"
        options={{
          href: null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/exercises")} style={{marginLeft: spacingX._15}}>
              <Ionicons name="arrow-back-outline" size={iconSize} color="#4600DE" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        }}
      />
      <Tabs.Screen
        name="exercises3"
        options={{
          href: null,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.push("/exercises")} style={{marginLeft: spacingX._15}}>
              <Ionicons name="arrow-back-outline" size={iconSize} color="#4600DE" />
            </TouchableOpacity>
          ),
          headerRight: () => null,
        }}
      />
      <Tabs.Screen
        name="active-workout"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="search-by-name"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="create-routine"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="workout-complete"
        options={{
          href: null,
          headerLeft: () => null,
          headerRight: () => null,
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})
import { router, Tabs } from 'expo-router';
import * as Icons from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
// import LiftLogicLogo from '../../assets/images/liftlogic.svg';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4600DE',
        tabBarInactiveTintColor: '#999',

        headerTitleAlign: 'center',
        // headerTitle: () => <LiftLogicLogo width={90} height={30} />,

        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.push('/(protected)/(tabs)/profile-details')}
            style={{ marginLeft: 16 }}
          >
            <Icons.UserCircle size={28} color="#4600DE" />
          </TouchableOpacity>
        ),

        headerRight: () => (
          <TouchableOpacity
            onPress={() => console.log('click')}
            style={{ marginRight: 16 }}
          >
            <Icons.Bell size={28} color="#4600DE" />
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
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile-details"
        options={{
          href: null,
        }}
      />
			<Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="musclegroups"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="muscles"
        options={{
          href: null,
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({})
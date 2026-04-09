import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const TabRoot = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0c92cb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: 65,
          paddingBottom: 10,
          marginBottom: 25,
          paddingTop: 8,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
      }}
    >
      <Tabs.Screen
        name='Home'
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
      />
      <Tabs.Screen
        name='Report'
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="report-gmailerrorred" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
      />
      <Tabs.Screen
        name='Community'
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="groups" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
      />
      <Tabs.Screen
        name='Settings'
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="settings" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
      />
    </Tabs>
  )
}

export default TabRoot
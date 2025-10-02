// import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';


const TabRoot = () => {
  return (
    <Tabs
screenOptions={{headerShown:false}}>
        <Tabs.Screen 
        name='Home'
        options={{
          tabBarIcon: ({color,size}) => (
            <MaterialIcons name="home" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
        />
        <Tabs.Screen 
        name='Report'
        options={{
          tabBarIcon: ({color,size}) => (
              <MaterialIcons name="report-gmailerrorred" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
        />
        <Tabs.Screen 
        name='Community'
        options={{
          tabBarIcon: ({color,size}) => (
              <MaterialIcons name="groups" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
        />
        <Tabs.Screen 
        name='Settings'
        options={{
          tabBarIcon: ({color,size}) => (
              <MaterialIcons name="settings" size={24} color={color} />
          ),
          // headerPressColor:"red"
        }}
        />
    </Tabs>
  )
}

export default TabRoot
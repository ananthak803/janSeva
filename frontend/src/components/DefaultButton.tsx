//@ts-nocheck
import { Text,TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const DefaultButton = ({name,w=150,h=50,onPress}:any) => {
    const router=useRouter();
  return (
    <TouchableOpacity style={{
            backgroundColor:'#1E90FF',
            width:`${w}`,
            height:`${h}`,
            padding:5,
            borderRadius:5,
            justifyContent:"center",
            alignItems:"center",
            margin:5,
      }}
      onPress={onPress}
      >
            <Text>{name}</Text>
      </TouchableOpacity>
  )
}

export default DefaultButton
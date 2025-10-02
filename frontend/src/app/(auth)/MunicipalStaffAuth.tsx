import {Text, View  } from 'react-native'
import React, { useState } from 'react'
import CustomSafeArea from '@/src/components/CustomSafeArea'
import CustomMain from '@/src/components/CustomMain'
import CustomInput from '@/src/components/CustomInput'
import DefaultButton from '@/src/components/DefaultButton'

const MunicipalStaffAuth = () => {
  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginHandle=()=>{
      console.log("staff login");
    }
  return (
    <CustomSafeArea>
      <CustomMain center="center">
        <View>
            <Text>Staff Login</Text>
            <CustomInput placeholder="Enter Email id" value={email} onChangeText={setEmail}/>
            <CustomInput placeholder="Enter password" value={password} onChangeText={setPassword} />
            <DefaultButton name="Login" onPress={loginHandle} />
          </View>
      </CustomMain>
    </CustomSafeArea>
  )
}

export default MunicipalStaffAuth
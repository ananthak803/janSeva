import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import CustomSafeArea from '@/src/components/CustomSafeArea'
import DefaultButton from '@/src/components/DefaultButton'
import { useRouter } from 'expo-router'

const AuthHome = () => {
  const router=useRouter();
  return (
    <CustomSafeArea>
      <View style={styles.main}>
        <Text>AuthHome</Text>
        <DefaultButton name={'Resident'} onPress={()=>router.push('/ResidentAuth')} />
        <DefaultButton name={'Municipal Staff'} onPress={()=>router.push('/MunicipalStaffAuth')}/>
      </View>
      
    </CustomSafeArea>
  )
}

const styles=StyleSheet.create({
    main:{
        flex:1,
        // backgroundColor:'#1E90FF',
        padding:10,
        alignItems:"center",
    }
})

export default AuthHome
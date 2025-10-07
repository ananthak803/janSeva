import { View, Text ,StyleSheet, TouchableOpacity} from 'react-native'
import React from 'react'
import CustomSafeArea from '@/src/components/CustomSafeArea'
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';


const Settings = () => {
  const router=useRouter();
  const deleteToken=()=>{
    SecureStore.deleteItemAsync('acess_token');
    router.replace('/(auth)');
  }
  return (
    <CustomSafeArea>
      <View style={styles.main}>
        <Text style={styles.settingHead}>Settings</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={deleteToken}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </CustomSafeArea>
  )
}

const styles=StyleSheet.create({
  main:{
    flex:1,
    alignItems:"center",
  },
  settingHead:{
    fontSize:20,
    fontWeight:700,
    marginBottom:30,
  },
  logoutBtn:{
    backgroundColor:'#1e5a73ff',
    paddingVertical:10,
    paddingHorizontal:20,
  }
})

export default Settings
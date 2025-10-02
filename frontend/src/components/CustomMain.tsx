import { View} from 'react-native'
import React from 'react'

const CustomMain = ({p=5,center=false,children}:any) => {
  return (
    <View
    style={{
        flex:1,
        width:"100%",
        padding:p,
        justifyContent:center? "center":"flex-start",
        alignItems:center? "center":"flex-start",
    }}
    >
      {children}
    </View>
  )
}

export default CustomMain
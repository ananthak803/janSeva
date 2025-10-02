//@ts-nocheck
import { TextInput } from 'react-native'

const CustomInput = ({placeholder='Enter text',m=5,secure=false,value,onChangeText}):any => {
  return (
    <TextInput
        style={{
            height:50,
            borderRadius:5,
            borderWidth:1,
            borderBlockColor:"black",
            paddingLeft:10,
            alignItems:"center",
            margin:m,
        }}
        placeholder={placeholder}
        secureTextEntry={secure}
        value={value}
        onChangeText={onChangeText}
    ></TextInput>
  )
}

export default CustomInput
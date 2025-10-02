import { SafeAreaView } from 'react-native-safe-area-context'

const CustomSafeArea = ({children,edge=['left','right','top','bottom']}:any) => {
  return (
    <SafeAreaView style={{flex:1} } edges={edge}>
        {children}
    </SafeAreaView>
  )
}

export default CustomSafeArea
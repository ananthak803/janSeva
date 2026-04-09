import { SafeAreaView } from 'react-native-safe-area-context'

const CustomSafeArea = ({children, edges=['left','right','top','bottom']}: any) => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={edges}>
        {children}
    </SafeAreaView>
  )
}

export default CustomSafeArea
import { View, Text,StyleSheet, Button, TouchableOpacity,Image} from 'react-native'
import React, { useRef, useState } from 'react'
import { CameraView,CameraType,FlashMode, useCameraPermissions } from 'expo-camera'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import { useDispatch} from 'react-redux';
import { setImageUri } from '../../redux/store'; 

const Capture = () => {
    const [camPermission,setCamPermission]=useCameraPermissions();
    const[image,setImage]=useState('');
    const[type,setType]=useState<CameraType>('back');
    const [flash,setFlash]=useState<FlashMode>('auto');
    // const [mode,setMode]=useState<CameraMode>('picture');
    const camRef=useRef<CameraView>(null);
    const router=useRouter();
    const dispatch = useDispatch();
    if(!camPermission)
            return <View/>
    if(!camPermission.granted){
        return(
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={setCamPermission} title="grant permission" />
            </View>
        )
    }

  const toggleFlash=()=>{
    flash==='auto'?setFlash('on'):setFlash('auto');
  }
  const changeCam =()=>{
    type==='back'?setType('front'):setType('back');
  }

  const saveImage=(uri:any)=>{
    dispatch(setImageUri(uri));
    router.back()
  }
    async function takePicture() {
    if (camRef.current) {
      const photo = await camRef.current.takePictureAsync(
        {
        quality: 1,
        skipProcessing: true,
      }
      );
      setImage(photo.uri);
      console.log(photo);
      console.log(image);
    }
  }
  return (
  <View style={styles.container}>
    {!image ? (
      <View style={{ flex: 1 }}>
        <CameraView style={styles.camera} facing={type} ref={camRef} />

        <View style={styles.upperSection}>
          <TouchableOpacity style={styles.backBtn} onPress={()=>router.back()}>
            <Text style={{color:"white"}}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFlash}>
              <MaterialCommunityIcons name="flash" size={32} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.lowerSection}>
          <TouchableOpacity style={styles.button} onPress={changeCam}>
            <Text style={styles.text}>
              <MaterialCommunityIcons name="camera-flip" size={40} color="black" />
            </Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Text style={styles.text}>
              {/* <MaterialCommunityIcons name="camera" size={40} color="black" /> */}
              <Entypo name="circle" size={40} color="black" />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} >
            <Text style={styles.text}>
              <MaterialCommunityIcons name="video" size={40} color="black" />
            </Text>
          </TouchableOpacity>
          
        </View>
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <Image 
          source={{ uri: image }} 
          style={{ flex: 1, width: '100%' ,zIndex:-1}} 
          resizeMode="cover"
        />
         <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-around', 
          padding:20,
          zIndex:2,
          marginBottom:30,
        }}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#232222ff' }]} 
            onPress={() => setImage('')}
          >
            <MaterialCommunityIcons name="camera-retake" size={24} color="white" />
            <Text style={{paddingLeft:5,color:'white'}}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: '#232222ff' }]} 
            onPress={()=>saveImage(image)}
          >
            <MaterialCommunityIcons name="content-save" size={24} color="white" />
            <Text style={{paddingLeft:5,color:'white'}}>save</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  lowerSection: {
    position: 'absolute',
    bottom: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent:'space-between'
  },
  upperSection: {
    position: 'absolute',
    top: 64,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '100%',
    paddingHorizontal: 20,
    justifyContent:'space-between',
  },
  button: {
    flexDirection:'row',
    paddingVertical:10,
    paddingHorizontal:20,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  backBtn:{
    backgroundColor:"#0b0a0aff",
    paddingHorizontal:20,
    paddingVertical:10,
  }
});

export default Capture
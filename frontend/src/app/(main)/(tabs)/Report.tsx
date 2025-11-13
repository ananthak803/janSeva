import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setImageUri ,addUserIssue,addLocalIssue} from "@/src/redux/store";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Location from "expo-location";
import * as SecureStore from "expo-secure-store";
import LoadingScreen from "@/src/components/LoadingScreen";

const { width, height } = Dimensions.get("window");

const Report = () => {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading,setLoading]=useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  //@ts-ignore
  let imageUri = useSelector((state) => state.cache_img.imageUri);

   
  

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const date = new Date();
    return date.toTimeString().slice(0, 5);
  };

  const getCurrentLocation = async () => {
    let currentLocation = await Location.getCurrentPositionAsync({});
    return {
      longitude: currentLocation.coords.longitude,
      latitude: currentLocation.coords.latitude,
    };
  };

  const handleSubmit = async () => {
    setLoading(true);
    const cloudUri = await uploadImageToCloudinary(imageUri);
    const currentLocation = await getCurrentLocation();
    const issueData = {
      title,
      description,
      category,
      location: currentLocation,
      date: getCurrentDate(),
      time: getCurrentTime(),
      imageUrl: cloudUri,
    };
    const token = await SecureStore.getItemAsync("access_token");

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/api/issue/newIssue`,
      issueData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(addUserIssue(response.data));
    dispatch(addLocalIssue(response.data));
    clearForm();
    alert("Issue submitted Successfully");
    setLoading(false);
  };

  const uploadImageToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();
      //@ts-ignore
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "upload.jpg",
      });
      formData.append("upload_preset", "janSeva");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const clearForm = () => {
    setCategory("");
    setTitle("");
    setDescription("");
    imageUri = "";
    dispatch(setImageUri(""));
  };

  if(loading){
    return <LoadingScreen/>
  }

  return (
    <CustomSafeArea edge={["left", "right", "top"]}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <Text style={styles.heading}>Report an Issue</Text>

          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Enter issue title"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Describe the issue in detail"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(itemValue) => setCategory(itemValue)}
                style={styles.picker}
                mode="dropdown"
              >
                <Picker.Item label="Select category" value="" />
                <Picker.Item label="Roads" value="roads" />
                <Picker.Item label="Water" value="water" />
                <Picker.Item label="Power" value="power" />
                <Picker.Item label="Sanitation" value="sanitation" />
                <Picker.Item label="Others" value="others" />
              </Picker>
            </View>

            {imageUri ? (
              <View style={styles.uploads}>
                <Text style={styles.subheading}>Attachments</Text>
                <View style={styles.imageRow}>
                  <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => dispatch(setImageUri(null))}>
                    <MaterialIcons name="delete" size={30} color="#eb1f1f" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => router.push("/Capture")}
              >
                <Text style={styles.optionText}>Capture Image</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.btnContainer}>
        <TouchableOpacity style={[styles.Btn, styles.clearBtn]} onPress={clearForm}>
          <Text style={[styles.btnText, { color: "#333" }]}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.Btn, styles.submitBtn]} onPress={handleSubmit}>
          <Text style={[styles.btnText, { color: "#fff" }]}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Image Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <Image source={{ uri: imageUri }} style={styles.fullScreenImage} resizeMode="contain" />
          <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </Pressable>
        </View>
      </Modal>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  main: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
  },
  heading: {
    fontSize: width * 0.065,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
    color: "#1c1c1e",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: width * 0.05,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  textarea: {
    height: height * 0.15,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  uploads: {
    marginTop: 10,
  },
  subheading: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  imageRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  imagePreview: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
  },
  optionBtn: {
    backgroundColor: "#007AFF10",
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  optionText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  btnContainer: {
    width: "100%",
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  Btn: {
    width: "45%",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  clearBtn: {
    backgroundColor: "#f2f2f7",
  },
  submitBtn: {
    backgroundColor: "#007AFF",
  },
  btnText: {
    fontSize: 17,
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Report;

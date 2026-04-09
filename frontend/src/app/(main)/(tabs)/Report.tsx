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

  const uploadImageToCloudinary = async (imageUri:any) => {
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

  const categories = [
    { label: "PWD", value: "pwd", icon: "engineering" },
    { label: "Water", value: "water", icon: "water-drop" },
    { label: "Power", value: "power", icon: "bolt" },
    { label: "Sanitation", value: "sanitation", icon: "cleaning-services" },
    { label: "Others", value: "others", icon: "more-horiz" },
  ];

  return (
    <CustomSafeArea>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.main}>
          <View style={styles.header}>
            <Text style={styles.heading}>Report an Issue</Text>
            <Text style={styles.subHeading}>Provide details about the problem</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Issue Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Broken streetlight, Pothole"
                placeholderTextColor="#999"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.categoryList}
              >
                {categories.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.categoryBtn,
                      category === item.value && styles.categoryBtnActive
                    ]}
                    onPress={() => setCategory(item.value)}
                  >
                    <MaterialIcons 
                      name={item.icon as any} 
                      size={20} 
                      color={category === item.value ? "#fff" : "#666"} 
                    />
                    <Text style={[
                      styles.categoryBtnText,
                      category === item.value && styles.categoryBtnTextActive
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="Describe the issue in detail..."
                placeholderTextColor="#999"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Photo Attachment</Text>
              {imageUri ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                  <View style={styles.imageActions}>
                    <TouchableOpacity 
                      style={styles.imageActionBtn} 
                      onPress={() => setModalVisible(true)}
                    >
                      <MaterialIcons name="fullscreen" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.imageActionBtn, { backgroundColor: '#ff4444' }]} 
                      onPress={() => dispatch(setImageUri(null))}
                    >
                      <MaterialIcons name="delete" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.captureBtn}
                  onPress={() => router.push("/Capture")}
                >
                  <View style={styles.captureIconContainer}>
                    <MaterialIcons name="camera-alt" size={32} color="#0c92cb" />
                  </View>
                  <Text style={styles.captureText}>Capture or Upload Photo</Text>
                  <Text style={styles.captureSubText}>Maximum file size 5MB</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.clearBtn} onPress={clearForm}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.submitBtn, 
            (!title || !category || !imageUri) && styles.submitBtnDisabled
          ]} 
          onPress={handleSubmit}
          disabled={!title || !category || !imageUri}
        >
          <Text style={styles.submitBtnText}>Submit Report</Text>
          <MaterialIcons name="send" size={18} color="#fff" style={{ marginLeft: 8 }} />
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
    backgroundColor: "#fff",
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 25,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a1a",
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 15,
    color: "#666",
    marginTop: 5,
    fontWeight: "500",
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#eee",
  },
  textarea: {
    height: 120,
    paddingTop: 15,
  },
  categoryList: {
    paddingVertical: 5,
    gap: 10,
  },
  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  categoryBtnActive: {
    backgroundColor: "#0c92cb",
    borderColor: "#0c92cb",
  },
  categoryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  categoryBtnTextActive: {
    color: "#fff",
  },
  captureBtn: {
    backgroundColor: "#f0f9ff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e1f5fe",
    borderStyle: "dashed",
  },
  captureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#0c92cb",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  captureText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0c92cb",
  },
  captureSubText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageActions: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 8,
  },
  imageActionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    gap: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  clearBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#666",
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0c92cb",
    elevation: 4,
    shadowColor: "#0c92cb",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  submitBtnDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default Report;

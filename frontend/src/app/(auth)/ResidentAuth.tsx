import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CustomSafeArea from "@/src/components/CustomSafeArea";
import CustomInput from "@/src/components/CustomInput";
import CustomMain from "@/src/components/CustomMain";
import DefaultButton from "@/src/components/DefaultButton";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useRouter } from "expo-router";

const ResidentAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("login");
  const[phone,setPhone]=useState("");
  const router=useRouter();

  const validateEmail = (email:string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const loginHandle = async () => {
    if (!email || !password) alert("Please enter your email and password");
    
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_API}/api/resident/login`,
        {
          email,
          password,
        }
      );
      if (!res.data.token) {
        alert("Login Failed. Please try again");
        return;
      }
      const { token } = res.data;
      await SecureStore.setItemAsync('access_token',token);
      //@ts-ignore
      router.replace('/Home');
    }
    catch(err){
      console.log(err);
    }
    console.log("Logging in");
  };

  const signupHandle = async () => {
    console.log("signing in");
  if (!email || !phone || !password) {
    alert("Please enter your email, phone number and password");
    return;
  }
  if (!validateEmail(email)) {
    alert("Please enter a valid email");
    return;
  }
  if (password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }

  try {
    console.log("inside trte");
    const res = await axios.post(
      `${process.env.EXPO_PUBLIC_BACKEND_API}/api/resident/signup`,
      { email, phone, password }
    );
    
    if (!res.data.token) {
      alert("Signup failed. Please try again");
      return;
    }
    console.log("storetoken");
    const { token } = res.data;
    await SecureStore.setItemAsync("access_token", token);


    // router.navigate("/MunicipalStaffAuth");
    // Option B: force them to login again
    setActiveTab("login");
    alert("Signup successful! Please login.");
  } catch (err) {
    console.log(err);
    alert("Something went wrong. Try again later.");
  }
};


  return (
    <CustomSafeArea>
      <CustomMain center="center">
        <View style={styles.switch}>
          <TouchableOpacity
            style={[
              styles.switchBtn,
              activeTab === "login" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("login")}
          >
            <Text
              style={
                activeTab === "login" ? styles.activeText : styles.inactiveText
              }
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.switchBtn,
              activeTab === "signup" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("signup")}
          >
            <Text
              style={
                activeTab === "signup" ? styles.activeText : styles.inactiveText
              }
            >
              Signup
            </Text>
          </TouchableOpacity>
        </View>
        {activeTab === "login" ? (
          <View>
            <Text>Resident Login</Text>
            <CustomInput placeholder="Enter Email id" value={email} onChangeText={setEmail}/>
            <CustomInput placeholder="Enter password" value={password} onChangeText={setPassword} />
            <DefaultButton name="Login" onPress={loginHandle} />
          </View>
        ) : (
          <View>
            <Text>Resident Signup</Text>
            <CustomInput placeholder="Enter Email id" value={email} onChangeText={setEmail}/>
            <CustomInput placeholder="Enter Phone number" value={phone} onChangeText={setPhone} />
            <CustomInput placeholder="Enter password" value={password} onChangeText={setPassword} />
            <DefaultButton
              name="Signup"
              onPress={signupHandle}
            />
          </View>
        )}
      </CustomMain>
    </CustomSafeArea>
  );
};

const styles = StyleSheet.create({
  switch: {
    height: 40,
    width: "60%",
    borderWidth: 1,
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  switchBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#1E90FF",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#333",
  },
});

export default ResidentAuth;

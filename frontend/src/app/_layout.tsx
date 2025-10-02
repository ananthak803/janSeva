import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";

const RootLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  if (isLoading) {
    // Show splash/loading while checking token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(main)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
};

export default RootLayout;

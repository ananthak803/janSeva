import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator, View, AppState } from "react-native";
import { Provider } from "react-redux";
import store from "../redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  const [isReady, setIsReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkToken = async () => {
    try {
      const token = await SecureStore.getItemAsync("access_token");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Auth check error:", error);
      setIsLoggedIn(false);
    } finally {
      setIsReady(true);
    }
  };
  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        checkToken();
      }
    });

    return () => sub.remove();
  }, []);
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="(main)" />
          ) : (
            <Stack.Screen name="(auth)" />
          )}
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
};

export default RootLayout;


import { useFonts } from "expo-font";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { colors } from "@/styles/commonStyles";
import { BACKEND_URL, healthCheck, isBackendConfigured } from "@/utils/api";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

// Log backend URL at startup for debugging
console.log('[App] Backend URL configured:', BACKEND_URL);
console.log('[App] Backend configured:', isBackendConfigured());

// Perform health check on startup
if (isBackendConfigured()) {
  healthCheck().then((healthy) => {
    if (!healthy) {
      console.warn('[App] Backend health check failed - API may be unavailable');
    }
  });
}

// Custom dark theme for the app
const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider value={CustomDarkTheme}>
          <SystemBars style="light" />
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="auth/sign-in" />
            <Stack.Screen name="auth/sign-up" />
            <Stack.Screen name="auth/profile-setup" />
            <Stack.Screen name="auth-popup" />
            <Stack.Screen name="auth-callback" />
            <Stack.Screen name="chat/[id]" />
          </Stack>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

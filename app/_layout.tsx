import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { AppProviders } from "@/src/providers/app-providers";
import { OfflineBanner } from "@/src/ui/offline-banner";

export default function RootLayout() {
  return (
    <AppProviders>
      <StatusBar style="dark" />
      <View className="flex-1 bg-canvas">
        <OfflineBanner />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </AppProviders>
  );
}

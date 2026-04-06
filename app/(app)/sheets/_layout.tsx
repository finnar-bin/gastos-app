import { Stack } from "expo-router";
import { View } from "react-native";

import { Navbar } from "@/src/ui/Navbar";

export default function SheetsLayout() {
  return (
    <View className="flex-1 bg-canvas">
      <Stack screenOptions={{ headerShown: false }} />
      <Navbar />
    </View>
  );
}

import { Stack } from "expo-router";
import { View } from "react-native";

import {
  FloatingSheetsNav,
} from "@/src/ui/FloatingSheetsNav";

export default function SheetsLayout() {
  return (
    <View className="flex-1 bg-canvas">
      <Stack screenOptions={{ headerShown: false }} />
      <FloatingSheetsNav />
    </View>
  );
}

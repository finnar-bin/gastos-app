import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SheetPagePlaceholder } from "@/src/ui/SheetPagePlaceholder";
import { toSheetId } from "@/src/utils/to-sheet-id";

export default function SheetSettingsPage() {
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId) ?? null;

  return (
    <>
      <Stack.Screen options={{ title: "Settings" }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-canvas">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ padding: 24, gap: 16 }}
          className="flex-1"
        >
          <SheetPagePlaceholder
            pageTitle="Settings"
            pageDescription="Settings page placeholder. Settings and preferences here will be specific to the selected sheet."
            sheetId={sheetId}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SheetPagePlaceholder } from "@/src/ui/SheetPagePlaceholder";
import { toSheetId } from "@/src/utils/to-sheet-id";

export default function SheetDashboardPage() {
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId) ?? null;

  return (
    <>
      <Stack.Screen options={{ title: "Dashboard" }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-canvas">
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ padding: 24, gap: 16 }}
          className="flex-1"
        >
          <SheetPagePlaceholder
            pageTitle="Dashboard"
            pageDescription="Dashboard page placeholder. Data loading for this view will be scoped to the selected sheet."
            sheetId={sheetId}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

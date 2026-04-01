import { Stack, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { signOut } from "@/src/lib/auth-requests";
import { useSession } from "@/src/providers/SessionProvider";
import { useUserSheetsQuery } from "@/src/queries/use-user-sheets-query";
import { Button } from "@/src/ui/Button";

export default function HomeScreen() {
  const router = useRouter();
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: sheets = [], isLoading, error } = useUserSheetsQuery(userId);
  const hasSheets = sheets.length > 0;

  const createLabel = "+ Create New Sheet";

  return (
    <>
      <Stack.Screen options={{ title: "Sheet Selection" }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, gap: 16 }}
        className="flex-1 bg-canvas"
      >
        <View className="gap-4">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-3">
              <Text className="text-xs font-semibold uppercase tracking-[3px] text-primary">
                Sheets
              </Text>
              <Text className="text-3xl font-black text-ink">
                Sheet Selection
              </Text>
              <Text className="text-base leading-6 text-ink/70">
                Choose a sheet to continue.
              </Text>
            </View>
            <Button size="sm" variant="ink" label="Sign out" onPress={signOut} />
          </View>
        </View>

        <Button size="lg" variant="outline" label={createLabel} />

        {isLoading ? (
          <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
            <View className="flex-row items-center gap-3">
              <ActivityIndicator color="#166534" />
              <Text className="text-base text-ink/70">Loading your sheets...</Text>
            </View>
          </View>
        ) : null}

        {error ? (
          <Text className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
            {error instanceof Error ? error.message : "Unable to load sheets."}
          </Text>
        ) : null}

        {!isLoading && !error && hasSheets
          ? sheets.map((sheet) => (
              <Button
                key={sheet.id}
                variant="outline"
                size="lg"
                onPress={() =>
                  router.push({
                    pathname: "/(app)/sheets/[sheetId]",
                    params: { sheetId: sheet.id },
                  })
                }
                className="min-h-0 items-start justify-start rounded-[28px] border border-black/5 bg-mist p-6 shadow-card"
              >
                <View className="w-full">
                  <Text className="text-xs font-semibold uppercase tracking-[3px] text-primary">
                    {sheet.role}
                  </Text>
                  <Text className="mt-2 text-left text-xl font-black text-ink">
                    {sheet.name}
                  </Text>
                  <Text className="mt-2 text-left text-base leading-6 text-ink/70">
                    {sheet.description?.trim() || "No description yet."}
                  </Text>
                </View>
              </Button>
            ))
          : null}

        {!isLoading && !error && !hasSheets ? (
          <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
            <Text className="text-lg font-bold text-ink">
              You don't have any sheets yet.
            </Text>
            <Text className="mt-2 text-base leading-6 text-ink/70">
              Create a new sheet to get started.
            </Text>
            <Button className="mt-4" size="lg" variant="primary" label={createLabel} />
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}

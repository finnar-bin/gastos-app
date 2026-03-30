import { Stack } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import { signOut } from "@/src/lib/auth-requests";
import { useSession } from "@/src/providers/session-provider";
import { Button } from "@/src/ui/button";

export default function HomeScreen() {
  const { session } = useSession();

  return (
    <>
      <Stack.Screen options={{ title: "Overview" }} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ padding: 24, gap: 16 }}
        className="flex-1 bg-canvas"
      >
        <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
          <Text className="text-xs font-semibold uppercase tracking-[3px] text-primary">
            Signed in
          </Text>
          <Text className="mt-3 text-3xl font-black text-ink">
            Welcome to Gastos
          </Text>
          <Text selectable className="mt-3 text-base leading-6 text-ink/70">
            {session?.user.email ?? "No email returned from Supabase."}
          </Text>
          <Text className="mt-4 text-base leading-6 text-ink/70">
            This placeholder route is ready for the budget dashboard, account
            summaries, and transaction entry flows.
          </Text>
        </View>

        <Button onPress={signOut} size="lg" variant="ink" label="Sign out" />
      </ScrollView>
    </>
  );
}

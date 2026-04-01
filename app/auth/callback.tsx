import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

import { useSession } from "@/src/providers/SessionProvider";

export default function AuthCallbackScreen() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <View className="flex-1 items-center justify-center gap-4 bg-canvas px-6">
          <ActivityIndicator color="#166534" />
          <Text className="text-center text-sm text-ink/70">
            Completing sign in...
          </Text>
        </View>
      </>
    );
  }

  return <Redirect href={session ? "/(app)" : "/(auth)/login"} />;
}

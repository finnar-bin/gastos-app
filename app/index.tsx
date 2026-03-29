import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useSession } from "@/src/providers/session-provider";

export default function IndexRoute() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="#166534" />
      </View>
    );
  }

  return <Redirect href={session ? "/(app)" : "/(auth)/login"} />;
}

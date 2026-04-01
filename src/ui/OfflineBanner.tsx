import { Text, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetInfo();

  const isOffline = isConnected === false || isInternetReachable === false;

  if (!isOffline) {
    return null;
  }

  return (
    <View className="bg-amber-500 px-4 py-2">
      <Text className="text-center text-sm font-semibold text-ink">
        You are offline. Showing cached data.
      </Text>
    </View>
  );
}

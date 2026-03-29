import { type PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";

import { useSession } from "@/src/providers/session-provider";

type AuthGateProps = PropsWithChildren<{
}>;

export function AuthGate({ children }: AuthGateProps) {
  const { isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="#166534" />
      </View>
    );
  }

  return children;
}

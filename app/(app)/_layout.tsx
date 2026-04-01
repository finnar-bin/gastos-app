import { Redirect, Stack } from "expo-router";

import { useSession } from "@/src/providers/SessionProvider";

export default function AppLayout() {
  const { isLoading, session } = useSession();

  if (isLoading) {
    return null;
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

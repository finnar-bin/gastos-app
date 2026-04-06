import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { signOut } from "@/src/lib/auth-requests";
import { useSession } from "@/src/providers/SessionProvider";
import { useUserSheetsQuery } from "@/src/queries/use-user-sheets-query";

import { Button } from "./Button";

export function SheetHeader({
  sheetId,
  title,
}: {
  sheetId: string | null;
  title: string;
}) {
  const router = useRouter();
  const { session } = useSession();
  const userId = session?.user.id;
  const { data: sheets = [] } = useUserSheetsQuery(userId);
  const selectedSheet = sheets.find((sheet) => sheet.id === sheetId);

  return (
    <View className="pb-3 pt-2">
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-3">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-xs font-semibold uppercase tracking-[3px] text-primary"
          >
            {selectedSheet?.name ?? "Selected Sheet"}
          </Text>
          <Text className="text-2xl font-black text-ink">{title}</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            label="Sheet"
            onPress={() => router.push("/(app)/")}
          />
          <Button size="sm" variant="ink" label="Sign out" onPress={signOut} />
        </View>
      </View>
    </View>
  );
}

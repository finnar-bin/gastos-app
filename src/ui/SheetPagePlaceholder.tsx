import { Text, View } from "react-native";

type SheetPagePlaceholderProps = {
  pageTitle: string;
  pageDescription: string;
  sheetId: string | null;
};

export function SheetPagePlaceholder({
  pageTitle,
  pageDescription,
  sheetId,
}: SheetPagePlaceholderProps) {
  return (
    <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
      <Text className="text-xs font-semibold uppercase tracking-[3px] text-primary">
        Sheet {sheetId ?? "Unknown"}
      </Text>
      <Text className="mt-3 text-2xl font-black text-ink">{pageTitle}</Text>
      <Text className="mt-2 text-base leading-6 text-ink/70">
        {pageDescription}
      </Text>
    </View>
  );
}

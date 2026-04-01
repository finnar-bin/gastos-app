import {
  Home,
  LayoutDashboard,
  NotebookPen,
  Plus,
  Settings,
} from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAV_ITEMS = [
  { key: "Home", label: "Home", icon: Home },
  { key: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  // { key: "transactions", label: "Transactions", icon: NotebookPen },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "add", label: "Add", icon: Plus },
] as const;

export const SHEETS_FLOATING_NAV_CONTENT_PADDING = 92;

export function FloatingSheetsNav() {
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="none">
      <View
        className="border-t border-black/10 bg-white px-4 pt-2"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-end justify-between gap-2">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isAddItem = key === "add";

            return (
              <View key={key} className="min-w-0 flex-1 items-center gap-1">
                {isAddItem ? (
                  <View className="h-14 w-14 items-center justify-center rounded-[20px] bg-primary">
                    <Icon size={24} color="#FFFFFF" strokeWidth={2.6} />
                  </View>
                ) : (
                  <View className="h-10 w-10 items-center justify-center rounded-2xl bg-transparent">
                    <Icon size={20} color="#182126" strokeWidth={2.2} />
                  </View>
                )}

                {!isAddItem ? (
                  <Text
                    numberOfLines={1}
                    className="text-[11px] font-semibold text-ink/70"
                  >
                    {label}
                  </Text>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

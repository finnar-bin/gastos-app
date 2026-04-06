import {
  Home,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react-native";
import { useRouter, type Href, useLocalSearchParams } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NAV_ITEMS = [
  {
    key: "home",
    label: "Home",
    icon: Home,
    pathname: "/(app)/sheets/[sheetId]",
  },
  {
    key: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    pathname: "/(app)/sheets/[sheetId]/dashboard",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    pathname: "/(app)/sheets/[sheetId]/settings",
  },
  { key: "add", label: "Add", icon: Plus, pathname: null },
] as const;

export const SHEETS_FLOATING_NAV_CONTENT_PADDING = 92;

function toSheetId(sheetIdParam: string | string[] | undefined) {
  if (Array.isArray(sheetIdParam)) {
    return sheetIdParam[0] ?? null;
  }

  return sheetIdParam ?? null;
}

export function Navbar() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId);
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View
        className="border-t border-black/10 bg-white px-4 pt-2"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        <View className="flex-row items-end justify-between gap-2">
          {NAV_ITEMS.map(({ key, label, icon: Icon, pathname }) => {
            const isAddItem = key === "add";
            const onPress = !isAddItem && pathname && sheetId
              ? () => {
                  router.replace({ pathname, params: { sheetId } } as Href);
                }
              : undefined;

            return (
              <Pressable
                key={key}
                className="min-w-0 flex-1 items-center gap-1"
                onPress={onPress}
                disabled={!onPress}
              >
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
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

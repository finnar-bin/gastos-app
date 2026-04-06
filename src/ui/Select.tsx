import { Pressable, Text, View } from "react-native";

export type SelectOption = {
  id: string;
  label: string;
};

type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (nextId: string) => void;
};

export function Select({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
}: SelectProps) {
  return (
    <View className={`relative flex-1 ${isOpen ? "z-50" : "z-0"}`}>
      <Text className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-ink/60">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={onToggle}
        className="min-h-11 flex-row items-center justify-between rounded-xl border border-black/10 bg-white px-3"
      >
        <Text className="text-sm font-semibold text-ink">{value}</Text>
        <Text className="text-xs font-bold text-ink/55">{isOpen ? "▲" : "▼"}</Text>
      </Pressable>

      {isOpen ? (
        <View
          className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-black/10 bg-white shadow-card"
          style={{ elevation: 16 }}
        >
          {options.map((option) => {
            const isSelected = option.label === value;
            return (
              <Pressable
                key={option.id}
                onPress={() => onSelect(option.id)}
                className={`px-3 py-2.5 ${isSelected ? "bg-primary/10" : "bg-white"}`}
              >
                <Text
                  className={`text-sm ${
                    isSelected ? "font-bold text-primary" : "font-semibold text-ink"
                  }`}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

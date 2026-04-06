import { View } from "react-native";

import { Button } from "@/src/ui/Button";

type ButtonGroupSize = "xl" | "lg" | "md" | "sm";
type ButtonGroupVariant = "primary" | "secondary" | "warning" | "outline" | "ink";

export type ButtonGroupOption<T extends string> = {
  id: T;
  label: string;
};

type ButtonGroupProps<T extends string> = {
  options: readonly ButtonGroupOption<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
  size?: ButtonGroupSize;
  containerClassName?: string;
  buttonClassName?: string;
  textClassName?: string;
  activeVariant?: ButtonGroupVariant;
  inactiveVariant?: ButtonGroupVariant;
  fullWidth?: boolean;
  disabled?: boolean;
};

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function ButtonGroup<T extends string>({
  options,
  selectedId,
  onSelect,
  size = "sm",
  containerClassName = "flex-row items-center gap-2 rounded-xl border border-black/10 bg-white p-1",
  buttonClassName,
  textClassName,
  activeVariant = "ink",
  inactiveVariant = "outline",
  fullWidth = false,
  disabled = false,
}: ButtonGroupProps<T>) {
  return (
    <View className={containerClassName}>
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <Button
            key={option.id}
            size={size}
            variant={isSelected ? activeVariant : inactiveVariant}
            className={cx(fullWidth && "flex-1", buttonClassName)}
            textClassName={textClassName}
            label={option.label}
            onPress={() => onSelect(option.id)}
            disabled={disabled}
          />
        );
      })}
    </View>
  );
}

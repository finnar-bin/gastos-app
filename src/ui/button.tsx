import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  type PressableProps,
} from "react-native";
import type { ReactNode } from "react";

type ButtonSize = "xl" | "lg" | "md" | "sm";
type ButtonVariant = "primary" | "secondary" | "warning" | "outline" | "ink";

type ButtonProps = Omit<PressableProps, "children"> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  textClassName?: string;
  label?: string;
  isLoading?: boolean;
  children?: ReactNode;
};

const SIZE_CONTAINER_CLASS: Record<ButtonSize, string> = {
  xl: "min-h-16 rounded-2xl px-6",
  lg: "min-h-14 rounded-2xl px-4",
  md: "min-h-12 rounded-xl px-4",
  sm: "min-h-10 rounded-xl px-3",
};

const SIZE_TEXT_CLASS: Record<ButtonSize, string> = {
  xl: "text-lg",
  lg: "text-base",
  md: "text-sm",
  sm: "text-sm",
};

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-sand",
  warning: "bg-danger",
  outline: "border border-ink/10 bg-white",
  ink: "bg-ink",
};

const VARIANT_TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-white",
  secondary: "text-ink",
  warning: "text-white",
  outline: "text-ink",
  ink: "text-white",
};

const VARIANT_SPINNER_COLOR: Record<ButtonVariant, string> = {
  primary: "#ffffff",
  secondary: "#182126",
  warning: "#ffffff",
  outline: "#182126",
  ink: "#ffffff",
};

function cx(...parts: Array<string | undefined | false | null>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  size = "lg",
  variant = "primary",
  className,
  textClassName,
  label,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  const containerClassName = cx(
    "items-center justify-center",
    SIZE_CONTAINER_CLASS[size],
    VARIANT_CLASS[variant],
    isDisabled && "opacity-60",
    className,
  );

  const computedTextClassName = cx(
    "font-bold text-center",
    SIZE_TEXT_CLASS[size],
    VARIANT_TEXT_CLASS[variant],
    textClassName,
  );
  const content =
    children ??
    (label ? <Text className={computedTextClassName}>{label}</Text> : null);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled || isLoading}
      {...props}
      className={containerClassName}
    >
      {content ? (
        <View className="flex-row items-center justify-center gap-2">
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={VARIANT_SPINNER_COLOR[variant]}
            />
          ) : null}
          {content}
        </View>
      ) : null}
    </Pressable>
  );
}

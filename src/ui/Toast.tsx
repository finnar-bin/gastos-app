import { Text, View } from "react-native";

export type ToastType = "success" | "error";

type ToastProps = {
  message: string;
  type: ToastType;
};

export function Toast({ message, type }: ToastProps) {
  const containerClassName = type === "success" ? "bg-primary" : "bg-danger";

  return (
    <View className={`rounded-2xl px-4 py-3 ${containerClassName}`}>
      <Text className="text-sm font-semibold text-white">{message}</Text>
    </View>
  );
}

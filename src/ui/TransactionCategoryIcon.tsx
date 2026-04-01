import * as LucideIcons from "lucide-react-native";
import { Text, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";

type TransactionCategoryIconProps = {
  icon: string | null;
  type: "income" | "expense";
};

function toPascalCaseIconName(iconName: string) {
  return iconName
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");
}

function resolveLucideIcon(iconName: string | null): LucideIcon | null {
  if (!iconName?.trim()) {
    return null;
  }

  const trimmedName = iconName.trim();
  const candidateNames = [
    trimmedName,
    toPascalCaseIconName(trimmedName),
    `${toPascalCaseIconName(trimmedName)}Icon`,
  ];

  for (const candidateName of candidateNames) {
    const iconComponent = (
      LucideIcons as unknown as Record<string, LucideIcon | undefined>
    )[candidateName];

    if (iconComponent) {
      return iconComponent;
    }
  }

  return null;
}

export function TransactionCategoryIcon({
  icon,
  type,
}: TransactionCategoryIconProps) {
  const backgroundClass =
    type === "expense" ? "bg-danger/10" : "bg-primary/10";
  const iconClass = type === "expense" ? "text-danger" : "text-primary";
  const ResolvedIcon = resolveLucideIcon(icon);

  return (
    <View
      className={`h-10 w-10 items-center justify-center rounded-full ${backgroundClass}`}
    >
      {ResolvedIcon ? (
        <ResolvedIcon
          size={18}
          strokeWidth={2.2}
          className={iconClass}
          color={type === "expense" ? "#dc2626" : "#166534"}
        />
      ) : (
        <Text className={`text-lg ${iconClass}`}>•</Text>
      )}
    </View>
  );
}

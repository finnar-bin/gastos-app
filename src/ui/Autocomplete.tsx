import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { X } from "lucide-react-native";

import { TextField } from "@/src/ui/TextField";
import { TransactionCategoryIcon } from "@/src/ui/TransactionCategoryIcon";

export type AutocompleteOption = {
  id: string;
  label: string;
  icon?: string | null;
  iconType?: "income" | "expense";
  defaultAmount?: number | null;
};

type AutocompleteProps = {
  label: string;
  placeholder: string;
  value: string;
  selectedOptionId: string | null;
  options: AutocompleteOption[];
  onChangeValue: (value: string) => void;
  onSelectOption: (option: AutocompleteOption) => void;
  emptyMessage: string;
  errorMessage?: string;
  isLoading?: boolean;
  disabled?: boolean;
};

export function Autocomplete({
  label,
  placeholder,
  value,
  selectedOptionId,
  options,
  onChangeValue,
  onSelectOption,
  emptyMessage,
  errorMessage,
  isLoading = false,
  disabled = false,
}: AutocompleteProps) {
  const MAX_VISIBLE_ROWS = 6;
  const ROW_HEIGHT = 52;

  const [isOpen, setIsOpen] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedValue),
    );
  }, [options, value]);

  const hasSelection = Boolean(
    selectedOptionId && options.some((option) => option.id === selectedOptionId),
  );
  const shouldShowClearButton = !disabled && (Boolean(value.trim()) || hasSelection);

  const shouldShowDropdown = isOpen && !disabled;

  const commitValueFromMatches = () => {
    if (disabled) {
      return;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    const firstMatch = filteredOptions[0];
    if (firstMatch) {
      onSelectOption(firstMatch);
      return;
    }

    onChangeValue("");
  };

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink">{label}</Text>
      <View className="relative">
        <View className="relative">
          <TextField
            ref={inputRef}
            editable={!disabled}
            value={value}
            className={shouldShowClearButton ? "pr-12" : undefined}
            onChangeText={onChangeValue}
            onFocus={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
                blurTimeoutRef.current = null;
              }
              setIsOpen(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(() => {
                commitValueFromMatches();
                setIsOpen(false);
              }, 120);
            }}
            placeholder={placeholder}
            placeholderTextColor="#6b7280"
          />
          {shouldShowClearButton ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Clear ${label}`}
              onPress={() => {
                onChangeValue("");
                setIsOpen(true);
                inputRef.current?.focus();
              }}
              className="absolute bottom-0 right-3 top-0 justify-center"
              hitSlop={8}
            >
              <X size={16} color="#6b7280" strokeWidth={2.4} />
            </Pressable>
          ) : null}
        </View>

        {shouldShowDropdown ? (
          <View className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl">
            <View className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              {isLoading ? (
                <Text className="px-4 py-3 text-sm text-ink/60">Loading options...</Text>
              ) : filteredOptions.length > 0 ? (
                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  style={{ maxHeight: ROW_HEIGHT * MAX_VISIBLE_ROWS }}
                >
                  {filteredOptions.map((option) => {
                    const isSelected = option.id === selectedOptionId;

                    return (
                      <Pressable
                        key={option.id}
                        onPress={() => {
                          onSelectOption(option);
                          setIsOpen(false);
                        }}
                        className={`flex-row items-center gap-2 px-4 py-3 ${
                          isSelected ? "bg-primary/10" : "bg-white"
                        }`}
                      >
                        <TransactionCategoryIcon
                          icon={option.icon ?? null}
                          type={option.iconType ?? "expense"}
                        />
                        <Text
                          className={`flex-1 text-sm ${
                            isSelected ? "font-bold text-primary" : "font-semibold text-ink"
                          }`}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              ) : (
                <Text className="px-4 py-3 text-sm text-ink/60">{emptyMessage}</Text>
              )}
            </View>
          </View>
        ) : null}
      </View>

      {errorMessage ? (
        <Text className="text-sm text-danger">{errorMessage}</Text>
      ) : !hasSelection && value.trim().length > 0 ? (
        <Text className="text-xs text-ink/55">Select one option from the list.</Text>
      ) : null}
    </View>
  );
}

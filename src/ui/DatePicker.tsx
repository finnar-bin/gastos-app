import { useMemo, useState } from "react";
import { Modal, Platform, Pressable, Text, View } from "react-native";
import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Button } from "@/src/ui/Button";
import { TextField } from "@/src/ui/TextField";

const DATE_ONLY_REGEX = /^\d{4}-\d{2}-\d{2}$/;

type DatePickerProps = {
  label: string;
  value: string;
  onChangeValue: (value: string) => void;
  errorMessage?: string;
  placeholder?: string;
  locale?: string;
  disabled?: boolean;
  onOpen?: () => void;
};

export function toDateOnlyValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isDateOnlyValue(value: string) {
  if (!DATE_ONLY_REGEX.test(value)) {
    return false;
  }

  const [yearPart, monthPart, dayPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }

  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() + 1 === month &&
    parsedDate.getDate() === day
  );
}

export function toDateFromDateOnlyValue(value: string) {
  if (!isDateOnlyValue(value)) {
    return null;
  }

  const [yearPart, monthPart, dayPart] = value.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  const day = Number(dayPart);

  return new Date(year, month - 1, day);
}

export function formatDateOnlyForDisplay(value: string, locale = "en-US") {
  const date = toDateFromDateOnlyValue(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function DatePicker({
  label,
  value,
  onChangeValue,
  errorMessage,
  placeholder = "Select date",
  locale = "en-US",
  disabled = false,
  onOpen,
}: DatePickerProps) {
  const [isIosPickerVisible, setIsIosPickerVisible] = useState(false);
  const [iosDraftDate, setIosDraftDate] = useState<Date>(
    toDateFromDateOnlyValue(value) ?? new Date(),
  );

  const previewValue = useMemo(
    () => formatDateOnlyForDisplay(value, locale),
    [value, locale],
  );

  const openDateSelector = () => {
    if (disabled) {
      return;
    }

    onOpen?.();

    const currentDate = toDateFromDateOnlyValue(value) ?? new Date();

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        mode: "date",
        value: currentDate,
        onChange: (_event: DateTimePickerEvent, selectedDate?: Date) => {
          if (!selectedDate) {
            return;
          }

          onChangeValue(toDateOnlyValue(selectedDate));
        },
      });
      return;
    }

    setIosDraftDate(currentDate);
    setIsIosPickerVisible(true);
  };

  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-ink">{label}</Text>
      <Pressable disabled={disabled} onPress={openDateSelector}>
        <View pointerEvents="none">
          <TextField
            value={previewValue}
            editable={false}
            placeholder={placeholder}
            placeholderTextColor="#6b7280"
          />
        </View>
      </Pressable>
      {errorMessage ? <Text className="text-sm text-danger">{errorMessage}</Text> : null}

      <Modal
        transparent
        visible={isIosPickerVisible}
        animationType="fade"
        onRequestClose={() => setIsIosPickerVisible(false)}
      >
        <View className="flex-1 items-center justify-end bg-black/30 px-4 pb-8">
          <View className="w-full rounded-3xl bg-white p-4">
            <Text className="text-base font-bold text-ink">Select Date</Text>
            <DateTimePicker
              mode="date"
              display="inline"
              themeVariant="light"
              textColor="#182126"
              accentColor="#0F766E"
              value={iosDraftDate}
              onChange={(_event, selectedDate) => {
                if (!selectedDate) {
                  return;
                }

                setIosDraftDate(selectedDate);
              }}
            />
            <View className="mt-2 flex-row justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                label="Cancel"
                onPress={() => setIsIosPickerVisible(false)}
              />
              <Button
                size="sm"
                variant="primary"
                label="Done"
                onPress={() => {
                  onChangeValue(toDateOnlyValue(iosDraftDate));
                  setIsIosPickerVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

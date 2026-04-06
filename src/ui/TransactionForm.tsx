import { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";

import {
  type TransactionType,
  type PaymentTypeOption,
  type TransactionCategoryOption,
} from "@/src/lib/transaction-form-requests";
import { useSheetPaymentTypesQuery } from "@/src/queries/use-sheet-payment-types-query";
import { useSheetTransactionCategoriesQuery } from "@/src/queries/use-sheet-transaction-categories-query";
import { useToast } from "@/src/providers/ToastProvider";
import { Autocomplete, type AutocompleteOption } from "@/src/ui/Autocomplete";
import { Button } from "@/src/ui/Button";
import { ButtonGroup } from "@/src/ui/ButtonGroup";
import {
  DatePicker,
  isDateOnlyValue,
  toDateOnlyValue,
} from "@/src/ui/DatePicker";
import { TextField } from "@/src/ui/TextField";

const TRANSACTION_TYPE_BUTTON_OPTIONS = [
  { id: "expense", label: "Expense" },
  { id: "income", label: "Income" },
] as const;

type TransactionFormFieldErrors = {
  category?: string;
  date?: string;
  amount?: string;
  paymentType?: string;
};

export type TransactionFormInitialValues = {
  transactionType?: TransactionType;
  categoryId?: string | null;
  categoryName?: string;
  date?: string;
  amount?: string;
  paymentTypeId?: string | null;
  paymentTypeName?: string;
  description?: string;
};

export type TransactionFormSubmitValues = {
  transactionType: TransactionType;
  categoryId: string;
  date: string;
  amount: number;
  paymentTypeId: string | null;
  description: string | null;
};

type TransactionFormProps = {
  sheetId: string;
  submitLabel: string;
  cancelLabel?: string;
  initialValues?: TransactionFormInitialValues;
  isSubmitting?: boolean;
  title?: string;
  subtitle?: string;
  resetOnSubmit?: boolean;
  onDescriptionFocus?: (target: number) => void;
  onCancel?: () => void;
  onSubmit: (values: TransactionFormSubmitValues) => Promise<void>;
};

function toAutocompleteOptions(
  options: TransactionCategoryOption[] | PaymentTypeOption[] | undefined,
  iconType: "income" | "expense",
): AutocompleteOption[] {
  if (!options || options.length === 0) {
    return [];
  }

  return options.map((option) => {
    const parsedDefaultAmount =
      "default_amount" in option && option.default_amount !== null
        ? Number(option.default_amount)
        : null;

    return {
      id: option.id,
      label: option.name,
      icon: option.icon,
      iconType,
      defaultAmount:
        parsedDefaultAmount !== null && Number.isFinite(parsedDefaultAmount)
          ? parsedDefaultAmount
          : undefined,
    };
  });
}

export function TransactionForm({
  sheetId,
  submitLabel,
  cancelLabel = "Cancel",
  initialValues,
  isSubmitting = false,
  title = "Transaction Form",
  subtitle = "Fill in the details below to add a transaction for this sheet.",
  resetOnSubmit = true,
  onDescriptionFocus,
  onCancel,
  onSubmit,
}: TransactionFormProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    initialValues?.transactionType ?? "expense",
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initialValues?.categoryId ?? null,
  );
  const [categorySearchValue, setCategorySearchValue] = useState(
    initialValues?.categoryName ?? "",
  );
  const [date, setDate] = useState(
    initialValues?.date ?? toDateOnlyValue(new Date()),
  );
  const [amount, setAmount] = useState(initialValues?.amount ?? "");
  const [paymentTypeId, setPaymentTypeId] = useState<string | null>(
    initialValues?.paymentTypeId ?? null,
  );
  const [paymentTypeSearchValue, setPaymentTypeSearchValue] = useState(
    initialValues?.paymentTypeName ?? "",
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [fieldErrors, setFieldErrors] = useState<TransactionFormFieldErrors>(
    {},
  );
  const { showToast } = useToast();

  const categoriesQuery = useSheetTransactionCategoriesQuery(
    sheetId,
    transactionType,
  );
  const paymentTypesQuery = useSheetPaymentTypesQuery(sheetId);

  const categoryOptions = useMemo(
    () => toAutocompleteOptions(categoriesQuery.data, transactionType),
    [categoriesQuery.data, transactionType],
  );

  const paymentTypeOptions = useMemo(
    () => toAutocompleteOptions(paymentTypesQuery.data, "expense"),
    [paymentTypesQuery.data],
  );

  useEffect(() => {
    if (transactionType === "income") {
      setPaymentTypeId(null);
      setPaymentTypeSearchValue("");
      setFieldErrors((previous) => ({ ...previous, paymentType: undefined }));
    }
  }, [transactionType]);

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    const selectedCategory = categoryOptions.find(
      (option) => option.id === categoryId,
    );
    if (!selectedCategory) {
      setCategoryId(null);
      setCategorySearchValue("");
      return;
    }

    if (!categorySearchValue.trim()) {
      setCategorySearchValue(selectedCategory.label);
    }
  }, [categoryId, categoryOptions, categorySearchValue]);

  useEffect(() => {
    if (!paymentTypeId) {
      return;
    }

    const selectedPaymentType = paymentTypeOptions.find(
      (option) => option.id === paymentTypeId,
    );

    if (!selectedPaymentType) {
      setPaymentTypeId(null);
      setPaymentTypeSearchValue("");
      return;
    }

    if (!paymentTypeSearchValue.trim()) {
      setPaymentTypeSearchValue(selectedPaymentType.label);
    }
  }, [paymentTypeId, paymentTypeOptions, paymentTypeSearchValue]);

  const handleSubmit = async () => {
    const nextErrors: TransactionFormFieldErrors = {};

    if (!categoryId) {
      nextErrors.category = "Category is required.";
    }

    if (!isDateOnlyValue(date)) {
      nextErrors.date = "Date must be in YYYY-MM-DD format.";
    }

    const parsedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(parsedAmount)) {
      nextErrors.amount = "Amount must be a valid number.";
    } else if (parsedAmount < 0) {
      nextErrors.amount = "Amount cannot be negative.";
    }

    if (transactionType === "expense" && !paymentTypeId) {
      nextErrors.paymentType = "Payment type is required for expenses.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      await onSubmit({
        transactionType,
        categoryId: categoryId!,
        date,
        amount: parsedAmount,
        paymentTypeId: transactionType === "expense" ? paymentTypeId : null,
        description: description.trim() ? description.trim() : null,
      });

      showToast({
        message: "Transaction saved.",
        type: "success",
      });
      if (resetOnSubmit) {
        setCategoryId(null);
        setCategorySearchValue("");
        setAmount("0.00");
        setDescription("");

        if (transactionType === "expense") {
          setPaymentTypeId(null);
          setPaymentTypeSearchValue("");
        }
      }
    } catch (error) {
      showToast({
        message:
          error instanceof Error ? error.message : "Unable to save transaction.",
        type: "error",
      });
    }
  };

  return (
    <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
      <Text className="text-2xl font-black text-ink">{title}</Text>
      <Text className="mt-2 text-sm text-ink/70">{subtitle}</Text>

      <View className="mt-6 gap-4">
        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">
            Transaction Type
          </Text>
          <ButtonGroup
            options={TRANSACTION_TYPE_BUTTON_OPTIONS}
            selectedId={transactionType}
            onSelect={setTransactionType}
            fullWidth
          />
        </View>

        <Autocomplete
          label="Category"
          placeholder="Search category"
          value={categorySearchValue}
          selectedOptionId={categoryId}
          options={categoryOptions}
          onChangeValue={(value) => {
            setCategorySearchValue(value);
            setCategoryId(null);
            if (fieldErrors.category) {
              setFieldErrors((previous) => ({
                ...previous,
                category: undefined,
              }));
            }
          }}
          onSelectOption={(option) => {
            setCategoryId(option.id);
            setCategorySearchValue(option.label);
            if (option.defaultAmount !== undefined && option.defaultAmount !== null) {
              setAmount(option.defaultAmount.toFixed(2));
              if (fieldErrors.amount) {
                setFieldErrors((previous) => ({
                  ...previous,
                  amount: undefined,
                }));
              }
            }
            if (fieldErrors.category) {
              setFieldErrors((previous) => ({
                ...previous,
                category: undefined,
              }));
            }
          }}
          emptyMessage={
            categoriesQuery.isLoading
              ? "Loading categories..."
              : "No categories found for this sheet and type."
          }
          errorMessage={
            fieldErrors.category ??
            (categoriesQuery.isError ? "Unable to load categories." : undefined)
          }
          isLoading={categoriesQuery.isLoading}
        />

        <DatePicker
          label="Date"
          value={date}
          onChangeValue={setDate}
          errorMessage={fieldErrors.date}
          onOpen={() => {
            if (fieldErrors.date) {
              setFieldErrors((previous) => ({ ...previous, date: undefined }));
            }
          }}
        />

        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">Amount</Text>
          <TextField
            value={amount}
            onChangeText={(value) => {
              const sanitizedValue = value.replace(/[^0-9.]/g, "");
              setAmount(sanitizedValue);
              if (fieldErrors.amount) {
                setFieldErrors((previous) => ({
                  ...previous,
                  amount: undefined,
                }));
              }
            }}
            placeholder="0.00"
            placeholderTextColor="#6b7280"
            keyboardType="decimal-pad"
            inputMode="decimal"
          />
          {fieldErrors.amount ? (
            <Text className="text-sm text-danger">{fieldErrors.amount}</Text>
          ) : null}
        </View>

        {transactionType === "expense" ? (
          <Autocomplete
            label="Payment Type"
            placeholder="Search payment type"
            value={paymentTypeSearchValue}
            selectedOptionId={paymentTypeId}
            options={paymentTypeOptions}
            onChangeValue={(value) => {
              setPaymentTypeSearchValue(value);
              setPaymentTypeId(null);
              if (fieldErrors.paymentType) {
                setFieldErrors((previous) => ({
                  ...previous,
                  paymentType: undefined,
                }));
              }
            }}
            onSelectOption={(option) => {
              setPaymentTypeId(option.id);
              setPaymentTypeSearchValue(option.label);
              if (fieldErrors.paymentType) {
                setFieldErrors((previous) => ({
                  ...previous,
                  paymentType: undefined,
                }));
              }
            }}
            emptyMessage={
              paymentTypesQuery.isLoading
                ? "Loading payment types..."
                : "No payment types found for this sheet."
            }
            errorMessage={
              fieldErrors.paymentType ??
              (paymentTypesQuery.isError
                ? "Unable to load payment types."
                : undefined)
            }
            isLoading={paymentTypesQuery.isLoading}
          />
        ) : null}

        <View className="gap-2">
          <Text className="text-sm font-semibold text-ink">Description</Text>
          <TextField
            value={description}
            onChangeText={setDescription}
            onFocus={(event) => onDescriptionFocus?.(event.nativeEvent.target)}
            multiline
            numberOfLines={3}
            maxLength={280}
            style={{
              height: 84,
              textAlignVertical: "top",
              paddingTop: 12,
              paddingBottom: 12,
            }}
            className="h-auto"
            placeholder="Add an optional note"
            placeholderTextColor="#6b7280"
          />
        </View>

        <Button
          label={submitLabel}
          onPress={handleSubmit}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        />
        {onCancel ? (
          <Button
            label={cancelLabel}
            variant="outline"
            onPress={onCancel}
            disabled={isSubmitting}
          />
        ) : null}
      </View>
    </View>
  );
}

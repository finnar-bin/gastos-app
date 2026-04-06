import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ButtonGroup } from "@/src/ui/ButtonGroup";
import { Select } from "@/src/ui/Select";
import { SheetHeader } from "@/src/ui/SheetHeader";
import { TransactionCategoryIcon } from "@/src/ui/TransactionCategoryIcon";
import { useSheetTransactionOverviewQuery } from "@/src/queries/use-sheet-transaction-overview-query";
import { useSheetCurrencyQuery } from "@/src/queries/use-sheet-currency-query";
import { formatCurrency } from "@/src/utils/format-currency";
import { toSheetId } from "@/src/utils/to-sheet-id";

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  label: new Intl.DateTimeFormat("en-US", { month: "long" }).format(
    new Date(2026, index, 1),
  ),
}));

const YEAR_OPTIONS = Array.from({ length: 11 }, (_, index) => {
  const year = 2025 + index;
  return { id: String(year), label: String(year) };
});

const TRANSACTION_TYPE_BUTTON_OPTIONS = [
  { id: "expense", label: "Expense" },
  { id: "income", label: "Income" },
] as const;

function getBudgetStatus(totalAmount: number, budget: number | null) {
  if (budget === null || budget <= 0) {
    return null;
  }

  if (totalAmount > budget) {
    return { message: "Budget exceeded", textClassName: "text-danger" };
  }

  if (totalAmount === budget) {
    return null;
  }

  const remaining = budget - totalAmount;
  const remainingRatio = remaining / budget;

  if (remainingRatio <= 0.15) {
    return {
      message: "15% or less budget remaining",
      textClassName: "text-[#D97706]",
    };
  }

  return null;
}

export default function SheetDashboardPage() {
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId) ?? null;
  const now = new Date();
  const [selectedMonthId, setSelectedMonthId] = useState(
    String(now.getMonth() + 1),
  );
  const [selectedYearId, setSelectedYearId] = useState(() => {
    const currentYearId = String(now.getFullYear());
    return YEAR_OPTIONS.some((option) => option.id === currentYearId)
      ? currentYearId
      : YEAR_OPTIONS[0].id;
  });
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense",
  );
  const [openDropdown, setOpenDropdown] = useState<"month" | "year" | null>(
    null,
  );
  const selectedMonthNumber = Number(selectedMonthId);
  const selectedYearNumber = Number(selectedYearId);

  const { data: currency = null } = useSheetCurrencyQuery(sheetId ?? undefined);
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useSheetTransactionOverviewQuery(
    sheetId ?? undefined,
    selectedYearNumber,
    selectedMonthNumber,
    selectedType,
  );

  const selectedMonthLabel =
    MONTH_OPTIONS.find((option) => option.id === selectedMonthId)?.label ??
    MONTH_OPTIONS[0].label;
  const selectedYearLabel =
    YEAR_OPTIONS.find((option) => option.id === selectedYearId)?.label ??
    YEAR_OPTIONS[0].label;

  return (
    <>
      <Stack.Screen options={{ title: "Dashboard" }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-canvas">
        <ScrollView
          onScrollBeginDrag={() => setOpenDropdown(null)}
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
            gap: 16,
          }}
          className="flex-1"
        >
          <SheetHeader sheetId={sheetId} title="Dashboard" />
          <View className="z-40 rounded-2xl border border-black/5 bg-mist p-4 shadow-card">
            <View className="flex-row gap-3">
              <Select
                label="Month"
                value={selectedMonthLabel}
                options={MONTH_OPTIONS}
                isOpen={openDropdown === "month"}
                onToggle={() =>
                  setOpenDropdown((current) =>
                    current === "month" ? null : "month",
                  )
                }
                onSelect={(nextId) => {
                  setSelectedMonthId(nextId);
                  setOpenDropdown(null);
                }}
              />
              <Select
                label="Year"
                value={selectedYearLabel}
                options={YEAR_OPTIONS}
                isOpen={openDropdown === "year"}
                onToggle={() =>
                  setOpenDropdown((current) =>
                    current === "year" ? null : "year",
                  )
                }
                onSelect={(nextId) => {
                  setSelectedYearId(nextId);
                  setOpenDropdown(null);
                }}
              />
            </View>
            <ButtonGroup
              options={TRANSACTION_TYPE_BUTTON_OPTIONS}
              selectedId={selectedType}
              onSelect={setSelectedType}
              fullWidth
              containerClassName="mt-4 flex-row items-center gap-2 rounded-xl border border-black/10 bg-white p-1"
            />
          </View>

          {isCategoriesLoading ? (
            <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <View className="flex-row items-center gap-3">
                <ActivityIndicator color="#166534" />
                <Text className="text-base text-ink/70">
                  Loading categories...
                </Text>
              </View>
            </View>
          ) : null}

          {categoriesError ? (
            <Text className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
              {categoriesError instanceof Error
                ? categoriesError.message
                : "Unable to load categories."}
            </Text>
          ) : null}

          {!isCategoriesLoading &&
          !categoriesError &&
          categories.length === 0 ? (
            <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <Text className="text-base font-bold text-ink">Categories</Text>
              <Text className="mt-2 text-sm text-ink/70">
                No {selectedType} categories found for this sheet.
              </Text>
            </View>
          ) : null}

          {!isCategoriesLoading && !categoriesError && categories.length > 0 ? (
            <View className="z-0 gap-3">
              {categories.map((category) => {
                const budgetStatus = getBudgetStatus(
                  category.totalAmount,
                  category.budget,
                );

                return (
                  <View
                    key={category.categoryId}
                    className="rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-card"
                  >
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-1 flex-row items-center gap-3">
                        <TransactionCategoryIcon
                          icon={category.categoryIcon}
                          type={selectedType}
                        />
                        <View className="flex-1">
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="text-sm font-semibold text-ink"
                          >
                            {category.categoryName}
                          </Text>
                          {budgetStatus ? (
                            <Text
                              className={`mt-1 text-xs font-semibold ${budgetStatus.textClassName}`}
                            >
                              {budgetStatus.message}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      <View className="items-end">
                        <Text className="text-right text-base font-bold text-ink">
                          {formatCurrency(category.totalAmount, currency)}
                        </Text>
                        {category.budget !== null ? (
                          <Text className="mt-1 text-xs text-ink/60">
                            Budget {formatCurrency(category.budget, currency)}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

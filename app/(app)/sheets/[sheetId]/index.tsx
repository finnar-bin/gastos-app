import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle } from "react-native-svg";

import { signOut } from "@/src/lib/auth-requests";
import type {
  MonthlyCategoryTotal,
  RecentSheetTransaction,
} from "@/src/lib/transactions-utils";
import { useSession } from "@/src/providers/SessionProvider";
import { useCurrentMonthSheetCategoryTotalsQuery } from "@/src/queries/use-current-month-sheet-category-totals-query";
import { useCurrentMonthSheetTotalsQuery } from "@/src/queries/use-current-month-sheet-totals-query";
import { useRecentSheetTransactionsQuery } from "@/src/queries/use-recent-sheet-transactions-query";
import { useSheetCurrencyQuery } from "@/src/queries/use-sheet-currency-query";
import { useUserSheetsQuery } from "@/src/queries/use-user-sheets-query";
import { Button } from "@/src/ui/Button";
import { TransactionCategoryIcon } from "@/src/ui/TransactionCategoryIcon";
import { UserAvatar } from "@/src/ui/UserAvatar";
import { formatCurrency } from "@/src/utils/format-currency";
import { formatDate } from "@/src/utils/format-date";

function toSheetId(sheetIdParam: string | string[] | undefined) {
  if (Array.isArray(sheetIdParam)) {
    return sheetIdParam[0];
  }

  return sheetIdParam;
}

const MONTH_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

const PIE_COLORS = [
  "#0F766E",
  "#2563EB",
  "#9333EA",
  "#F59E0B",
  "#DC2626",
  "#0EA5E9",
  "#A16207",
  "#4F46E5",
];

const PIE_SIZE = 176;
const PIE_STROKE_WIDTH = 28;
const PIE_RADIUS = (PIE_SIZE - PIE_STROKE_WIDTH) / 2;
const PIE_CIRCUMFERENCE = 2 * Math.PI * PIE_RADIUS;

function CurrentMonthSummaryCard({
  incomeTotal,
  expenseTotal,
  currency,
  isLoading,
  errorMessage,
}: {
  incomeTotal: number;
  expenseTotal: number;
  currency: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}) {
  return (
    <View className="overflow-hidden rounded-[28px] bg-[#111827] shadow-card">
      <LinearGradient
        colors={["#06080c", "#1b2432", "#314259", "#101722"]}
        locations={[0, 0.32, 0.65, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="px-6 py-5">
        <View className="flex-row items-start justify-between gap-3">
          <View>
            <Text className="text-xs font-semibold uppercase tracking-[3px] text-white/65">
              {MONTH_YEAR_FORMATTER.format(new Date())}
            </Text>
            <Text className="mt-2 text-xl font-bold text-white">
              Monthly Snapshot
            </Text>
          </View>
        </View>

        {isLoading ? (
          <Text className="mt-5 text-sm text-white/70">Loading totals...</Text>
        ) : null}

        {errorMessage ? (
          <Text className="mt-5 text-sm text-danger/90">{errorMessage}</Text>
        ) : null}

        {!isLoading && !errorMessage ? (
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1 py-1">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/75">
                Income
              </Text>
              <Text className="mt-2 text-xl font-black text-[#7EE6A2]">
                {formatCurrency(incomeTotal, currency)}
              </Text>
            </View>

            <View className="flex-1 py-1">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/75">
                Expenses
              </Text>
              <Text className="mt-2 text-xl font-black text-[#FF9A9A]">
                {formatCurrency(expenseTotal, currency)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function MonthlyCategoryPieSection({
  selectedType,
  onSelectType,
  chartData,
  currency,
  isLoading,
  errorMessage,
}: {
  selectedType: "income" | "expense";
  onSelectType: (nextType: "income" | "expense") => void;
  chartData: MonthlyCategoryTotal[];
  currency: string | null;
  isLoading: boolean;
  errorMessage: string | null;
}) {
  const totalAmount = chartData.reduce(
    (accumulator, entry) => accumulator + entry.totalAmount,
    0,
  );

  const slices = useMemo(() => {
    if (totalAmount <= 0) {
      return [];
    }

    let progress = 0;

    return chartData.map((entry, index) => {
      const ratio = entry.totalAmount / totalAmount;
      const strokeLength = Math.max(ratio * PIE_CIRCUMFERENCE, 2);
      const dashOffset = -progress * PIE_CIRCUMFERENCE;
      progress += ratio;

      return {
        ...entry,
        color: PIE_COLORS[index % PIE_COLORS.length],
        dashArray: `${strokeLength} ${PIE_CIRCUMFERENCE}`,
        dashOffset,
        ratio,
      };
    });
  }, [chartData, totalAmount]);

  return (
    <View className="rounded-[28px] border border-black/5 bg-white p-5 shadow-card">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-xl font-bold text-ink">Month Breakdown</Text>
        <View className="flex-row items-center gap-2 rounded-xl border border-black/10 bg-mist p-1">
          <Button
            size="sm"
            variant={selectedType === "income" ? "ink" : "outline"}
            className="min-h-8 px-3"
            textClassName="text-xs"
            label="Income"
            onPress={() => onSelectType("income")}
          />
          <Button
            size="sm"
            variant={selectedType === "expense" ? "ink" : "outline"}
            className="min-h-8 px-3"
            textClassName="text-xs"
            label="Expenses"
            onPress={() => onSelectType("expense")}
          />
        </View>
      </View>

      {isLoading ? (
        <View className="mt-5 flex-row items-center gap-3">
          <ActivityIndicator color="#166534" />
          <Text className="text-sm text-ink/70">Loading chart data...</Text>
        </View>
      ) : null}

      {errorMessage ? (
        <Text className="mt-5 text-sm text-danger/90">{errorMessage}</Text>
      ) : null}

      {!isLoading && !errorMessage && slices.length > 0 ? (
        <View className="mt-5">
          <View className="items-center">
            <Svg width={PIE_SIZE} height={PIE_SIZE} viewBox={`0 0 ${PIE_SIZE} ${PIE_SIZE}`}>
              <Circle
                cx={PIE_SIZE / 2}
                cy={PIE_SIZE / 2}
                r={PIE_RADIUS}
                stroke="#E5E7EB"
                strokeWidth={PIE_STROKE_WIDTH}
                fill="none"
              />
              {slices.map((slice) => (
                <Circle
                  key={slice.categoryName}
                  cx={PIE_SIZE / 2}
                  cy={PIE_SIZE / 2}
                  r={PIE_RADIUS}
                  stroke={slice.color}
                  strokeWidth={PIE_STROKE_WIDTH}
                  strokeLinecap="butt"
                  fill="none"
                  strokeDasharray={slice.dashArray}
                  strokeDashoffset={slice.dashOffset}
                  originX={PIE_SIZE / 2}
                  originY={PIE_SIZE / 2}
                  rotation={-90}
                />
              ))}
            </Svg>
          </View>

          <Text className="mt-3 text-center text-xs font-semibold uppercase tracking-[2px] text-ink/55">
            Total {selectedType}
          </Text>
          <Text className="mt-1 text-center text-2xl font-black text-ink">
            {formatCurrency(totalAmount, currency, { type: selectedType })}
          </Text>

          <View className="mt-5 gap-2">
            {slices.map((slice) => (
              <View
                key={`${selectedType}-${slice.categoryName}`}
                className="flex-row items-center justify-between gap-3 rounded-xl bg-mist px-3 py-2"
              >
                <View className="flex-1 flex-row items-center gap-2">
                  <View
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="flex-1 text-sm font-semibold text-ink"
                  >
                    {slice.categoryName}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-bold text-ink">
                    {formatCurrency(slice.totalAmount, currency, {
                      type: selectedType,
                    })}
                  </Text>
                  <Text className="text-xs text-ink/60">
                    {(slice.ratio * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {!isLoading && !errorMessage && slices.length === 0 ? (
        <Text className="mt-5 text-sm text-ink/70">
          No {selectedType} transactions for this month yet.
        </Text>
      ) : null}
    </View>
  );
}

function RecentTransactionsSection({
  transactions,
  currency,
}: {
  transactions: RecentSheetTransaction[];
  currency: string | null;
}) {
  return (
    <View>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-xl font-bold text-ink">Recent Transactions</Text>
        <Button size="sm" variant="outline" label="View All" />
      </View>

      <View className="mt-5 rounded-2xl border border-black/10 bg-white shadow-card">
        {transactions.map((transaction, index) => (
          <View key={transaction.id}>
            <View className="flex-row items-center gap-3 px-4 py-3">
              <TransactionCategoryIcon
                icon={transaction.categoryIcon}
                type={transaction.type}
              />

              <View className="flex-1">
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-sm font-semibold text-ink"
                >
                  {transaction.description?.trim() ||
                    transaction.categoryName ||
                    "Untitled transaction"}
                </Text>

                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="mt-1 text-xs text-ink/60"
                >
                  <Text className="capitalize">{transaction.type}</Text>{" "}
                  {"\u2022"} {formatDate(transaction.date)}
                </Text>

                <View className="mt-2 flex-row items-center gap-2">
                  <UserAvatar
                    size={16}
                    name={transaction.creatorName}
                    avatarUrl={transaction.creatorAvatarUrl}
                    email={transaction.creatorEmail}
                  />
                  <Text className="text-xs text-ink/60">
                    {transaction.creatorName?.trim() ||
                      transaction.creatorEmail?.trim() ||
                      "Unknown user"}
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text
                  className={`text-right text-base font-bold ${
                    transaction.type === "income"
                      ? "text-primary"
                      : "text-danger"
                  }`}
                >
                  {formatCurrency(transaction.amount, currency, {
                    type: transaction.type,
                  })}
                </Text>
              </View>
            </View>

            {index < transactions.length - 1 ? (
              <View className="h-px bg-black/10" />
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function SheetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ sheetId?: string | string[] }>();
  const sheetId = toSheetId(params.sheetId);
  const { session } = useSession();
  const userId = session?.user.id;

  const { data: sheets = [] } = useUserSheetsQuery(userId);
  const selectedSheet = sheets.find((sheet) => sheet.id === sheetId);

  const {
    data: currentMonthTotals,
    isLoading: isMonthTotalsLoading,
    error: monthTotalsError,
  } = useCurrentMonthSheetTotalsQuery(sheetId);
  const {
    data: currentMonthCategoryTotals,
    isLoading: isMonthCategoryTotalsLoading,
    error: monthCategoryTotalsError,
  } = useCurrentMonthSheetCategoryTotalsQuery(sheetId);

  const {
    data: recentTransactions = [],
    isLoading: isRecentTransactionsLoading,
    error: recentTransactionsError,
  } = useRecentSheetTransactionsQuery(sheetId, 5);
  const { data: currency = null } = useSheetCurrencyQuery(sheetId);
  const [selectedPieType, setSelectedPieType] = useState<"income" | "expense">(
    "income",
  );

  return (
    <>
      <Stack.Screen options={{ title: selectedSheet?.name ?? "Sheet" }} />
      <SafeAreaView edges={["top"]} className="flex-1 bg-canvas">
        <View className="px-6 pb-3 pt-2">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-3">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-xs font-semibold uppercase tracking-[3px] text-primary"
              >
                {selectedSheet?.name ?? "Selected Sheet"}
              </Text>
              <Text className="text-2xl font-black text-ink">Dashboard</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                label="Sheet"
                onPress={() => router.push("/(app)/")}
              />
              <Button
                size="sm"
                variant="ink"
                label="Sign out"
                onPress={signOut}
              />
            </View>
          </View>
        </View>

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 24,
            gap: 16,
          }}
          className="flex-1"
        >
          <CurrentMonthSummaryCard
            incomeTotal={currentMonthTotals?.incomeTotal ?? 0}
            expenseTotal={currentMonthTotals?.expenseTotal ?? 0}
            currency={currency}
            isLoading={isMonthTotalsLoading}
            errorMessage={
              monthTotalsError instanceof Error
                ? monthTotalsError.message
                : monthTotalsError
                  ? "Unable to load monthly totals."
                  : null
            }
          />

          <MonthlyCategoryPieSection
            selectedType={selectedPieType}
            onSelectType={setSelectedPieType}
            chartData={
              selectedPieType === "income"
                ? currentMonthCategoryTotals?.income ?? []
                : currentMonthCategoryTotals?.expense ?? []
            }
            currency={currency}
            isLoading={isMonthCategoryTotalsLoading}
            errorMessage={
              monthCategoryTotalsError instanceof Error
                ? monthCategoryTotalsError.message
                : monthCategoryTotalsError
                  ? "Unable to load monthly chart data."
                  : null
            }
          />

          {isRecentTransactionsLoading ? (
            <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <View className="flex-row items-center gap-3">
                <ActivityIndicator color="#166534" />
                <Text className="text-base text-ink/70">
                  Loading recent transactions...
                </Text>
              </View>
            </View>
          ) : null}

          {recentTransactionsError ? (
            <Text className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
              {recentTransactionsError instanceof Error
                ? recentTransactionsError.message
                : "Unable to load recent transactions."}
            </Text>
          ) : null}

          {!isRecentTransactionsLoading &&
          !recentTransactionsError &&
          recentTransactions.length > 0 ? (
            <RecentTransactionsSection
              transactions={recentTransactions}
              currency={currency}
            />
          ) : null}

          {!isRecentTransactionsLoading &&
          !recentTransactionsError &&
          recentTransactions.length === 0 ? (
            <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <Text className="text-lg font-bold text-ink">
                Recent Transactions
              </Text>
              <Text className="mt-2 text-base leading-6 text-ink/70">
                No transactions have been added to this sheet yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { signOut } from "@/src/lib/auth-requests";
import type { RecentSheetTransaction } from "@/src/lib/transactions-utils";
import { useSession } from "@/src/providers/SessionProvider";
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
    <View className="overflow-hidden rounded-[28px] shadow-card">
      <LinearGradient
        colors={["#0f1319", "#1c2430", "#2f3d4f", "#161d27"]}
        locations={[0, 0.35, 0.62, 1]}
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
            <View className="flex-1 rounded-2xl bg-white/10 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/65">
                Income
              </Text>
              <Text className="mt-2 text-2xl font-black text-primary">
                {formatCurrency(incomeTotal, currency)}
              </Text>
            </View>

            <View className="flex-1 rounded-2xl bg-white/10 p-4">
              <Text className="text-xs font-semibold uppercase tracking-[2px] text-white/65">
                Expenses
              </Text>
              <Text className="mt-2 text-2xl font-black text-danger">
                {formatCurrency(expenseTotal, currency)}
              </Text>
            </View>
          </View>
        ) : null}
      </View>
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
    data: recentTransactions = [],
    isLoading: isRecentTransactionsLoading,
    error: recentTransactionsError,
  } = useRecentSheetTransactionsQuery(sheetId, 5);
  const { data: currency = null } = useSheetCurrencyQuery(sheetId);

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

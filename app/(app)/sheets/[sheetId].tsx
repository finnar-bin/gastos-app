import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signOut } from "@/src/lib/auth-requests";
import type { RecentSheetTransaction } from "@/src/lib/transactions-utils";
import { useSession } from "@/src/providers/session-provider";
import { useRecentSheetTransactionsQuery } from "@/src/queries/use-recent-sheet-transactions-query";
import { useSheetCurrencyQuery } from "@/src/queries/use-sheet-currency-query";
import { useUserSheetsQuery } from "@/src/queries/use-user-sheets-query";
import { Button } from "@/src/ui/button";
import { TransactionCategoryIcon } from "@/src/ui/transaction-category-icon";
import { UserAvatar } from "@/src/ui/user-avatar";
import { formatAmount } from "@/src/utils/format-amount";
import { formatDate } from "@/src/utils/format-date";

function toSheetId(sheetIdParam: string | string[] | undefined) {
  if (Array.isArray(sheetIdParam)) {
    return sheetIdParam[0];
  }

  return sheetIdParam;
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
                  <Text className="capitalize">{transaction.type}</Text> {"\u2022"}{" "}
                  {formatDate(transaction.date)}
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
                    transaction.type === "income" ? "text-primary" : "text-danger"
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.type, currency)}
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
    data: recentTransactions = [],
    isLoading,
    error,
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
          {isLoading ? (
            <View className="rounded-[28px] border border-black/5 bg-mist p-6 shadow-card">
              <View className="flex-row items-center gap-3">
                <ActivityIndicator color="#166534" />
                <Text className="text-base text-ink/70">
                  Loading recent transactions...
                </Text>
              </View>
            </View>
          ) : null}

          {error ? (
            <Text className="rounded-2xl bg-danger/10 p-4 text-sm text-danger">
              {error instanceof Error
                ? error.message
                : "Unable to load recent transactions."}
            </Text>
          ) : null}

          {!isLoading && !error && recentTransactions.length > 0 ? (
            <RecentTransactionsSection
              transactions={recentTransactions}
              currency={currency}
            />
          ) : null}

          {!isLoading && !error && recentTransactions.length === 0 ? (
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

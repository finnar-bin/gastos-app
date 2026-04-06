import { useQuery } from "@tanstack/react-query";

import { getSheetTransactionOverview } from "@/src/lib/transactions-requests";

export function useSheetTransactionOverviewQuery(
  sheetId: string | undefined,
  targetYear: number,
  targetMonth: number,
  targetType: "income" | "expense",
) {
  return useQuery({
    queryKey: [
      "sheet-transaction-overview",
      sheetId,
      targetYear,
      targetMonth,
      targetType,
    ],
    queryFn: () =>
      getSheetTransactionOverview(sheetId!, targetYear, targetMonth, targetType),
    enabled: Boolean(sheetId && Number.isFinite(targetYear) && Number.isFinite(targetMonth)),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

import { useQuery } from "@tanstack/react-query";

import { getRecentSheetTransactions } from "@/src/lib/transactions-requests";

export function useRecentSheetTransactionsQuery(
  sheetId: string | undefined,
  limit = 5,
) {
  return useQuery({
    queryKey: ["recent-sheet-transactions", sheetId, limit],
    queryFn: () => getRecentSheetTransactions(sheetId!, limit),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

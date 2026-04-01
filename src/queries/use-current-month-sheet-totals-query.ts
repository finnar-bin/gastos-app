import { useQuery } from "@tanstack/react-query";

import { getCurrentMonthSheetTotals } from "@/src/lib/transactions-requests";

export function useCurrentMonthSheetTotalsQuery(sheetId: string | undefined) {
  return useQuery({
    queryKey: ["current-month-sheet-totals", sheetId],
    queryFn: () => getCurrentMonthSheetTotals(sheetId!),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

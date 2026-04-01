import { useQuery } from "@tanstack/react-query";

import { getCurrentMonthSheetCategoryTotals } from "@/src/lib/transactions-requests";

export function useCurrentMonthSheetCategoryTotalsQuery(
  sheetId: string | undefined,
) {
  return useQuery({
    queryKey: ["current-month-sheet-category-totals", sheetId],
    queryFn: () => getCurrentMonthSheetCategoryTotals(sheetId!),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

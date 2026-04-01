import { useQuery } from "@tanstack/react-query";

import { getSheetCurrency } from "@/src/lib/sheet-settings-requests";

export function useSheetCurrencyQuery(sheetId: string | undefined) {
  return useQuery({
    queryKey: ["sheet-currency", sheetId],
    queryFn: () => getSheetCurrency(sheetId!),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

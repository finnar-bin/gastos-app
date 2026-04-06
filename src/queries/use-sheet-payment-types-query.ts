import { useQuery } from "@tanstack/react-query";

import { getSheetPaymentTypes } from "@/src/lib/transaction-form-requests";

export function useSheetPaymentTypesQuery(sheetId: string | undefined) {
  return useQuery({
    queryKey: ["sheet-payment-types", sheetId],
    queryFn: () => getSheetPaymentTypes(sheetId!),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

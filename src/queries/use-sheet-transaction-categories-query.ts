import { useQuery } from "@tanstack/react-query";

import {
  getSheetTransactionCategories,
  type TransactionType,
} from "@/src/lib/transaction-form-requests";

export function useSheetTransactionCategoriesQuery(
  sheetId: string | undefined,
  transactionType: TransactionType,
) {
  return useQuery({
    queryKey: ["sheet-transaction-categories", sheetId, transactionType],
    queryFn: () => getSheetTransactionCategories(sheetId!, transactionType),
    enabled: Boolean(sheetId),
    refetchOnMount: "always",
    refetchOnReconnect: true,
  });
}

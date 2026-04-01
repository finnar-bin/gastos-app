import { mapRecentSheetTransactions } from "@/src/lib/transactions-utils";
import { supabase } from "@/src/lib/supabase";

export async function getRecentSheetTransactions(
  sheetId: string,
  limit = 5,
) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, amount, type, description, date, category:categories!transactions_category_id_categories_id_fk(name)",
    )
    .eq("sheet_id", sheetId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return mapRecentSheetTransactions((data ?? []) as unknown[]);
}

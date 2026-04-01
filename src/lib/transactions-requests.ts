import {
  mapRecentSheetTransactions,
  type CreatorProfile,
  sumMonthlySheetCategoryTotals,
  sumMonthlySheetTotals,
} from "@/src/lib/transactions-utils";
import { supabase } from "@/src/lib/supabase";

function toDateOnlyValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getRecentSheetTransactions(sheetId: string, limit = 5) {
  const { data, error } = await supabase
    .from("transactions")
    .select(
      "id, amount, type, description, date, created_by, category:categories!transactions_category_id_categories_id_fk(name, icon)",
    )
    .eq("sheet_id", sheetId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  const transactionRows = (data ?? []) as Array<{ created_by: string }>;
  const creatorIds = Array.from(
    new Set(transactionRows.map((row) => row.created_by).filter(Boolean)),
  );

  let creatorProfilesById: Record<string, CreatorProfile> = {};

  if (creatorIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")
      .in("id", creatorIds);

    if (profilesError) {
      throw profilesError;
    }

    creatorProfilesById = ((profiles ?? []) as CreatorProfile[]).reduce<
      Record<string, CreatorProfile>
    >((accumulator, profile) => {
      accumulator[profile.id] = profile;
      return accumulator;
    }, {});
  }

  return mapRecentSheetTransactions(
    (data ?? []) as unknown[],
    creatorProfilesById,
  );
}

export async function getCurrentMonthSheetTotals(sheetId: string) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("sheet_id", sheetId)
    .gte("date", toDateOnlyValue(monthStart))
    .lte("date", toDateOnlyValue(monthEnd));

  if (error) {
    throw error;
  }

  return sumMonthlySheetTotals((data ?? []) as unknown[]);
}

export async function getCurrentMonthSheetCategoryTotals(sheetId: string) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const { data, error } = await supabase
    .from("transactions")
    .select(
      "amount, type, category:categories!transactions_category_id_categories_id_fk(name)",
    )
    .eq("sheet_id", sheetId)
    .gte("date", toDateOnlyValue(monthStart))
    .lte("date", toDateOnlyValue(monthEnd));

  if (error) {
    throw error;
  }

  return sumMonthlySheetCategoryTotals((data ?? []) as unknown[]);
}

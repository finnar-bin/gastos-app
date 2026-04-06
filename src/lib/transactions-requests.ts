import {
  mapRecentSheetTransactions,
  type CreatorProfile,
  type RecentSheetTransaction,
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

  return mapRecentSheetTransactions((data ?? []) as unknown[], creatorProfilesById);
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
      "amount, type, category_id, category:categories!transactions_category_id_categories_id_fk(name)",
    )
    .eq("sheet_id", sheetId)
    .gte("date", toDateOnlyValue(monthStart))
    .lte("date", toDateOnlyValue(monthEnd));

  if (error) {
    throw error;
  }

  return sumMonthlySheetCategoryTotals((data ?? []) as unknown[]);
}

export type SheetTransactionOverviewCategory = {
  categoryId: string;
  categoryName: string;
  categoryIcon: string | null;
  categoryType: RecentSheetTransaction["type"];
  budget: number | null;
  totalAmount: number;
};

export async function getSheetTransactionOverview(
  sheetId: string,
  targetYear: number,
  targetMonth: number,
  targetType: RecentSheetTransaction["type"],
) {
  const { data, error } = await supabase.rpc("transaction_overview", {
    target_sheet_id: sheetId,
    target_year: targetYear,
    target_month: targetMonth - 1,
    target_type: targetType,
  });

  if (error) {
    throw error;
  }

  const rows = (data ?? []) as Array<{
    category_id: string;
    category_name: string;
    category_icon: string | null;
    category_type: RecentSheetTransaction["type"];
    budget: number | string | null;
    total_amount: number | string;
  }>;

  return rows.map((row) => {
    const totalAmount = Number(row.total_amount);
    const budgetAmount =
      row.budget === null || row.budget === undefined ? null : Number(row.budget);

    return {
      categoryId: row.category_id,
      categoryName: row.category_name,
      categoryIcon: row.category_icon,
      categoryType: row.category_type,
      budget: budgetAmount !== null && Number.isFinite(budgetAmount) ? budgetAmount : null,
      totalAmount: Number.isFinite(totalAmount) ? totalAmount : 0,
    } satisfies SheetTransactionOverviewCategory;
  });
}

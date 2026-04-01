import {
  mapRecentSheetTransactions,
  type CreatorProfile,
} from "@/src/lib/transactions-utils";
import { supabase } from "@/src/lib/supabase";

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

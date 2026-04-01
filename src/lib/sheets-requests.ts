import { supabase } from "@/src/lib/supabase";
import { mapSheetUsersRows } from "@/src/lib/sheets-utils";

export async function getUserSheets(userId: string) {
  const { data, error } = await supabase
    .from("sheet_users")
    .select(
      "role, sheet:sheets!sheet_users_sheet_id_sheets_id_fk(id, name, description)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) {
    throw error;
  }

  return mapSheetUsersRows((data ?? []) as unknown[]);
}

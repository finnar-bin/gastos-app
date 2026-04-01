import { supabase } from "@/src/lib/supabase";

export async function getSheetCurrency(sheetId: string) {
  const { data, error } = await supabase
    .from("sheet_settings")
    .select("currency")
    .eq("sheet_id", sheetId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.currency ?? null;
}

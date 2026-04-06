import { supabase } from "@/src/lib/supabase";

export type TransactionType = "income" | "expense";

export type TransactionCategoryOption = {
  id: string;
  name: string;
  icon: string;
  type: TransactionType;
  default_amount: number | string | null;
};

export type PaymentTypeOption = {
  id: string;
  name: string;
  icon: string;
};

export type CreateSheetTransactionInput = {
  sheetId: string;
  createdBy: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  paymentTypeId: string | null;
  description: string | null;
};

export async function getSheetTransactionCategories(
  sheetId: string,
  transactionType: TransactionType,
) {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, icon, type, default_amount")
    .eq("sheet_id", sheetId)
    .eq("type", transactionType)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as TransactionCategoryOption[];
}

export async function getSheetPaymentTypes(sheetId: string) {
  const { data, error } = await supabase
    .from("payment_types")
    .select("id, name, icon")
    .eq("sheet_id", sheetId)
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as PaymentTypeOption[];
}

export async function createSheetTransaction(input: CreateSheetTransactionInput) {
  const { error } = await supabase.from("transactions").insert({
    sheet_id: input.sheetId,
    created_by: input.createdBy,
    amount: input.amount,
    type: input.type,
    date: input.date,
    category_id: input.categoryId,
    payment_type_id: input.paymentTypeId,
    description: input.description,
  });

  if (error) {
    throw error;
  }
}

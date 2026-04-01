export type RecentSheetTransaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  categoryName: string | null;
};

type RecentTransactionRow = {
  id: string;
  amount: number | string;
  type: RecentSheetTransaction["type"];
  description: string | null;
  date: string;
  category:
    | {
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

function toCategoryName(category: RecentTransactionRow["category"]) {
  if (!category) {
    return null;
  }

  if (Array.isArray(category)) {
    return category[0]?.name ?? null;
  }

  return category.name;
}

function toAmount(rawAmount: number | string) {
  const parsedAmount = Number(rawAmount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
}

export function mapRecentSheetTransactions(
  data: unknown[] | null,
): RecentSheetTransaction[] {
  const rows = data ?? [];

  return rows.map((row) => {
    const typedRow = row as RecentTransactionRow;

    return {
      id: typedRow.id,
      amount: toAmount(typedRow.amount),
      type: typedRow.type,
      description: typedRow.description,
      date: typedRow.date,
      categoryName: toCategoryName(typedRow.category),
    };
  });
}

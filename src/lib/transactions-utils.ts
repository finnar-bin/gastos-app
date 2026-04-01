export type RecentSheetTransaction = {
  id: string;
  amount: number;
  type: "income" | "expense";
  description: string | null;
  date: string;
  categoryName: string | null;
  categoryIcon: string | null;
  creatorName: string | null;
  creatorAvatarUrl: string | null;
  creatorEmail: string | null;
};

export type CreatorProfile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

type RecentTransactionRow = {
  id: string;
  amount: number | string;
  type: RecentSheetTransaction["type"];
  description: string | null;
  date: string;
  created_by: string;
  category:
    | {
        name: string;
        icon: string;
      }
    | {
        name: string;
        icon: string;
      }[]
    | null;
};

function toCategory(category: RecentTransactionRow["category"]) {
  if (!category) {
    return { name: null, icon: null };
  }

  if (Array.isArray(category)) {
    return {
      name: category[0]?.name ?? null,
      icon: category[0]?.icon ?? null,
    };
  }

  return { name: category.name, icon: category.icon };
}

function toAmount(rawAmount: number | string) {
  const parsedAmount = Number(rawAmount);
  return Number.isFinite(parsedAmount) ? parsedAmount : 0;
}

export function mapRecentSheetTransactions(
  data: unknown[] | null,
  creatorProfilesById: Record<string, CreatorProfile>,
): RecentSheetTransaction[] {
  const rows = data ?? [];

  return rows.map((row) => {
    const typedRow = row as RecentTransactionRow;
    const category = toCategory(typedRow.category);
    const creator = creatorProfilesById[typedRow.created_by];

    return {
      id: typedRow.id,
      amount: toAmount(typedRow.amount),
      type: typedRow.type,
      description: typedRow.description,
      date: typedRow.date,
      categoryName: category.name,
      categoryIcon: category.icon,
      creatorName: creator?.display_name ?? null,
      creatorAvatarUrl: creator?.avatar_url ?? null,
      creatorEmail: creator?.email ?? null,
    };
  });
}

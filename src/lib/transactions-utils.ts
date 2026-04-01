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

export type MonthlySheetTotals = {
  incomeTotal: number;
  expenseTotal: number;
};

export type MonthlyCategoryTotal = {
  categoryName: string;
  totalAmount: number;
};

export type MonthlySheetCategoryTotals = {
  income: MonthlyCategoryTotal[];
  expense: MonthlyCategoryTotal[];
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

type MonthlyTransactionRow = {
  amount: number | string;
  type: "income" | "expense";
};

type MonthlyCategoryTransactionRow = {
  amount: number | string;
  type: "income" | "expense";
  category:
    | {
        name: string;
      }
    | {
        name: string;
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

function toCategoryName(category: MonthlyCategoryTransactionRow["category"]) {
  if (!category) {
    return "Uncategorized";
  }

  if (Array.isArray(category)) {
    return category[0]?.name?.trim() || "Uncategorized";
  }

  return category.name?.trim() || "Uncategorized";
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

export function sumMonthlySheetTotals(
  data: unknown[] | null,
): MonthlySheetTotals {
  const rows = (data ?? []) as MonthlyTransactionRow[];

  return rows.reduce<MonthlySheetTotals>(
    (accumulator, row) => {
      const amount = toAmount(row.amount);

      if (row.type === "income") {
        accumulator.incomeTotal += amount;
        return accumulator;
      }

      accumulator.expenseTotal += amount;
      return accumulator;
    },
    { incomeTotal: 0, expenseTotal: 0 },
  );
}

export function sumMonthlySheetCategoryTotals(
  data: unknown[] | null,
): MonthlySheetCategoryTotals {
  const rows = (data ?? []) as MonthlyCategoryTransactionRow[];
  const incomeCategoryTotals = new Map<string, number>();
  const expenseCategoryTotals = new Map<string, number>();

  rows.forEach((row) => {
    const amount = toAmount(row.amount);
    const categoryName = toCategoryName(row.category);

    if (row.type === "income") {
      incomeCategoryTotals.set(
        categoryName,
        (incomeCategoryTotals.get(categoryName) ?? 0) + amount,
      );
      return;
    }

    expenseCategoryTotals.set(
      categoryName,
      (expenseCategoryTotals.get(categoryName) ?? 0) + amount,
    );
  });

  const toSortedTotals = (source: Map<string, number>) =>
    Array.from(source.entries())
      .map(([categoryName, totalAmount]) => ({ categoryName, totalAmount }))
      .sort((first, second) => second.totalAmount - first.totalAmount);

  return {
    income: toSortedTotals(incomeCategoryTotals),
    expense: toSortedTotals(expenseCategoryTotals),
  };
}

export type UserSheet = {
  id: string;
  name: string;
  description: string | null;
  role: "viewer" | "editor" | "admin";
};

type SheetUserRow = {
  role: UserSheet["role"];
  sheet: {
    id: string;
    name: string;
    description: string | null;
  } | null;
};

function toUserSheet(row: SheetUserRow): UserSheet | null {
  const sheet = row.sheet;
  if (!sheet) {
    return null;
  }

  return {
    id: sheet.id,
    name: sheet.name,
    description: sheet.description,
    role: row.role,
  };
}

export function mapSheetUsersRows(data: unknown[] | null): UserSheet[] {
  const rows = data ?? [];

  return rows.reduce<UserSheet[]>((accumulator, row) => {
    const typedRow = row as {
      role: UserSheet["role"];
      sheet: SheetUserRow["sheet"] | SheetUserRow["sheet"][];
    };

    if (Array.isArray(typedRow.sheet)) {
      throw new Error(
        "Unexpected sheet join payload: expected object, received array.",
      );
    }

    const userSheet = toUserSheet({
      role: typedRow.role,
      sheet: typedRow.sheet,
    });

    if (!userSheet) {
      return accumulator;
    }

    accumulator.push(userSheet);
    return accumulator;
  }, []);
}

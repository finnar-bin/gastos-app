type CurrencyFormatType = "income" | "expense";

type FormatCurrencyOptions = {
  type?: CurrencyFormatType;
};

export function formatCurrency(
  amount: number,
  currency: string | null,
  options?: FormatCurrencyOptions,
) {
  const sign = options?.type
    ? options.type === "income"
      ? "+"
      : "-"
    : "";
  const absoluteAmount = Math.abs(amount);

  if (currency) {
    try {
      return `${sign}${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(absoluteAmount)}`;
    } catch {
      // Fall through when the provided currency is not a valid ISO code.
    }
  }

  return `${sign}${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(absoluteAmount)}`;
}

export function toSheetId(sheetIdParam: string | string[] | undefined) {
  if (Array.isArray(sheetIdParam)) {
    return sheetIdParam[0];
  }

  return sheetIdParam;
}

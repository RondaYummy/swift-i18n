export function escapeHtml(rawText: string): string {
  return rawText
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function escapeParams(vars: Record<string, any>): Record<string, any> {
  const escaped: Record<string, any> = {};
  Object.entries(vars).forEach(([key, value]) => {
    if (typeof value === "string") {
      escaped[key] = escapeHtml(value);
    } else {
      escaped[key] = value;
    }
  });
  return escaped;
}

export function formatTextToList(input: string | null | undefined): string[] | null {
  if (input == null) return null;
  const text = String(input).trim();
  if (!text) return null;
  const parts = text
    .split(/\r?\n|;|,/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.length ? parts : null;
}

export function cleanText(input: string | null | undefined): string {
  if (input == null) return '';
  return String(input).replace(/\s+/g, ' ').trim();
}

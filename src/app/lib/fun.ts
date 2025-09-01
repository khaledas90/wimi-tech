export function toArabicFullDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("ar-EG", {
    weekday: undefined,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatEgyptPhone(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("20") === false) digits = "20" + digits;
  const withPlus = "+" + digits;
  return (
    withPlus.replace(/^(\+\d{2})(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3 $4") ||
    withPlus
  );
}

export function initials(first: string, last: string) {
  const f = first?.[0] ?? "";
  const l = last?.[0] ?? "";
  return (f + l).toUpperCase();
}

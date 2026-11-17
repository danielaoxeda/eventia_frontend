export function formatThousands(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatCurrency(value: number): string {
  return `S/ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    return `S/ ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return `S/ ${value}`;
}

export function formatPercentageChange(value: number): string {
  const rounded = Number(value.toFixed(1));
  if (rounded > 0) return `+${rounded}%`;
  return `${rounded}%`;
}

export function calculatePercentage(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export function getLimaCurrentTime(): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "America/Lima",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const timeString = new Intl.DateTimeFormat("es-PE", options).format(new Date());
  return `${timeString} (PET - UTC-5)`;
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

export function formatDate(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(isoDateTime: string): string {
  if (!isoDateTime) return "—";
  return isoDateTime.replace("T", " ").slice(0, 19);
}

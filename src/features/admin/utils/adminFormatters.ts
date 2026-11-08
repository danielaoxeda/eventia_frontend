/**
 * Formatea un número entero con separador de miles / 3842 -> "3,842"
 */
export function formatThousands(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Formatea un monto monetario en soles (PEN) / 15420.5 -> "S/ 15,420.50"
 */
export function formatCurrency(value: number): string {
  return `S/ ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Formato compacto para ejes y etiquetas de gráficos numéricos / 1100 -> "1.1k"
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
}

/**
 * Formato compacto monetario para ejes de gráficos de ingresos / 12500 -> "S/ 12.5k"
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    return `S/ ${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return `S/ ${value}`;
}

/**
 * Formatea una variación porcentual / 12.4 -> "+12.4%", -3.5 -> "-3.5%"
 */
export function formatPercentageChange(value: number): string {
  const rounded = Number(value.toFixed(1));
  if (rounded > 0) return `+${rounded}%`;
  return `${rounded}%`;
}

/**
 * Calcula porcentaje de ocupación o aforo
 */
export function calculatePercentage(current: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

/**
 * Retorna la hora actual en zona horaria de Perú (UTC-5) / "14:32:08 (PET - UTC-5)"
 */
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

/**
 * Calcula las iniciales visuales de una persona / "Mario", "Vargas Llosa" -> "MV"
 */
export function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0);
  const last = lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase();
}

/**
 * Formatea un LocalDateTime ISO a fecha corta / "2024-01-14T10:30:00" -> "14/01/2024"
 */
export function formatDate(isoDateTime: string): string {
  const date = new Date(isoDateTime);
  if (Number.isNaN(date.getTime())) return isoDateTime;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * Formatea un LocalDateTime ISO a fecha y hora / "2024-04-10T11:22:15" -> "2024-04-10 11:22:15"
 */
export function formatDateTime(isoDateTime: string): string {
  if (!isoDateTime) return "—";
  return isoDateTime.replace("T", " ").slice(0, 19);
}

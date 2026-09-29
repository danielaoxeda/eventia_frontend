/**
 * Formatea un monto numérico a moneda peruana (Soles PEN) / 142850 -> "S/ 142,850.00"
 */
export function formatPEN(amount: number): string {
  return (
    "S/ " +
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

/**
 * Formatea un número entero con separador de miles / 3842 -> "3,842"
 */
export function formatThousands(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Formato compacto para ejes y badges de gráficos /  1100 -> "1.1k"
 */
export function formatCompactNumber(value: number): string {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}k`;
  }
  return value.toString();
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

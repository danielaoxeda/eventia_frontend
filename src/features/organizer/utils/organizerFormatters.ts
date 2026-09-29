import type { EventStatus } from "../types/organizer.types";

export function formatPEN(amount: number, includeDecimals = true): string {
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-PE").format(value);
}

export function formatDate(dateString: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-PE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function calculateOccupancy(sold: number, capacity: number): number {
  if (!capacity || capacity <= 0) return 0;
  return Math.min(100, Math.round((sold / capacity) * 100));
}

export function formatPercentageChange(value: number): {
  formatted: string;
  isPositive: boolean;
  isNeutral: boolean;
} {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  const sign = isPositive ? "+" : "";
  return {
    formatted: `${sign}${value.toFixed(1)}%`,
    isPositive,
    isNeutral,
  };
}

export function getStatusConfig(status: EventStatus, active = true) {
  if (!active || status === "inactive") {
    return {
      label: "Inactivo (RN04)",
      badgeClass: "bg-surface-container text-outline border border-outline-variant/30",
      dotClass: "bg-outline",
    };
  }

  switch (status) {
    case "published":
      return {
        label: "Activo / En Venta",
        badgeClass: "bg-primary-fixed text-on-primary-fixed font-semibold",
        dotClass: "bg-primary animate-pulse",
      };
    case "almost_sold_out":
      return {
        label: "Casi Agotado",
        badgeClass: "bg-secondary-fixed text-on-secondary-fixed font-semibold",
        dotClass: "bg-secondary",
      };
    case "sold_out":
      return {
        label: "Agotado",
        badgeClass: "bg-error-container text-on-error-container font-semibold",
        dotClass: "bg-error",
      };
    case "hidden":
      return {
        label: "Oculto",
        badgeClass: "bg-surface-container-high text-on-surface-variant font-medium",
        dotClass: "bg-outline",
      };
    case "draft":
    default:
      return {
        label: "Borrador",
        badgeClass: "bg-surface-container text-on-surface-variant font-medium",
        dotClass: "bg-outline",
      };
  }
}

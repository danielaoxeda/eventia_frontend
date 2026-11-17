import type { ReactNode } from "react";
import {
  Minus,
  ReceiptText,
  Ticket,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Wallet,
} from "lucide-react";
import type { DashboardKpiResponse, KpiMetric } from "../types/admin.types";
import {
  formatCurrency,
  formatPercentageChange,
  formatThousands,
} from "../utils/adminFormatters";

type KpiKey = keyof DashboardKpiResponse;

interface KpiCardProps {
  kind: KpiKey;
  metric: KpiMetric;
}

const KPI_CONFIG: Record<
  KpiKey,
  {
    label: string;
    icon: ReactNode;
    iconBg: string;
    formatValue: (value: number) => string;
  }
> = {
  totalRevenue: {
    label: "INGRESOS TOTALES",
    icon: <Wallet className="w-5 h-5 text-primary" />,
    iconBg: "bg-primary-fixed/40 border border-primary-fixed",
    formatValue: formatCurrency,
  },
  processedOrders: {
    label: "ÓRDENES PROCESADAS",
    icon: <ReceiptText className="w-5 h-5 text-indigo-600" />,
    iconBg: "bg-surface-variant/70 border border-surface-variant",
    formatValue: formatThousands,
  },
  issuedTickets: {
    label: "TICKETS EMITIDOS",
    icon: <Ticket className="w-5 h-5 text-tertiary" />,
    iconBg: "bg-tertiary-container/20 border border-tertiary-container/30",
    formatValue: formatThousands,
  },
  activeOrganizers: {
    label: "ORGANIZADORES ACTIVOS",
    icon: <UserCheck className="w-5 h-5 text-secondary" />,
    iconBg: "bg-secondary-fixed/50 border border-secondary-fixed",
    formatValue: formatThousands,
  },
};

export default function KpiCard({ kind, metric }: KpiCardProps) {
  const config = KPI_CONFIG[kind];
  const isPositive = metric.percentageChange > 0;
  const isNegative = metric.percentageChange < 0;

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-display">
          {config.label}
        </span>
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.iconBg}`}
        >
          {config.icon}
        </div>
      </div>

      <div className="my-1">
        <h3 className="font-display font-extrabold text-2xl lg:text-3xl text-on-surface tracking-tight">
          {config.formatValue(metric.value)}
        </h3>
      </div>

      <div className="mt-3 min-h-6 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isPositive
              ? "bg-green-50 text-green-700 border border-green-200"
              : isNegative
                ? "bg-error-container/30 text-error border border-error-container"
                : "bg-surface-container text-on-surface-variant border border-outline-variant/30"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : isNegative ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
          {formatPercentageChange(metric.percentageChange)}
        </span>

        <span className="text-[11px] text-on-surface-variant font-medium">
          vs. {config.formatValue(metric.previousMonthValue)} mes ant.
        </span>
      </div>
    </div>
  );
}

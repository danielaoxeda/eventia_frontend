import type { ReactNode } from "react";
import { formatPercentageChange } from "../../utils/organizerFormatters";

interface KpiCardProps {
  label: string;
  value: string | number;
  iconName: string;
  changeValue?: number | null;
  changePeriod?: string;
  progressBar?: {
    current: number;
    max: number;
    percentage: number;
    label?: string;
  };
  highlight?: boolean;
  currencyHighlight?: boolean;
  extraContent?: ReactNode;
}

export default function KpiCard({
  label,
  value,
  iconName,
  changeValue,
  changePeriod = "vs mes anterior",
  progressBar,
  highlight = false,
  currencyHighlight = false,
  extraContent,
}: KpiCardProps) {
  const trend = changeValue !== undefined && changeValue !== null ? formatPercentageChange(changeValue) : null;

  return (
    <div
      className={`relative overflow-hidden bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/20 flex flex-col justify-between transition-all hover:shadow-md ${highlight ? "ring-1 ring-primary/20" : ""
        }`}
    >
      {highlight && (
        <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 bg-primary-fixed/40 rounded-full blur-xl" />
      )}

      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[0.6875rem] font-bold text-outline uppercase tracking-wider">
            {label}
          </span>
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">{iconName}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-1">
          <span
            className={`font-display text-2xl lg:text-3xl font-bold tracking-tight ${currencyHighlight ? "text-primary" : "text-on-surface"
              }`}
          >
            {value}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-surface-container flex flex-col gap-2">
        {trend && (
          <div className="flex items-center gap-1.5 text-xs">
            <span
              className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded font-bold ${trend.isPositive
                ? "bg-primary-fixed text-on-primary-fixed"
                : trend.isNeutral
                  ? "bg-surface-container text-on-surface-variant"
                  : "bg-error-container text-on-error-container"
                }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {trend.isPositive ? "trending_up" : "trending_down"}
              </span>
              {trend.formatted}
            </span>
            <span className="text-outline text-[0.75rem]">{changePeriod}</span>
          </div>
        )}

        {progressBar && (
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex justify-between text-xs font-medium text-on-surface-variant">
              <span>{progressBar.label || "Ocupación global"}</span>
              <span className="font-bold text-primary">{progressBar.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, progressBar.percentage)}%` }}
              />
            </div>
          </div>
        )}

        {extraContent}
      </div>
    </div>
  );
}

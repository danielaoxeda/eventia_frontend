import { ReceiptText, Ticket, Users, Wallet } from "lucide-react";
import type { KpiMetric } from "../types/admin.types";

interface KpiCardProps {
  metric: KpiMetric;
}

export default function KpiCard({ metric }: KpiCardProps) {
  const getIcon = () => {
    switch (metric.iconName) {
      case "wallet":
        return <Wallet className="w-5 h-5 text-primary" />;
      case "receipt":
        return <ReceiptText className="w-5 h-5 text-indigo-600" />;
      case "ticket":
        return <Ticket className="w-5 h-5 text-tertiary" />;
      case "users":
        return <Users className="w-5 h-5 text-secondary" />;
      default:
        return <Wallet className="w-5 h-5 text-primary" />;
    }
  };

  const getIconBg = () => {
    switch (metric.colorVariant) {
      case "indigo":
        return "bg-primary-fixed/40 border border-primary-fixed";
      case "blue":
        return "bg-surface-variant/70 border border-surface-variant";
      case "purple":
        return "bg-tertiary-container/20 border border-tertiary-container/30";
      case "rose":
        return "bg-secondary-fixed/50 border border-secondary-fixed";
      default:
        return "bg-surface-container";
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant font-display">
          {metric.label}
        </span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getIconBg()}`}>
          {getIcon()}
        </div>
      </div>

      <div className="my-1">
        <h3 className="font-display font-extrabold text-2xl lg:text-3xl text-on-surface tracking-tight">
          {metric.value}
        </h3>
      </div>

      <div className="mt-2 min-h-6 flex items-center">
        {metric.badge && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-primary-fixed/60 text-primary">
            {metric.badge.text}
          </span>
        )}
        {metric.subtext && (
          <p className="text-xs text-on-surface-variant font-medium">
            {metric.subtext}
          </p>
        )}
      </div>
    </div>
  );
}

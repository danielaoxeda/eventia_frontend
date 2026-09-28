import type { TicketType, OrganizerEvent } from "../../types/organizer.types";
import { formatPEN, formatNumber } from "../../utils/organizerFormatters";

interface TicketCapacitySummaryProps {
  event: OrganizerEvent;
  tickets: TicketType[];
}

export default function TicketCapacitySummary({
  event,
  tickets,
}: TicketCapacitySummaryProps) {
  const totalConfiguredCapacity = tickets.reduce((acc, t) => acc + t.capacity, 0);
  const totalSold = tickets.reduce((acc, t) => acc + t.soldCount, 0);
  const totalRevenueReal = tickets.reduce((acc, t) => acc + t.soldCount * t.pricePEN, 0);
  const potentialRevenueMax = tickets.reduce((acc, t) => acc + t.capacity * t.pricePEN, 0);

  const capacityPercentage =
    event.capacity > 0 ? Math.min(100, Math.round((totalConfiguredCapacity / event.capacity) * 100)) : 0;
  const soldPercentage =
    totalConfiguredCapacity > 0 ? Math.round((totalSold / totalConfiguredCapacity) * 100) : 0;

  const isOverCapacity = totalConfiguredCapacity > event.capacity;
  const unassignedCapacity = Math.max(0, event.capacity - totalConfiguredCapacity);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Aforo Asignado vs Recinto */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Aforo Asignado</span>
          <span className="material-symbols-outlined text-primary text-[20px]">stadium</span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-display font-extrabold text-on-surface">
              {formatNumber(totalConfiguredCapacity)}
            </span>
            <span className="text-xs text-outline font-medium">
              / {formatNumber(event.capacity)} pax
            </span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverCapacity ? "bg-error" : "bg-primary"
              }`}
              style={{ width: `${Math.min(100, capacityPercentage)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-[0.6875rem] font-semibold">
          <span className={isOverCapacity ? "text-error font-bold" : "text-outline"}>
            {isOverCapacity
              ? `Excedido por ${formatNumber(totalConfiguredCapacity - event.capacity)}`
              : `${formatNumber(unassignedCapacity)} cupos por asignar`}
          </span>
          <span className="text-primary font-bold">{capacityPercentage}% aforo</span>
        </div>
      </div>

      {/* 2. Entradas Vendidas */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Venta Total Acumulada</span>
          <span className="material-symbols-outlined text-secondary text-[20px]">
            confirmation_number
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-display font-extrabold text-on-surface">
              {formatNumber(totalSold)}
            </span>
            <span className="text-xs text-outline font-medium">entradas</span>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-secondary h-full transition-all duration-500"
              style={{ width: `${Math.min(100, soldPercentage)}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-[0.6875rem] font-semibold">
          <span className="text-outline">
            {formatNumber(totalConfiguredCapacity - totalSold)} disponibles
          </span>
          <span className="text-secondary font-bold">{soldPercentage}% colocado</span>
        </div>
      </div>

      {/* 3. Recaudación Actual (PEN) */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Recaudación Real</span>
          <span className="material-symbols-outlined text-emerald-600 text-[20px]">
            payments
          </span>
        </div>
        <div>
          <span className="text-2xl font-display font-extrabold text-emerald-700 tracking-tight">
            {formatPEN(totalRevenueReal)}
          </span>
          <p className="text-[0.6875rem] text-outline font-medium mt-1">
            Ingresos netos por venta efectiva
          </p>
        </div>
        <div className="text-[0.6875rem] font-bold text-emerald-600 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">trending_up</span>
          <span>Transacciones procesadas</span>
        </div>
      </div>

      {/* 4. Potencial Máximo (PEN) */}
      <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-outline">Potencial de Venta</span>
          <span className="material-symbols-outlined text-primary text-[20px]">
            account_balance_wallet
          </span>
        </div>
        <div>
          <span className="text-2xl font-display font-extrabold text-on-surface tracking-tight">
            {formatPEN(potentialRevenueMax)}
          </span>
          <p className="text-[0.6875rem] text-outline font-medium mt-1">
            100% Sold Out proyectado
          </p>
        </div>
        <div className="text-[0.6875rem] font-semibold text-outline flex items-center justify-between">
          <span>{tickets.length} zonas configuradas</span>
          <span className="font-bold text-primary">Soles (PEN)</span>
        </div>
      </div>
    </div>
  );
}

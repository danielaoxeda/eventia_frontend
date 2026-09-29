import type { TicketType } from "../../types/organizer.types";
import { formatPEN, formatNumber } from "../../utils/organizerFormatters";

interface TicketCardProps {
  ticket: TicketType;
  onEdit: (ticket: TicketType) => void;
  onToggleStatus: (ticket: TicketType) => void;
  onDelete: (ticket: TicketType) => void;
}

export default function TicketCard({
  ticket,
  onEdit,
  onToggleStatus,
  onDelete,
}: TicketCardProps) {
  const percentage =
    ticket.capacity > 0 ? Math.min(100, Math.round((ticket.soldCount / ticket.capacity) * 100)) : 0;
  const isSoldOut = ticket.status === "sold_out" || ticket.soldCount >= ticket.capacity;
  const isPaused = ticket.status === "paused";

  const getZoneColor = (zone: string) => {
    const z = zone.toLowerCase();
    if (z.includes("platinum") || z.includes("vip")) {
      return "bg-primary/10 text-primary border-primary/20";
    }
    if (z.includes("tribuna") || z.includes("box")) {
      return "bg-tertiary-container/20 text-tertiary border-tertiary/20";
    }
    return "bg-surface-container-high text-on-surface-variant border-outline-variant/30";
  };

  return (
    <div
      className={`bg-surface-container-lowest rounded-2xl p-5 shadow-sm border transition-all flex flex-col justify-between gap-4 ${
        isPaused
          ? "border-outline-variant/40 opacity-75"
          : isSoldOut
          ? "border-secondary/30"
          : "border-outline-variant/15 hover:shadow-md hover:border-primary/30"
      }`}
    >
      {/* Top badges & status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-[0.6875rem] font-bold border ${getZoneColor(
              ticket.zone
            )}`}
          >
            {ticket.zone}
          </span>
          {ticket.isPresale && (
            <span className="px-2 py-0.5 rounded-md text-[0.625rem] font-bold bg-amber-500/15 text-amber-800 border border-amber-500/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              Preventa
            </span>
          )}
        </div>

        {/* Status indicator */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold ${
            isSoldOut
              ? "bg-secondary-container/30 text-secondary"
              : isPaused
              ? "bg-surface-container text-outline"
              : "bg-emerald-500/10 text-emerald-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSoldOut ? "bg-secondary" : isPaused ? "bg-outline" : "bg-emerald-600 animate-pulse"
            }`}
          />
          {isSoldOut ? "Agotado" : isPaused ? "Pausada" : "En Venta"}
        </span>
      </div>

      {/* Ticket Name & Price */}
      <div>
        <h3 className="font-display text-base font-bold text-on-surface leading-tight">
          {ticket.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-2xl font-display font-extrabold text-primary">
            {formatPEN(ticket.pricePEN)}
          </span>
          <span className="text-[0.6875rem] text-outline font-medium">por entrada</span>
        </div>
      </div>

      {/* Progress bar of sales */}
      <div className="flex flex-col gap-1.5 bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-on-surface">
            {formatNumber(ticket.soldCount)}{" "}
            <span className="text-outline font-normal">/ {formatNumber(ticket.capacity)}</span>
          </span>
          <span
            className={`text-[0.6875rem] font-bold ${
              percentage >= 90 ? "text-secondary" : "text-primary"
            }`}
          >
            {percentage}%
          </span>
        </div>
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isSoldOut ? "bg-secondary" : percentage >= 85 ? "bg-primary" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[0.625rem] text-outline font-medium pt-0.5">
          <span>Máx. {ticket.maxPerPurchase || 4} por compra</span>
          <span>Recaudado: {formatPEN(ticket.soldCount * ticket.pricePEN)}</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between pt-2 border-t border-surface-container">
        <button
          type="button"
          onClick={() => onToggleStatus(ticket)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            ticket.status === "active"
              ? "text-outline hover:bg-surface-container hover:text-on-surface"
              : "text-primary bg-primary/10 hover:bg-primary/20"
          }`}
          title={ticket.status === "active" ? "Pausar venta pública" : "Activar venta pública"}
        >
          <span className="material-symbols-outlined text-[16px]">
            {ticket.status === "active" ? "pause_circle" : "play_circle"}
          </span>
          <span>{ticket.status === "active" ? "Pausar" : "Activar"}</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(ticket)}
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
            title="Editar tarifa"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>

          {ticket.soldCount === 0 && (
            <button
              type="button"
              onClick={() => onDelete(ticket)}
              className="w-8 h-8 rounded-lg bg-error-container/40 flex items-center justify-center text-error hover:bg-error-container transition-colors"
              title="Eliminar tarifa sin ventas"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

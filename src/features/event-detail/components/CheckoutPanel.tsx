import { Link } from "react-router-dom";
import { formatPEN, MAX_TICKETS } from "../services/event-detail.service";
import type { OrderTotals, TicketTier, TicketTierId } from "../types/event-detail.types";
import { isPromoUser, PROMO_DISCOUNT_PCT } from "../../events/services/events.service";

interface CheckoutPanelProps {
  tiers: TicketTier[];
  quantities: Record<number, number>;
  onUpdateQuantity: (tier: TicketTierId, delta: number) => void;
  totals: OrderTotals;
  highlightedTier: TicketTierId | null;
  /** Nombre de sesión o null si es visita anónima (sin input manual). */
  sessionName: string | null;
  onCheckout: () => void;
}

/** Panel de compra: cantidades, resumen y pago. El nombre viene de la sesión. */
export default function CheckoutPanel({
  tiers,
  quantities,
  onUpdateQuantity,
  totals,
  highlightedTier,
  sessionName,
  onCheckout,
}: CheckoutPanelProps) {
  const empty = totals.count === 0;
  const promoUser = sessionName !== null && isPromoUser(sessionName);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-md p-5 flex flex-col gap-4 min-w-0">
      <h2 className="font-display font-semibold text-xl truncate">Selección de Entradas</h2>

      <div className="bg-surface-container p-3 rounded-lg flex items-center gap-2 min-w-0">
        <span className="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
        <span className="text-xs font-medium wrap-break-word">
          Máximo {MAX_TICKETS} tickets por orden.
        </span>
      </div>

      <div className="flex flex-col gap-2 min-w-0">
        <span className="text-xs font-semibold uppercase tracking-wider">Comprador</span>
        {sessionName !== null ? (
          <div className="flex items-center gap-2 bg-surface-container-low text-sm pl-3 pr-4 py-2.5 rounded-lg min-w-0">
            <span className="material-symbols-outlined text-primary text-[20px] shrink-0">
              verified_user
            </span>
            <span className="truncate font-semibold">{sessionName}</span>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 bg-surface-container-low text-sm px-3 py-2.5 rounded-lg text-primary font-semibold hover:bg-surface-container-high transition-colors min-w-0"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">login</span>
            <span className="truncate">Inicia sesión para validar tu descuento</span>
          </Link>
        )}
      </div>

      {tiers.map((tier) => (
        <div
          key={tier.id}
          id={`tier-${tier.id}-container`}
          className={`p-3.5 rounded-lg bg-surface-container-low transition-all flex flex-col gap-2 scroll-mt-28 min-w-0 ${
            highlightedTier === tier.id ? "ring-2 ring-primary bg-surface-container-high" : ""
          }`}
        >
          <div className="flex justify-between items-center gap-2 min-w-0">
            <span className="text-sm font-bold truncate">{tier.name}</span>
            <span className="text-sm font-extrabold text-primary whitespace-nowrap">
              {formatPEN(tier.price)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-xs text-outline truncate">{tier.description}</span>
            <div className="flex items-center bg-white rounded-lg shadow-sm p-0.5 shrink-0">
              <button
                aria-label={`Disminuir ${tier.name}`}
                onClick={() => onUpdateQuantity(tier.id, -1)}
                type="button"
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-8 text-center text-sm font-bold" aria-live="polite">{quantities[tier.id] ?? 0}</span>
              <button
                aria-label={`Aumentar ${tier.name}`}
                onClick={() => onUpdateQuantity(tier.id, 1)}
                type="button"
                className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-2 min-w-0">
        <div className="flex justify-between gap-2 text-sm text-on-surface-variant">
          <span className="truncate">Subtotal ({totals.count} entradas)</span>
          <span className="font-semibold text-on-surface whitespace-nowrap">{formatPEN(totals.subtotal)}</span>
        </div>
        {promoUser && (
          <div className="flex justify-between gap-2 text-sm text-secondary font-medium">
            <span className="truncate">Descuento promo (-{PROMO_DISCOUNT_PCT}%)</span>
            <span className="font-bold whitespace-nowrap">- {formatPEN(totals.discount)}</span>
          </div>
        )}
        <div className="pt-2 mt-1 border-t border-outline-variant/40 flex justify-between items-baseline gap-2">
          <span className="text-sm font-bold">Total</span>
          <span className="font-display font-extrabold text-2xl text-primary whitespace-nowrap">
            {formatPEN(totals.total)}
          </span>
        </div>
      </div>

      <button
        disabled={empty}
        type="button"
        onClick={onCheckout}
        className={`w-full py-3 px-4 rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 min-w-0 ${
          empty ? "bg-primary/50 text-white cursor-not-allowed" : "bg-primary text-on-primary hover:opacity-90"
        }`}
      >
        <span className="truncate">
          {empty ? "Selecciona al menos 1 entrada" : `Continuar (${totals.count})`}
        </span>
        {!empty && <span className="material-symbols-outlined text-[20px] shrink-0">arrow_forward</span>}
      </button>
    </div>
  );
}

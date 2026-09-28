import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "../hooks/useCartContext";
import { isPromoUser, PROMO_DISCOUNT_PCT } from "@/features/events/services/events.service";

function SummaryStep() {
  const { items, totalAmount } = useCartContext();
  const { user } = useAuth();

  //REGLA DE NEGOCIO: promo 15% si el nombre es Roberto o Geronimo
  const sessionName = user ? `${user.firstName} ${user.lastName}`.trim() : null;
  const hasPromo = sessionName !== null && isPromoUser(sessionName);
  const discountAmount = hasPromo ? totalAmount * (PROMO_DISCOUNT_PCT / 100) : 0;
  const finalTotal = totalAmount - discountAmount;



  return (
    <div className="w-full max-w-xl mx-auto py-2 space-y-5">
      {/* Tarjeta informativa de envío */}
      {user && (
        <div className="bg-[#f3f4fd] rounded-lg p-3 text-xs text-gray-700 flex items-center">
          <div>
            <span className="font-semibold text-gray-900 block">
              Entradas emitidas a:
            </span>
            <span>
              {user.firstName} {user.lastName} • {user.email}
            </span>
          </div>
        </div>
      )}

      {/* Desglose de entradas */}
      <div className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Detalle del Pedido
        </h3>

        {items.map((item) => (
          <div
            key={item.id_ticket_type}
            className="flex justify-between items-center py-2 border-b border-gray-50 last:border-none text-sm"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {item.quantity}x Entrada {item.ticket_name}
              </p>
              <p className="text-xs text-gray-400">
                Precio unitario: S/ {item.unit_price.toFixed(2)}
              </p>
            </div>
            <span className="font-bold text-gray-800">
              S/ {(item.quantity * item.unit_price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Cálculo de importes y Descuento */}
      <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>S/ {totalAmount.toFixed(2)}</span>
        </div>

        {hasPromo && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Descuento Especial Roberto/Geronimo (-{PROMO_DISCOUNT_PCT}%)</span>
            <span>- S/ {discountAmount.toFixed(2)}</span>
          </div>
        )}

        <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
          <span className="font-bold text-gray-900 text-base">
            Total a pagar
          </span>
          <span className="font-black text-indigo-600 text-xl">
            S/ {finalTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Referencia al método de pago */}
      <div className="flex items-center gap-2 text-xs text-gray-500 justify-end">
        <span>Método de Pago:</span>
        <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
          Tarjeta Débito/Crédito
        </span>
      </div>
    </div>
  );
}

export default SummaryStep;

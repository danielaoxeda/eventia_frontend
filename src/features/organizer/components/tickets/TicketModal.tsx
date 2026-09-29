import type { TicketType } from "../../types/organizer.types";
import { useTicketFormModal } from "../../hooks/useTicketFormModal";
import TicketModalFields from "./TicketModalFields";

interface TicketModalProps {
  isOpen: boolean;
  ticketToEdit: TicketType | null;
  eventId: string;
  onClose: () => void;
  onSave: (data: Omit<TicketType, "id" | "soldCount"> & { id?: string }) => void;
  saving?: boolean;
}

export default function TicketModal({
  isOpen,
  ticketToEdit,
  eventId,
  onClose,
  onSave,
  saving = false,
}: TicketModalProps) {
  const form = useTicketFormModal({
    isOpen,
    ticketToEdit,
    eventId,
    onSave,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[20px]">
              confirmation_number
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">
                {ticketToEdit ? "Editar Tarifa de Entrada" : "Nueva Tarifa / Zona"}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Configuración comercial y aforo de la localidad
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={form.handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
          {form.errorMsg && (
            <div className="p-3 rounded-lg bg-error-container text-error text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{form.errorMsg}</span>
            </div>
          )}

          <TicketModalFields
            name={form.name}
            setName={form.setName}
            zone={form.zone}
            setZone={form.setZone}
            pricePEN={form.pricePEN}
            setPricePEN={form.setPricePEN}
            capacity={form.capacity}
            setCapacity={form.setCapacity}
            isPresale={form.isPresale}
            setIsPresale={form.setIsPresale}
            maxPerPurchase={form.maxPerPurchase}
            setMaxPerPurchase={form.setMaxPerPurchase}
            saleStartDate={form.saleStartDate}
            setSaleStartDate={form.setSaleStartDate}
            saleEndDate={form.saleEndDate}
            setSaleEndDate={form.setSaleEndDate}
          />

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 mt-2 border-t border-surface-container">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-outline hover:text-on-surface transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {saving ? "hourglass_empty" : "check"}
              </span>
              <span>
                {saving
                  ? "Guardando..."
                  : ticketToEdit
                  ? "Actualizar Tarifa"
                  : "Crear Tarifa"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

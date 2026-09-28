import { useState } from "react";

interface DeactivateModalProps {
  eventTitle: string;
  ticketsSold?: number;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  loading?: boolean;
}

const DEACTIVATION_REASONS = [
  "Reprogramación por motivos de fuerza mayor",
  "Cancelación concertada con el artista",
  "Suspensión preventiva por inspección técnica",
  "Cierre de cartelera por orden municipal",
];

export default function DeactivateModal({
  eventTitle,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: DeactivateModalProps) {
  const [reason, setReason] = useState(DEACTIVATION_REASONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-lg w-full mx-4">
        <div className="p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center gap-3 text-secondary">
            <div className="w-12 h-12 rounded-xl bg-error-container text-error flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[28px]">report</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[0.6875rem] uppercase font-bold text-secondary">
                Acción Crítica
              </span>
              <h3 className="font-display text-lg font-semibold text-on-surface">
                ¿Inactivar "{eventTitle}"?
              </h3>
            </div>
          </div>

          {/* Reason Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.6875rem] text-outline font-semibold">
              Motivo de la Inactivación
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface text-xs"
            >
              {DEACTIVATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onConfirm(reason)}
              disabled={loading}
              className="px-5 py-2 rounded-lg bg-secondary hover:bg-secondary/90 text-on-secondary text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>{loading ? "Procesando..." : "Confirmar Inactivación"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

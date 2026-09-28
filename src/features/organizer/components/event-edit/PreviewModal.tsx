import type { OrganizerEvent } from "../../types/organizer.types";
import { formatPEN, formatDate } from "../../utils/organizerFormatters";

interface PreviewModalProps {
  event: OrganizerEvent;
  isOpen: boolean;
  onClose: () => void;
}

export default function PreviewModal({ event, isOpen, onClose }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-on-surface/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl max-w-2xl w-full mx-4">
        <div className="p-6 flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[22px]">devices</span>
              <h3 className="font-display text-lg font-semibold text-on-surface">
                Vista Previa: Ficha del Consumidor
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-outline"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Preview Card */}
          <div className="rounded-xl overflow-hidden bg-surface-container-low shadow-inner flex flex-col">
            {/* Banner */}
            <div className="h-44 w-full relative">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-primary text-on-primary px-3 py-1 rounded-full text-[0.6875rem] font-bold">
                {event.active ? "VENTA ACTIVA" : "INACTIVO"}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col gap-2">
              <span className="text-[0.6875rem] text-secondary font-bold uppercase tracking-wider">
                {event.category} • {event.venue}
              </span>
              <h4 className="font-display text-xl font-semibold text-on-surface">{event.title}</h4>
              <div className="flex items-center gap-4 text-on-surface-variant text-xs">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    calendar_today
                  </span>
                  {formatDate(event.date)}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">alarm</span>
                  {event.time} Puertas
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    pin_drop
                  </span>
                  {event.city}
                </span>
              </div>

              {/* Price section */}
              <div className="mt-2 pt-2 bg-surface-container p-3 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-[0.6875rem] text-outline">Entradas desde</span>
                  <div className="font-display text-2xl font-extrabold text-primary tracking-tight">
                    {formatPEN(event.totalRevenue > 0 ? 180 : 0)}
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-on-primary text-xs font-semibold rounded-lg"
                >
                  Comprar en Línea
                </button>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-surface-container text-on-surface text-xs font-semibold"
            >
              Cerrar Previa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

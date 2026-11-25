import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import apiClient from "../../../shared/services/api";
import { organizerService } from "../services/organizerService";
import { useEventDetail } from "../hooks/useEventDetail";
import { useOrganizerEventsSocket } from "../hooks/useOrganizerEventsSocket";
import { openEventFormSwal, type CategoryOption } from "../components/events/eventFormSwal";
import TicketManagerModal from "../components/events/TicketManagerModal";
import EventStatusBadge from "../components/common/EventStatusBadge";
import { formatDate, formatNumber, formatPEN } from "../utils/organizerFormatters";

export default function OrganizerEventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { event, tickets, loading, reload } = useEventDetail(id);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [ticketsOpen, setTicketsOpen] = useState(false);

  useOrganizerEventsSocket((notification) => {
    if (String(notification.eventId) !== String(id)) return;
    reload();
    Swal.fire({
      icon: "info",
      title: "Evento actualizado",
      text: notification.message,
      timer: 2200,
      showConfirmButton: false,
    });
  });

  useEffect(() => {
    apiClient
      .get<CategoryOption[]>("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-3 text-outline">
        <span className="material-symbols-outlined text-primary text-3xl animate-spin">sync</span>
        <span className="text-xs font-semibold">Cargando evento...</span>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
        <span className="material-symbols-outlined text-outline text-5xl">event_busy</span>
        <p className="text-sm font-semibold text-outline">Evento no encontrado.</p>
        <Link to="/organizador/eventos" className="text-xs font-semibold text-primary hover:underline">
          Volver a Eventos
        </Link>
      </div>
    );
  }

  const totalCapacity = tickets.reduce((sum, t) => sum + t.capacity, 0);
  const totalSold = tickets.reduce((sum, t) => sum + t.soldCount, 0);
  const totalAvailable = Math.max(0, totalCapacity - totalSold);

  const handleEdit = async () => {
    const saved = await openEventFormSwal({ mode: "edit", categories, event });
    if (saved) {
      reload();
      Swal.fire({ icon: "success", title: "Evento actualizado", timer: 1600, showConfirmButton: false });
    }
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar evento?",
      text: `${event.title} se inactivará y conservará su historial.`,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;
    try {
      await organizerService.deactivateEvent(event.id, "Inactivado por el organizador");
      navigate("/organizador/eventos");
    } catch {
      await Swal.fire({ icon: "error", text: "No se pudo inactivar el evento." });
    }
  };

  return (
    <div className="space-y-6 py-2">
      <div className="flex flex-col gap-2">
        <Link to="/organizador/eventos" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Volver a Eventos
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
                {event.title}
              </h1>
              <EventStatusBadge status={event.status} active={event.active} />
            </div>
            <p className="text-xs text-on-surface-variant">
              {event.category} · {event.code}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span> Editar
            </button>
            <button
              type="button"
              onClick={() => setTicketsOpen(true)}
              className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span> Tarifas
            </button>
            {event.status === "published" && event.active && (
              <Link
                to={`/event/${event.id}`}
                target="_blank"
                className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span> Ver catálogo
              </Link>
            )}
            <button
              type="button"
              onClick={handleDelete}
              disabled={!event.active}
              className="flex items-center gap-1.5 bg-error-container/40 hover:bg-error-container/60 text-error px-3 py-2 rounded-lg text-xs font-semibold disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span> Eliminar
            </button>
          </div>
        </div>
      </div>

      {event.status === "pending" && event.active && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
          <span>Este evento está en revisión por un administrador.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest overflow-hidden shadow-sm">
            <img src={event.bannerUrl} alt={event.title} className="w-full h-56 object-cover" />
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <Info label="Categoría" value={event.category} />
              <Info label="Fecha" value={formatDate(event.date)} />
              <Info label="Hora inicio" value={event.startTime || event.time || "—"} />
              <Info label="Hora fin" value={event.endTime || "—"} />
              <Info label="Lugar" value={event.venue || "—"} />
              <Info label="Aforo total" value={formatNumber(event.capacity)} />
            </div>
            {event.description && (
              <div className="px-5 pb-5">
                <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-1">Descripción</h3>
                <p className="text-sm text-on-surface-variant whitespace-pre-line">{event.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
            <h3 className="font-display text-sm font-bold text-on-surface mb-3">Resumen de tarifas</h3>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Metric label="Cupos" value={formatNumber(totalCapacity)} />
              <Metric label="Vendidos" value={formatNumber(totalSold)} />
              <Metric label="Disponibles" value={formatNumber(totalAvailable)} />
              <Metric label="Tarifas" value={formatNumber(tickets.length)} />
            </div>
          </div>

          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-bold text-on-surface">Tarifas</h3>
              <button
                type="button"
                onClick={() => setTicketsOpen(true)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Gestionar
              </button>
            </div>
            {tickets.length === 0 ? (
              <p className="text-xs text-outline">Este evento aún no tiene tarifas.</p>
            ) : (
              <div className="divide-y divide-surface-container">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                    <div className="min-w-0">
                      <p className="font-semibold text-on-surface truncate">{ticket.name}</p>
                      <p className="text-[11px] text-outline">
                        {ticket.zone} · {ticket.soldCount}/{ticket.capacity}
                      </p>
                    </div>
                    <span className="font-mono font-semibold text-on-surface">{formatPEN(ticket.pricePEN)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {ticketsOpen && (
        <TicketManagerModal
          eventId={event.id}
          eventTitle={event.title}
          onClose={() => setTicketsOpen(false)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">{label}</p>
      <p className="text-on-surface mt-0.5">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container-low rounded-lg py-2">
      <p className="text-lg font-bold text-on-surface">{value}</p>
      <p className="text-[11px] text-outline">{label}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import apiClient from "../../../shared/services/api";
import EventsTable from "../components/events/EventsTable";
import TicketManagerModal from "../components/events/TicketManagerModal";
import { openEventFormSwal, type CategoryOption } from "../components/events/eventFormSwal";
import { useOrganizerEvents } from "../hooks/useOrganizerEvents";
import { useOrganizerEventsSocket } from "../hooks/useOrganizerEventsSocket";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent } from "../types/organizer.types";

export default function OrganizerEventsPage() {
  const {
    events,
    pageData,
    setPageIndex,
    includeInactive,
    setIncludeInactive,
    loading,
    reload,
    deactivateEvent,
  } = useOrganizerEvents();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [ticketEvent, setTicketEvent] = useState<OrganizerEvent | null>(null);
  const { isConnected } = useOrganizerEventsSocket(() => reload());

  useEffect(() => {
    apiClient
      .get<CategoryOption[]>("/api/categories")
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
  }, []);

  const toast = (title: string) =>
    Swal.fire({ icon: "success", title, timer: 1600, showConfirmButton: false });

  const handleCreate = async () => {
    if (categories.length === 0) {
      await Swal.fire({ icon: "warning", text: "No hay categorías disponibles." });
      return;
    }
    const saved = await openEventFormSwal({ mode: "create", categories });
    if (saved) {
      setPageIndex(0);
      reload();
      toast("Evento creado");
    }
  };

  const handleEdit = async (event: OrganizerEvent) => {
    const detail = await organizerService.getEventById(event.id);
    if (!detail) {
      await Swal.fire({ icon: "error", text: "No se pudo cargar el evento." });
      return;
    }
    const saved = await openEventFormSwal({ mode: "edit", categories, event: detail });
    if (saved) {
      reload();
      toast("Evento actualizado");
    }
  };

  const handleDelete = async (event: OrganizerEvent) => {
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
      await deactivateEvent(event.id);
      toast("Evento inactivado");
    } catch {
      await Swal.fire({ icon: "error", text: "No se pudo inactivar el evento." });
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-outline font-medium">Organizador</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isConnected
                  ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                  : "bg-surface-container text-outline"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-outline"}`} />
              {isConnected ? "En vivo" : "Conectando..."}
            </span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Eventos
          </h1>
          <p className="text-xs text-on-surface-variant max-w-3xl">
            Gestiona tus eventos, sus tarifas y su disponibilidad.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Crear evento</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low/60 p-3 rounded-xl border border-outline-variant/20">
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={includeInactive}
            onChange={(e) => setIncludeInactive(e.target.checked)}
            className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
          />
          <span className="text-xs font-semibold text-on-surface">
            Mostrar eventos inactivos y cancelados
          </span>
        </label>
        <span className="text-[11px] text-outline">
          {includeInactive ? "Mostrando todos los eventos (activos e inactivos)" : "Mostrando solo eventos activos"}
        </span>
      </div>

      <EventsTable
        events={events}
        pageData={pageData}
        loading={loading}
        onPageChange={setPageIndex}
        onEdit={handleEdit}
        onManageTickets={setTicketEvent}
        onDelete={handleDelete}
      />

      {ticketEvent && (
        <TicketManagerModal
          eventId={ticketEvent.id}
          eventTitle={ticketEvent.title}
          onClose={() => setTicketEvent(null)}
          onChanged={reload}
        />
      )}
    </div>
  );
}

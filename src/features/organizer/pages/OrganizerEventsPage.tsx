import { useState } from "react";
import { Link } from "react-router-dom";
import EventsTable from "../components/dashboard/EventsTable";
import { useOrganizerEvents } from "../hooks/useOrganizerEvents";

export default function OrganizerEventsPage() {
  const { events, loading, refreshing, loadEvents, deactivateEvent, publishEvent } = useOrganizerEvents();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const handlePublish = async (id: string) => {
    try {
      setPublishingId(id);
      await publishEvent(id);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al publicar el evento.");
    } finally {
      setPublishingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar/inactivar este evento? Se aplicará baja lógica (RN04).")) return;
    try {
      setDeletingId(id);
      await deactivateEvent(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
        <span className="text-xs font-semibold text-outline">Cargando mis eventos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-outline font-medium">Organizador</span>
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Mis Eventos</h1>
          <p className="text-xs text-on-surface-variant max-w-3xl">
            Gestiona tus eventos: crea, edita, configura entradas y aplica eliminación lógica por evento.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadEvents}
            disabled={refreshing}
            className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-3 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-[18px] ${refreshing ? "animate-spin" : ""}`}>refresh</span>
            <span>{refreshing ? "Actualizando..." : "Actualizar"}</span>
          </button>
          <Link
            to="/organizador/eventos/nuevo"
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2 rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Crear Evento</span>
          </Link>
        </div>
      </div>

      <EventsTable events={events} onRefresh={loadEvents} onPublish={handlePublish} />

      {/* Acciones rápidas por evento (eliminar/inactivar/publicar) - complementa la tabla */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-surface-container">
          <h2 className="font-display text-sm font-bold text-on-surface">Acciones de gestión</h2>
          <p className="text-[11px] text-outline mt-0.5">Eliminación lógica: el evento se inactiva y conserva su historial.</p>
        </div>
        <div className="divide-y divide-surface-container">
          {events.length === 0 ? (
            <div className="px-5 py-6 text-sm text-outline">Aún no tienes eventos. Crea el primero para comenzar.</div>
          ) : (
            events.map((evt) => (
              <div key={evt.id} className="px-4 sm:px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-on-surface truncate">{evt.title}</div>
                  <div className="text-[11px] text-outline">{evt.code} · {evt.date} · {evt.status}{!evt.active ? " · inactivo" : ""}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {evt.status !== "published" && evt.active && (
                    <button
                      type="button"
                      onClick={() => handlePublish(evt.id)}
                      disabled={publishingId === evt.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-primary-container disabled:opacity-50"
                    >
                      {publishingId === evt.id ? "Publicando..." : "Publicar"}
                    </button>
                  )}
                  <Link to={`/organizador/eventos/${evt.id}/editar`} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface">Editar</Link>
                  <Link to={`/organizador/eventos/${evt.id}/entradas`} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container hover:bg-surface-container-high text-on-surface">Entradas</Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(evt.id)}
                    disabled={deletingId === evt.id || !evt.active}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-error-container/30 text-error hover:bg-error-container/50 disabled:opacity-50"
                  >
                    {deletingId === evt.id ? "Eliminando..." : evt.active ? "Eliminar" : "Inactivo"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

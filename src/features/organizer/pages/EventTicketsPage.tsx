import { useEventTickets } from "../hooks/useEventTickets";
import TicketsHeader from "../components/tickets/TicketsHeader";
import TicketCapacitySummary from "../components/tickets/TicketCapacitySummary";
import TicketCard from "../components/tickets/TicketCard";
import TicketModal from "../components/tickets/TicketModal";
import Toast from "../components/common/Toast";

export default function EventTicketsPage() {
  const {
    events,
    currentEvent,
    selectedEventId,
    tickets,
    rawTicketsCount,
    loading,
    saving,
    filterStatus,
    setFilterStatus,
    isModalOpen,
    ticketToEdit,
    toast,
    handleSelectEvent,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveTicket,
    handleToggleStatus,
    handleDeleteTicket,
    hideToast,
  } = useEventTickets();

  if (!currentEvent && !loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-outline text-4xl">event_busy</span>
        <span className="text-sm font-semibold text-outline">No se encontraron eventos.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* 1. Header con Selector de Evento y Botón de Creación */}
      <TicketsHeader
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={handleSelectEvent}
        onOpenCreateModal={handleOpenCreateModal}
      />

      {/* 2. Resumen de Capacidad, Aforo y Proyección de Recaudación */}
      {currentEvent && (
        <TicketCapacitySummary event={currentEvent} tickets={tickets} />
      )}

      {/* 3. Filtros y Listado de Tarifas */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-surface-container">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <h2 className="font-display text-base font-bold text-on-surface">
              Zonas y Tarifas Activas ({rawTicketsCount})
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-surface-container p-1 rounded-xl">
            {[
              { key: "all", label: "Todas" },
              { key: "active", label: "En Venta" },
              { key: "presale", label: "Preventas" },
              { key: "paused", label: "Pausadas" },
              { key: "sold_out", label: "Agotadas" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterStatus(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === tab.key
                    ? "bg-surface-container-lowest text-on-surface shadow-xs font-bold"
                    : "text-outline hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-primary text-3xl animate-spin">
              sync
            </span>
            <span className="text-xs font-semibold text-outline">
              Cargando tarifas y aforos...
            </span>
          </div>
        ) : tickets.length === 0 ? (
          /* Empty State */
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center text-outline">
              <span className="material-symbols-outlined text-[28px]">confirmation_number</span>
            </div>
            <h3 className="font-display text-base font-bold text-on-surface">
              No hay tarifas registradas en esta vista
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm">
              Define las zonas, precios y aforo asignado para comenzar a emitir entradas digitales.
            </p>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="mt-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:bg-primary-container transition-all shadow-sm"
            >
              + Crear Primera Tarifa
            </button>
          </div>
        ) : (
          /* Grid de Tarifas */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={handleOpenEditModal}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDeleteTicket}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal de Creación / Edición */}
      <TicketModal
        isOpen={isModalOpen}
        ticketToEdit={ticketToEdit}
        eventId={selectedEventId}
        onClose={handleCloseModal}
        onSave={handleSaveTicket}
        saving={saving}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}

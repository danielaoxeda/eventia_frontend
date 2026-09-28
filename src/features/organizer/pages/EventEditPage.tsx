import { useParams, Link } from "react-router-dom";
import { useEventEdit } from "../hooks/useEventEdit";
import EditEventHeader from "../components/event-edit/EditEventHeader";
import EventFormGeneral from "../components/event-edit/EventFormGeneral";
import EventFormSchedule from "../components/event-edit/EventFormSchedule";
import EventFormDescription from "../components/event-edit/EventFormDescription";
import EventFormBanners from "../components/event-edit/EventFormBanners";
import EventPanel from "../components/event-edit/EventPanel";
import DeactivateModal from "../components/common/DeactivateModal";
import PreviewModal from "../components/event-edit/PreviewModal";
import Toast from "../components/common/Toast";

export default function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const {
    event,
    loading,
    saving,
    syncing,
    deactivating,
    formData,
    showDeactivateModal,
    setShowDeactivateModal,
    showPreviewModal,
    setShowPreviewModal,
    toast,
    statusConfig,
    handleFieldChange,
    handleSave,
    handleSync,
    handleToggleVisibility,
    handleDeactivate,
    hideToast,
  } = useEventEdit(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-sm text-on-surface-variant">Cargando evento...</span>
        </div>
      </div>
    );
  }

  if (!event || !statusConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <span className="material-symbols-outlined text-[48px] text-outline">event_busy</span>
        <h2 className="font-display text-xl font-bold text-on-surface">Evento no encontrado</h2>
        <Link
          to="/organizador/dashboard"
          className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
        >
          Volver al Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Barra de Encabezado Superior */}
      <EditEventHeader
        event={event}
        statusLabel={statusConfig.label}
        syncing={syncing}
        saving={saving}
        onSync={handleSync}
        onSave={handleSave}
      />

      {/* Layout Principal en 2 Columnas (8/4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Secciones del Formulario */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <EventFormGeneral
            title={formData.title}
            category={formData.category}
            capacity={formData.capacity}
            venue={formData.venue}
            address={formData.address}
            onChange={handleFieldChange}
          />

          <EventFormSchedule
            eventDate={formData.eventDate}
            doorsOpen={formData.doorsOpen}
            showStart={formData.showStart}
            salesClose={formData.salesClose}
            onChange={handleFieldChange}
          />

          <EventFormDescription
            description={formData.description}
            onChange={handleFieldChange}
          />

          <EventFormBanners
            bannerDesktopUrl={formData.bannerDesktopUrl}
            bannerMobileUrl={formData.bannerMobileUrl}
          />
        </div>

        {/* Columna Derecha: Panel de Control y Estado */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <EventPanel
            eventStatus={event.status}
            isPublic={formData.isPublic}
            onToggleVisibility={handleToggleVisibility}
            onSave={handleSave}
            onPreview={() => setShowPreviewModal(true)}
            onDeactivate={() => setShowDeactivateModal(true)}
            saving={saving}
          />
        </div>
      </div>

      {/* Modales */}
      <DeactivateModal
        eventTitle={event.title}
        ticketsSold={event.ticketsSold}
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivate}
        loading={deactivating}
      />

      <PreviewModal
        event={event}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      {/* Toast Notification */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}

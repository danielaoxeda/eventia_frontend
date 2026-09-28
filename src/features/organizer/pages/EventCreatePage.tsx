import { useCreateEvent } from "../hooks/useCreateEvent";
import CreateEventHeader from "../components/event-create/CreateEventHeader";
import CreateEventPanel from "../components/event-create/CreateEventPanel";
import EventFormGeneral from "../components/event-edit/EventFormGeneral";
import EventFormSchedule from "../components/event-edit/EventFormSchedule";
import EventFormDescription from "../components/event-edit/EventFormDescription";
import EventFormBanners from "../components/event-edit/EventFormBanners";
import PreviewModal from "../components/event-edit/PreviewModal";
import Toast from "../components/common/Toast";

export default function EventCreatePage() {
  const {
    formData,
    creating,
    showPreviewModal,
    setShowPreviewModal,
    toast,
    previewEventData,
    handleFieldChange,
    handleToggleVisibility,
    handleCreate,
    hideToast,
  } = useCreateEvent();

  return (
    <div className="flex flex-col gap-6 py-4">
      {/* Barra de Encabezado Superior */}
      <CreateEventHeader
        isPublic={formData.isPublic}
        creating={creating}
        onCreate={handleCreate}
      />

      {/* Estructura Principal en 2 Columnas (8/4) */}
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

        {/* Columna Derecha: Panel de Publicación */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <CreateEventPanel
            isPublic={formData.isPublic}
            creating={creating}
            onToggleVisibility={handleToggleVisibility}
            onCreate={handleCreate}
            onPreview={() => setShowPreviewModal(true)}
          />
        </div>
      </div>

      {/* Modal de Vista Previa */}
      <PreviewModal
        event={previewEventData}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      {/* Toast de Notificaciones */}
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}

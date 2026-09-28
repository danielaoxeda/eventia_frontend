import { useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent, EventFormData } from "../types/organizer.types";
import { getStatusConfig } from "../utils/organizerFormatters";

export function useEventEdit(id?: string) {
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  // Form state
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    capacity: 0,
    venue: "",
    address: "",
    eventDate: "",
    doorsOpen: "16:30",
    showStart: "20:00",
    salesClose: "22:00",
    description: "",
    restrictions: [],
    bannerDesktopUrl: "",
    bannerMobileUrl: "",
    isPublic: true,
  });

  // Modals state
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: "" });
  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);
  const hideToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  // Cargar datos del evento
  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      setLoading(true);
      try {
        const eventData = await organizerService.getEventById(id);

        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title,
            category: eventData.category,
            capacity: eventData.capacity,
            venue: eventData.venue,
            address: `${eventData.venue}, ${eventData.city}`,
            eventDate: eventData.date,
            doorsOpen: "16:30",
            showStart: eventData.time,
            salesClose: "22:00",
            description: `${eventData.title} es uno de los eventos más esperados de la temporada. El ingreso está estrictamente reservado a mayores de 18 años portando su Documento Nacional de Identidad (DNI) físico o Carné de Extranjería original.`,
            restrictions: [
              "Toda entrada debe estar nominada con DNI/RUC válido antes de las 12:00 hrs del día del evento.",
              "Se aplicará validación de QR dinámico anti-captura de pantalla.",
              "Prohibido el reingreso una vez validado el acceso en puerta exterior.",
            ],
            bannerDesktopUrl: eventData.bannerUrl,
            bannerMobileUrl: eventData.bannerUrl,
            isPublic: eventData.active && eventData.status !== "hidden" && eventData.status !== "draft",
          });
        }
      } catch (error) {
        console.error("Error loading event:", error);
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  // Actualizar campo
  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!event || !id) return;
    setSaving(true);
    try {
      const updated = await organizerService.updateEvent(id, {
        title: formData.title,
        category: formData.category,
        capacity: formData.capacity,
        venue: formData.venue,
        date: formData.eventDate,
        time: formData.showStart,
        bannerUrl: formData.bannerDesktopUrl,
      });
      setEvent(updated);
      showToast("¡Cambios guardados con éxito!");
    } catch (error) {
      showToast("Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  // Sincronizar
  const handleSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 800));
    setSyncing(false);
    showToast("Borrador sincronizado.");
  };

  // Alternar visibilidad
  const handleToggleVisibility = () => {
    setFormData((prev) => {
      const newIsPublic = !prev.isPublic;
      showToast(
        newIsPublic
          ? "Evento activado y visible en cartelera pública."
          : "Evento pausado. Oculto para compradores, datos intactos."
      );
      return { ...prev, isPublic: newIsPublic };
    });
  };

  // Desactivar evento
  const handleDeactivate = async (reason: string) => {
    if (!event || !id) return;
    setDeactivating(true);
    try {
      const updated = await organizerService.deactivateEvent(id, reason);
      setEvent(updated);
      setFormData((prev) => ({ ...prev, isPublic: false }));
      setShowDeactivateModal(false);
      showToast("Evento inactivado.");
    } catch (error) {
      showToast("Error al inactivar el evento.");
    } finally {
      setDeactivating(false);
    }
  };

  const statusConfig = event ? getStatusConfig(event.status, event.active) : null;

  return {
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
    showToast,
    hideToast,
  };
}

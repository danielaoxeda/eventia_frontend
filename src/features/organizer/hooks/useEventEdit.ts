import { useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent, EventFormData } from "../types/organizer.types";
import { getStatusConfig } from "../utils/organizerFormatters";

export function useEventEdit(id?: string) {
  const [event, setEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "",
    capacity: 0,
    venue: "",
    address: "",
    eventDate: "",
    doorsOpen: "",
    showStart: "20:00",
    salesClose: "22:00",
    description: "",
    restrictions: [],
    bannerDesktopUrl: "",
    bannerMobileUrl: "",
    isPublic: true,
  });
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const showToast = useCallback((message: string) => setToast({ visible: true, message }), []);
  const hideToast = useCallback(() => setToast({ visible: false, message: "" }), []);

  useEffect(() => {
    async function loadEvent() {
      if (!id) return;
      setLoading(true);
      try {
        const eventData = await organizerService.getEventById(id) as any;
        if (eventData) {
          setEvent(eventData);
          setFormData({
            title: eventData.title || "",
            category: eventData.category || "",
            capacity: Number(eventData.capacity || 0),
            venue: eventData.venue || eventData.location || "",
            address: "",
            eventDate: eventData.date || "",
            doorsOpen: "",
            showStart: eventData.startTime || eventData.time || "20:00",
            salesClose: eventData.endTime || "22:00",
            description: eventData.description || "",
            restrictions: [],
            bannerDesktopUrl: eventData.bannerUrl || "",
            bannerMobileUrl: "",
            isPublic: eventData.active !== false && eventData.status !== "hidden" && eventData.status !== "draft",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!event || !id) return;
    setSaving(true);
    try {
      const updated = await organizerService.updateEvent(id, {
        title: formData.title,
        category: formData.category,
        capacity: Number(formData.capacity),
        venue: formData.venue,
        location: formData.venue,
        date: formData.eventDate,
        time: formData.showStart,
        startTime: formData.showStart,
        endTime: formData.salesClose || formData.showStart,
        bannerUrl: formData.bannerDesktopUrl,
        description: formData.description,
      } as any);
      setEvent(updated);
      showToast("Cambios guardados.");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error al guardar los cambios.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = async (reason: string) => {
    if (!event || !id) return;
    setDeactivating(true);
    try {
      const updated = await organizerService.deactivateEvent(id, reason);
      setEvent(updated);
      setShowDeactivateModal(false);
      showToast("Evento inactivado.");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error al inactivar el evento.");
    } finally {
      setDeactivating(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!event || !id) return;
    const nextStatus = event.status === "published" ? "draft" : "published";
    try {
      const updated = await organizerService.toggleEventStatus(id, nextStatus);
      setEvent(updated);
      setFormData((prev) => ({ ...prev, isPublic: nextStatus === "published" }));
      showToast(nextStatus === "published" ? "Evento publicado en cartelera." : "Evento ocultado de la cartelera.");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error al cambiar la visibilidad.");
    }
  };

  const handlePublish = async () => {
    if (!event || !id) return;
    try {
      const updated = await organizerService.toggleEventStatus(id, "published");
      setEvent(updated);
      setFormData((prev) => ({ ...prev, isPublic: true }));
      showToast("¡Evento publicado en la cartelera principal!");
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error al publicar el evento.");
    }
  };

  const statusConfig = event ? getStatusConfig(event.status, event.active) : null;

  return {
    event,
    loading,
    saving,
    syncing: false,
    deactivating,
    formData,
    showDeactivateModal,
    setShowDeactivateModal,
    showPreviewModal: false,
    setShowPreviewModal: (_v: boolean) => {},
    toast,
    statusConfig,
    handleFieldChange,
    handleSave,
    handleSync: async () => {},
    handleToggleVisibility,
    handlePublish,
    handleDeactivate,
    showToast,
    hideToast,
  };
}

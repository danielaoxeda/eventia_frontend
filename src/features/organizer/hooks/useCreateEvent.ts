import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { organizerService } from "../services/organizerService";
import type { EventFormData, OrganizerEvent } from "../types/organizer.types";

export function useCreateEvent() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const [formData, setFormData] = useState<EventFormData>({
    title: "",
    category: "Música & Conciertos",
    capacity: 0,
    venue: "Arena 1 Costa Verde, San Miguel",
    address: "",
    eventDate: "",
    doorsOpen: "17:00",
    showStart: "20:00",
    salesClose: "22:00",
    description: "",
    restrictions: [
      "Ingreso exclusivo para mayores de 18 años con documento de identidad original.",
      "Toda entrada debe nominarse con DNI/Pasaporte antes del ingreso.",
      "Prohibido el ingreso de alimentos, bebidas y objetos punzocortantes.",
    ],
    bannerDesktopUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80",
    bannerMobileUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
    isPublic: true,
  });

  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleVisibility = () => {
    setFormData((prev) => ({ ...prev, isPublic: !prev.isPublic }));
  };

  const handleCreate = async (asDraft = false) => {
    if (!formData.title.trim()) {
      showToast("Por favor ingresa el nombre del evento.");
      return;
    }
    if (!formData.eventDate) {
      showToast("Por favor selecciona una fecha válida para el evento.");
      return;
    }
    if (formData.capacity <= 0) {
      showToast("El aforo total debe ser mayor a 0.");
      return;
    }

    setCreating(true);
    try {
      const status: OrganizerEvent["status"] = asDraft
        ? "draft"
        : formData.isPublic
          ? "published"
          : "hidden";

      const createdEvent = await organizerService.createEvent({
        title: formData.title,
        category: formData.category,
        capacity: formData.capacity,
        venue: formData.venue,
        city: "Lima",
        date: formData.eventDate,
        time: formData.showStart,
        bannerUrl: formData.bannerDesktopUrl,
        status,
        active: true,
        featured: false,
        description: formData.description,
      });

      showToast(asDraft ? "¡Borrador creado con éxito!" : "¡Evento publicado con éxito!");

      setTimeout(() => {
        navigate(`/organizador/eventos/${createdEvent.id}/editar`);
      }, 900);
    } catch (error) {
      showToast("Error al crear el evento. Intenta nuevamente.");
    } finally {
      setCreating(false);
    }
  };

  const previewEventData: OrganizerEvent = {
    id: "NUEVO-BORRADOR",
    code: "EVT-NUEVO",
    title: formData.title || "Título del nuevo evento",
    category: formData.category,
    venue: formData.venue,
    city: "Lima",
    date: formData.eventDate,
    time: formData.showStart,
    bannerUrl: formData.bannerDesktopUrl,
    status: formData.isPublic ? "published" : "draft",
    active: true,
    capacity: formData.capacity,
    ticketsSold: 0,
    totalRevenue: 0,
  };

  return {
    formData,
    creating,
    showPreviewModal,
    setShowPreviewModal,
    toast,
    previewEventData,
    handleFieldChange,
    handleToggleVisibility,
    handleCreate,
    showToast,
    hideToast,
  };
}

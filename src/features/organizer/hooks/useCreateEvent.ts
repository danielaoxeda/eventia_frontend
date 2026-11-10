import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../shared/services/api";
import { organizerService } from "../services/organizerService";
import type { EventFormData, OrganizerEvent } from "../types/organizer.types";

type CategoryOption = { id: number | string; name: string };

export function useCreateEvent() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [toast, setToast] = useState({ visible: false, message: "" });

  const [formData, setFormData] = useState<EventFormData & { categoryId?: number | string; description: string }>({
    title: "",
    category: "",
    categoryId: "",
    capacity: 0,
    venue: "",
    address: "",
    eventDate: "",
    doorsOpen: "17:00",
    showStart: "20:00",
    salesClose: "22:00",
    description: "",
    restrictions: [],
    bannerDesktopUrl: "",
    bannerMobileUrl: "",
    isPublic: true,
  });

  useEffect(() => {
    apiClient.get<CategoryOption[]>("/api/categories").then((res) => {
      const active = (res.data || []).filter((c: any) => c.active !== false);
      setCategories(active);
      if (active[0]) setFormData((p) => ({ ...p, categoryId: active[0].id, category: active[0].name }));
    }).catch(() => setCategories([]));
  }, []);

  const showToast = useCallback((message: string) => setToast({ visible: true, message }), []);
  const hideToast = useCallback(() => setToast({ visible: false, message: "" }), []);

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      if (field === "categoryId") {
        const cat = categories.find((c) => String(c.id) === String(value));
        return { ...prev, categoryId: value, category: cat?.name || prev.category };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleCreate = async (asDraft = false) => {
    if (!formData.title.trim()) return showToast("Ingresa el nombre del evento.");
    if (!formData.eventDate) return showToast("Selecciona la fecha del evento.");
    if (!Number(formData.capacity) || Number(formData.capacity) <= 0) return showToast("El aforo debe ser mayor a 0.");
    if (!formData.venue.trim()) return showToast("Ingresa la ubicación o sede.");

    setCreating(true);
    try {
      const status: OrganizerEvent["status"] = asDraft ? "draft" : formData.isPublic ? "published" : "hidden";
      const createdEvent = await organizerService.createEvent({
        title: formData.title,
        category: formData.category,
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        capacity: Number(formData.capacity),
        venue: formData.venue,
        location: formData.venue,
        city: formData.address || "",
        date: formData.eventDate,
        time: formData.showStart,
        startTime: formData.showStart,
        endTime: formData.salesClose || formData.showStart,
        bannerUrl: formData.bannerDesktopUrl || undefined,
        status,
        active: true,
        description: formData.description,
      });
      showToast(asDraft ? "Borrador guardado." : "¡Evento creado y publicado en cartelera!");
      setTimeout(() => navigate(`/organizador/eventos/${createdEvent.id}/editar`), 700);
    } catch (error: any) {
      showToast(error?.response?.data?.message || "Error al crear el evento. Verifica los datos y tu sesión.");
    } finally {
      setCreating(false);
    }
  };

  return {
    formData,
    creating,
    categories,
    toast,
    handleFieldChange,
    handleCreate,
    hideToast,
  };
}

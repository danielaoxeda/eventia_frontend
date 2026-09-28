import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent, TicketType } from "../types/organizer.types";

export function useEventTickets() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>(id || "");
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filter status
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ticketToEdit, setTicketToEdit] = useState<TicketType | null>(null);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: "" });
  const showToast = useCallback((message: string) => {
    setToast({ visible: true, message });
  }, []);
  const hideToast = useCallback(() => {
    setToast({ visible: false, message: "" });
  }, []);

  // Cargar lista de eventos
  useEffect(() => {
    async function loadEvents() {
      try {
        const list = await organizerService.getEvents();
        setEvents(list);
        if (!selectedEventId && list.length > 0) {
          const initialId = id || list[0].id;
          setSelectedEventId(initialId);
        }
      } catch (err) {
        console.error("Error loading events for tickets:", err);
      }
    }
    loadEvents();
  }, [id, selectedEventId]);

  // Evento actualmente seleccionado
  const currentEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || null;
  }, [events, selectedEventId]);

  // Cargar tickets del evento seleccionado
  const loadTickets = useCallback(async () => {
    if (!selectedEventId) return;
    setLoading(true);
    try {
      const ticketsList = await organizerService.getTicketsByEvent(selectedEventId);
      setTickets(ticketsList);
    } catch (err) {
      console.error("Error loading tickets:", err);
      showToast("Error al cargar las tarifas.");
    } finally {
      setLoading(false);
    }
  }, [selectedEventId, showToast]);

  useEffect(() => {
    if (selectedEventId) {
      loadTickets();
    }
  }, [selectedEventId, loadTickets]);

  // Cambio de evento en el dropdown
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    navigate(`/organizador/eventos/${eventId}/entradas`);
  };

  // Abrir modal de creación
  const handleOpenCreateModal = () => {
    setTicketToEdit(null);
    setIsModalOpen(true);
  };

  // Abrir modal de edición
  const handleOpenEditModal = (ticket: TicketType) => {
    setTicketToEdit(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTicketToEdit(null);
  };

  // Guardar (crear o editar)
  const handleSaveTicket = async (
    data: Omit<TicketType, "id" | "soldCount"> & { id?: string }
  ) => {
    if (!currentEvent) return;
    setSaving(true);
    try {
      if (data.id) {
        await organizerService.updateTicketType(selectedEventId, data.id, data);
        showToast("Tarifa actualizada exitosamente.");
      } else {
        await organizerService.createTicketType(data);
        showToast("¡Nueva tarifa creada con éxito!");
      }
      handleCloseModal();
      await loadTickets();
    } catch (err) {
      showToast("Error al guardar la tarifa.");
    } finally {
      setSaving(false);
    }
  };

  // Alternar estado activo / pausado
  const handleToggleStatus = async (ticket: TicketType) => {
    const newStatus: TicketType["status"] =
      ticket.status === "active" ? "paused" : "active";
    try {
      await organizerService.toggleTicketStatus(selectedEventId, ticket.id, newStatus);
      showToast(
        newStatus === "active"
          ? `Venta reactivada para ${ticket.name}`
          : `Venta pausada para ${ticket.name}`
      );
      await loadTickets();
    } catch (err) {
      showToast("Error al cambiar estado de la tarifa.");
    }
  };

  // Eliminar tarifa
  const handleDeleteTicket = async (ticket: TicketType) => {
    if (ticket.soldCount > 0) {
      showToast("No se puede eliminar una tarifa con ventas registradas.");
      return;
    }
    try {
      await organizerService.deleteTicketType(selectedEventId, ticket.id);
      showToast(`Tarifa "${ticket.name}" eliminada.`);
      await loadTickets();
    } catch (err) {
      showToast("Error al eliminar la tarifa.");
    }
  };

  // Filtrado de tickets
  const filteredTickets = useMemo(() => {
    if (filterStatus === "all") return tickets;
    if (filterStatus === "presale") return tickets.filter((t) => t.isPresale);
    return tickets.filter((t) => t.status === filterStatus);
  }, [tickets, filterStatus]);

  return {
    events,
    currentEvent,
    selectedEventId,
    tickets: filteredTickets,
    rawTicketsCount: tickets.length,
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
  };
}

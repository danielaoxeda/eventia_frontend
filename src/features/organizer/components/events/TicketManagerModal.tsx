import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { organizerService } from "../../services/organizerService";
import type { TicketType } from "../../types/organizer.types";
import { formatPEN } from "../../utils/organizerFormatters";

interface TicketManagerModalProps {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
  onChanged: () => void;
}

const emptyForm = { name: "", zone: "General", price: "", capacity: "" };

export default function TicketManagerModal({
  eventId,
  eventTitle,
  onClose,
  onChanged,
}: TicketManagerModalProps) {
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadTickets = async () => {
    setLoading(true);
    try {
      setTickets(await organizerService.getTicketsByEvent(eventId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    organizerService
      .getTicketsByEvent(eventId)
      .then((data) => {
        if (active) {
          setTickets(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [eventId]);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async () => {
    const price = Number(form.price);
    const capacity = Number(form.capacity);
    if (!form.name.trim() || Number.isNaN(price) || price < 0 || !capacity || capacity <= 0) {
      await Swal.fire({ icon: "warning", text: "Completa nombre, precio y cupo válidos." });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await organizerService.updateTicketType(eventId, editingId, {
          name: form.name.trim(),
          zone: form.zone,
          pricePEN: price,
          capacity,
          status: "active",
        });
      } else {
        await organizerService.createTicketType({
          eventId,
          name: form.name.trim(),
          zone: form.zone,
          pricePEN: price,
          capacity,
          status: "active",
        });
      }
      resetForm();
      await loadTickets();
      onChanged();
    } catch {
      await Swal.fire({ icon: "error", text: "No se pudo guardar la tarifa." });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (ticket: TicketType) => {
    setEditingId(ticket.id);
    setForm({
      name: ticket.name,
      zone: ticket.zone,
      price: String(ticket.pricePEN),
      capacity: String(ticket.capacity),
    });
  };

  const handleToggle = async (ticket: TicketType) => {
    const next = ticket.status === "active" ? "paused" : "active";
    await organizerService.toggleTicketStatus(eventId, ticket.id, next);
    await loadTickets();
    onChanged();
  };

  const handleDelete = async (ticket: TicketType) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar tarifa?",
      text: ticket.name,
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;
    try {
      await organizerService.deleteTicketType(eventId, ticket.id);
      await loadTickets();
      onChanged();
    } catch {
      await Swal.fire({ icon: "error", text: "No se pudo eliminar la tarifa." });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl border border-outline-variant/20 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-surface-container">
          <div>
            <h2 className="font-display text-lg font-bold text-on-surface">Tarifas del evento</h2>
            <p className="text-xs text-on-surface-variant">{eventTitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-outline hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 border-b border-surface-container grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
          <div className="sm:col-span-1">
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Nombre</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm"
              placeholder="General"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Zona</label>
            <input
              value={form.zone}
              onChange={(e) => setForm({ ...form, zone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Precio</label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-on-surface-variant mb-1">Cupo</label>
            <input
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-surface-container-low text-sm"
            />
          </div>
          <div className="sm:col-span-4 flex items-center gap-2 justify-end">
            {editingId && (
              <button type="button" onClick={resetForm} className="px-3 py-2 text-xs font-semibold text-outline">
                Cancelar edición
              </button>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-bold disabled:opacity-60"
            >
              {saving ? "Guardando..." : editingId ? "Actualizar tarifa" : "Agregar tarifa"}
            </button>
          </div>
        </div>

        <div className="p-5 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-outline text-center py-6">Cargando tarifas...</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-outline text-center py-6">Este evento aún no tiene tarifas.</p>
          ) : (
            <div className="divide-y divide-surface-container">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{ticket.name}</p>
                    <p className="text-[11px] text-outline">
                      {ticket.zone} · {formatPEN(ticket.pricePEN)} · {ticket.soldCount}/{ticket.capacity} vendidos ·{" "}
                      {ticket.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(ticket)}
                      title="Editar"
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggle(ticket)}
                      title={ticket.status === "active" ? "Pausar" : "Activar"}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {ticket.status === "active" ? "pause_circle" : "play_circle"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(ticket)}
                      title="Eliminar"
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

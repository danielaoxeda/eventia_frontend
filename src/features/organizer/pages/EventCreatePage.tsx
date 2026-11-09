import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import Toast from "../components/common/Toast";
import { useCreateEvent } from "../hooks/useCreateEvent";

export default function EventCreatePage() {
  const { formData, creating, categories, toast, handleFieldChange, handleCreate, hideToast } = useCreateEvent();

  const set = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    handleFieldChange(field, e.target.type === "number" ? Number(e.target.value) : e.target.value);

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <Link to="/organizador/eventos" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline mb-2">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Mis Eventos
          </Link>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">Crear evento</h1>
          <p className="text-sm text-on-surface-variant mt-1">Completa la información base. Luego podrás editar detalles, estado y configurar entradas.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => handleCreate(true)} disabled={creating} className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high disabled:opacity-60">Guardar borrador</button>
          <button type="button" onClick={() => handleCreate(false)} disabled={creating} className="px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary-container shadow-sm disabled:opacity-60 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">{creating ? "hourglass_empty" : "rocket_launch"}</span>
            {creating ? "Creando..." : "Crear evento"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <section className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-container bg-gradient-to-r from-primary/[0.04] to-transparent">
            <h2 className="font-display text-base font-bold text-on-surface">Información del evento</h2>
            <p className="text-xs text-outline mt-0.5">Datos principales visibles en la gestión del organizador.</p>
          </div>
          <div className="p-5 space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Nombre del evento *</span>
              <input value={formData.title} onChange={set("title")} placeholder="Ej. Festival de Verano 2026" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Categoría</span>
                <select value={String(formData.categoryId ?? "")} onChange={set("categoryId")} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Seleccionar</option>
                  {categories.map((c) => <option key={String(c.id)} value={String(c.id)}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Aforo total *</span>
                <input type="number" min={1} value={formData.capacity || ""} onChange={set("capacity")} placeholder="5000" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Sede / ubicación *</span>
              <input value={formData.venue} onChange={set("venue")} placeholder="Arena 1, Costa Verde, San Miguel" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Fecha *</span>
                <input type="date" value={formData.eventDate} onChange={set("eventDate")} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Hora inicio</span>
                <input type="time" value={formData.showStart} onChange={set("showStart")} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Hora fin</span>
                <input type="time" value={formData.salesClose} onChange={set("salesClose")} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
              </label>
            </div>
            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Descripción</span>
              <textarea value={formData.description} onChange={set("description")} rows={4} placeholder="Describe el evento, artistas, recomendaciones..." className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y" />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">URL de banner (opcional)</span>
              <input value={formData.bannerDesktopUrl} onChange={set("bannerDesktopUrl")} placeholder="https://..." className="mt-1.5 w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </label>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-4">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm p-5">
            <h3 className="font-display text-sm font-bold text-on-surface">Publicación</h3>
            <p className="text-xs text-outline mt-1 mb-4">Puedes crear como borrador y publicar después desde la edición del evento.</p>
            <div className="space-y-2">
              <button type="button" onClick={() => handleCreate(false)} disabled={creating} className="w-full py-3 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary-container disabled:opacity-60">{creating ? "Creando..." : "Crear y publicar"}</button>
              <button type="button" onClick={() => handleCreate(true)} disabled={creating} className="w-full py-3 rounded-xl bg-surface-container text-on-surface text-sm font-semibold hover:bg-surface-container-high disabled:opacity-60">Crear como borrador</button>
              <Link to="/organizador/eventos" className="block w-full py-3 rounded-xl text-center text-sm font-medium text-outline hover:bg-surface-container">Cancelar</Link>
            </div>
          </div>
          <div className="bg-primary/[0.04] rounded-2xl border border-primary/10 p-4">
            <div className="flex gap-2 text-primary">
              <span className="material-symbols-outlined text-[18px]">info</span>
              <div className="text-xs text-on-surface-variant">
                <p className="font-semibold text-on-surface">Después de crear</p>
                <p className="mt-0.5">Configura <strong>entradas/tarifas</strong>, ajusta estado y revisa métricas desde el dashboard.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />
    </div>
  );
}

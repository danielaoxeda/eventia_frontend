interface EventFormGeneralProps {
  title: string;
  category: string;
  capacity: number;
  venue: string;
  onChange: (field: string, value: string | number) => void;
}

export default function EventFormGeneral({ title, category, capacity, venue, onChange }: EventFormGeneralProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2.5 pb-1">
        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[20px]">assignment</span>
        <div>
          <h2 className="font-display text-lg font-semibold text-on-surface">Datos del evento</h2>
          <p className="text-xs text-on-surface-variant">Campos conectados al backend.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">Nombre del evento <span className="text-secondary">*</span></label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            maxLength={150}
            placeholder="Ej. Lima Live Sessions 2025"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="Nombre de categoría (ej. Conciertos)"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
          <span className="text-[0.6875rem] text-outline">Se usa el nombre para resolver la categoría en backend.</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">Aforo total <span className="text-secondary">*</span></label>
          <input
            type="number"
            value={capacity > 0 ? capacity : ""}
            onChange={(e) => onChange("capacity", parseInt(e.target.value, 10) || 0)}
            placeholder="Ej. 15000"
            min={1}
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">Ubicación / sede <span className="text-secondary">*</span></label>
          <input
            type="text"
            value={venue}
            onChange={(e) => onChange("venue", e.target.value)}
            placeholder="Ej. Arena 1 Costa Verde, San Miguel"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>
    </section>
  );
}

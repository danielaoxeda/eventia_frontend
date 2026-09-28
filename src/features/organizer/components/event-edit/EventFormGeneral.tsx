interface EventFormGeneralProps {
  title: string;
  category: string;
  capacity: number;
  venue: string;
  address: string;
  onChange: (field: string, value: string | number) => void;
}

const CATEGORIES = [
  "Música & Conciertos",
  "Festivales & Open Air",
  "Teatro & Artes Escénicas",
  "Deportes & Espectáculos Masivos",
  "Conferencias & Tech",
  "Cultura & Danza",
  "Convenciones",
];

const VENUES = [
  "Estadio Nacional del Perú",
  "Arena 1 Costa Verde, San Miguel",
  "Jockey Club del Perú - Pelousse",
  "Arena Bicentenario Miraflores",
  "Jardín de la Cerveza, Arequipa",
  "Valle Sagrado Soundpark, Cusco",
  "Centro de Convenciones de Lima",
  "Coliseo Gran Chimú, Trujillo",
  "Parque de la Exposición, Lima",
];

export default function EventFormGeneral({
  title,
  category,
  capacity,
  venue,
  address,
  onChange,
}: EventFormGeneralProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center material-symbols-outlined text-[20px]">
            assignment
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Datos Generales del Evento
            </h2>
            <p className="text-xs text-on-surface-variant">
              Configuración base, categoría oficial y localización.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Nombre del Evento - Full Width */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface flex items-center justify-between">
            <span>
              Nombre Oficial del Evento <span className="text-secondary">*</span>
            </span>
            <span className="text-[0.6875rem] text-outline">Máx. 80 caracteres</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChange("title", e.target.value)}
            maxLength={80}
            placeholder="Ej. Lima Live Sessions 2025"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">
            Categoría Oficial <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onChange("category", e.target.value)}
              className="w-full appearance-none bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
            >
              <option value="" disabled>
                Selecciona una categoría...
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none text-[20px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Aforo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">
            Aforo Total Autorizado <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={capacity > 0 ? capacity : ""}
              onChange={(e) => onChange("capacity", parseInt(e.target.value) || 0)}
              placeholder="Ej. 15000"
              min={1}
              className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all pl-10"
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-outline text-[18px]">
              groups
            </span>
          </div>
          <span className="text-[0.6875rem] text-outline">Capacidad auditada del recinto</span>
        </div>

        {/* Recinto */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">
            Recinto Oficial <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <select
              value={venue}
              onChange={(e) => onChange("venue", e.target.value)}
              className="w-full appearance-none bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all pr-10"
            >
              <option value="" disabled>
                Selecciona un recinto oficial...
              </option>
              {VENUES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-3 text-outline pointer-events-none text-[20px]">
              stadium
            </span>
          </div>
        </div>

        {/* Dirección */}
        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-on-surface">Dirección / Punto de Ingreso</label>
          <input
            type="text"
            value={address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Ej. Circuito de Playas S/N, San Miguel, Lima"
            className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>
    </section>
  );
}

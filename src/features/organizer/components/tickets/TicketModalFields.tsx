interface TicketModalFieldsProps {
  name: string;
  setName: (v: string) => void;
  zone: string;
  setZone: (v: string) => void;
  pricePEN: number | "";
  setPricePEN: (v: number | "") => void;
  capacity: number | "";
  setCapacity: (v: number | "") => void;
  isPresale: boolean;
  setIsPresale: (v: boolean) => void;
  maxPerPurchase: number;
  setMaxPerPurchase: (v: number) => void;
  saleStartDate: string;
  setSaleStartDate: (v: string) => void;
  saleEndDate: string;
  setSaleEndDate: (v: string) => void;
}

const ZONE_OPTIONS = [
  "VIP Platinum",
  "VIP",
  "General",
  "Tribuna Occidente",
  "Tribuna Oriente",
  "Tribuna Norte",
  "Tribuna Sur",
  "Palcos / Boxes",
  "Campo A",
  "Campo B",
];

export default function TicketModalFields({
  name,
  setName,
  zone,
  setZone,
  pricePEN,
  setPricePEN,
  capacity,
  setCapacity,
  isPresale,
  setIsPresale,
  maxPerPurchase,
  setMaxPerPurchase,
  saleStartDate,
  setSaleStartDate,
  saleEndDate,
  setSaleEndDate,
}: TicketModalFieldsProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Nombre de la tarifa */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold text-on-surface">
          Nombre de la Tarifa <span className="text-secondary">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Campo VIP Platinum - Fase 1"
          className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Zona / Categoría */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface">
            Zona Física del Recinto <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <select
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              className="w-full appearance-none bg-surface-container-low px-3.5 py-2.5 rounded-xl text-on-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary pr-8"
            >
              {ZONE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-2.5 text-outline pointer-events-none text-[18px]">
              expand_more
            </span>
          </div>
        </div>

        {/* Precio en PEN */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface">
            Precio (Soles PEN) <span className="text-secondary">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-xs font-bold text-outline">
              S/
            </span>
            <input
              type="number"
              min={0}
              step={0.5}
              value={pricePEN}
              onChange={(e) => setPricePEN(e.target.value === "" ? "" : parseFloat(e.target.value))}
              placeholder="250.00"
              className="w-full bg-surface-container-low pl-8 pr-3.5 py-2.5 rounded-xl text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
        </div>

        {/* Aforo / Cupo */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface">
            Cupo / Aforo Asignado <span className="text-secondary">*</span>
          </label>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(e.target.value === "" ? "" : parseInt(e.target.value))}
            placeholder="Ej. 2500"
            className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Máximo por compra */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface">Límite por Comprador</label>
          <input
            type="number"
            min={1}
            max={20}
            value={maxPerPurchase}
            onChange={(e) => setMaxPerPurchase(parseInt(e.target.value) || 4)}
            className="w-full bg-surface-container-low px-3.5 py-2.5 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Switch de Preventa */}
      <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between border border-outline-variant/15">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-on-surface">¿Es tarifa de Preventa?</span>
          <span className="text-[0.6875rem] text-outline">
            Aplica etiqueta de preventa bancaria o Early Bird
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPresale}
            onChange={(e) => setIsPresale(e.target.checked)}
          />
          <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      {/* Fechas de disponibilidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">
            Inicio de Venta
          </label>
          <input
            type="date"
            value={saleStartDate}
            onChange={(e) => setSaleStartDate(e.target.value)}
            className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-on-surface-variant">
            Fin de Venta
          </label>
          <input
            type="date"
            value={saleEndDate}
            onChange={(e) => setSaleEndDate(e.target.value)}
            className="w-full bg-surface-container-low px-3.5 py-2 rounded-xl text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

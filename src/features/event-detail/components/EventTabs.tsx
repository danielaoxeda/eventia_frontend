import { formatPEN } from "../services/event-detail.service";
import type { DetailTabId, TicketTier, TicketTierId, } from "../types/event-detail.types";

const TABS: { id: DetailTabId; label: string; icon: string }[] = [
  { id: "zones", label: "Zonas y Mapa", icon: "map" },
  { id: "info", label: "Información & Line-up", icon: "info" },
  { id: "policies", label: "Políticas y Biometría", icon: "policy" },
];

interface EventTabsProps {
  activeTab: DetailTabId;
  onTabChange: (tab: DetailTabId) => void;
  onSelectTier: (tier: TicketTierId) => void;
  /** Localidades desde db.json (tipos de entrada del evento). */
  tiers: TicketTier[];
  /** Descripción del evento desde db.json. */
  eventDescription: string;
}

function ZoneArea({
  label,
  onSelect,
  children,
}: {
  label: string;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <g
      className="cursor-pointer"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-label={label}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      {children}
    </g>
  );
}

/** Colores de las franjas del mapa (cíclicos). */
const ZONE_FILLS = ["#4f46e5", "#6f3dd9", "#3525cd"];

/**
 * Pestañas de la ficha. Las zonas del mapa se generan desde las localidades
 * de db.json y son botones accesibles (click + teclado) que resaltan la
 * localidad en el checkout.
 */
export default function EventTabs({
  activeTab,
  onTabChange,
  onSelectTier,
  tiers,
  eventDescription,
}: EventTabsProps) {
  const zones = tiers.slice(0, 3);
  return (
    <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm min-w-0">
      <div
        className="flex items-center gap-2 pb-3 overflow-x-auto"
        role="tablist"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              activeTab === item.id
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {activeTab === "zones" && (
        <div className="mt-2 min-w-0">
          <div className="mb-2 min-w-0">
            <h3 className="font-display font-semibold text-lg text-balance">
              Localidades disponibles
            </h3>
            <p className="text-sm text-outline">
              Toca una zona para resaltar su localidad en el panel de compra.
            </p>
          </div>

          {zones.length === 0 ? (
            <p className="text-sm text-outline bg-surface-container-low rounded-xl p-4">
              Este evento no tiene localidades a la venta por ahora.
            </p>
          ) : (
            <div className="bg-surface-container-low rounded-xl p-4 flex flex-col items-center min-w-0 overflow-hidden">
              <svg
                viewBox="0 0 600 380"
                className="w-full max-w-135 h-auto drop-shadow-sm"
                role="img"
                aria-label="Mapa de zonas del recinto"
              >
                <rect
                  x="50"
                  y="20"
                  width="500"
                  height="340"
                  rx="120"
                  fill="#e2e7ff"
                  opacity="0.6"
                />
                <rect
                  x="75"
                  y="45"
                  width="450"
                  height="290"
                  rx="90"
                  fill="#ffffff"
                />
                <rect
                  x="180"
                  y="55"
                  width="240"
                  height="42"
                  rx="6"
                  fill="#131b2e"
                />
                <text
                  x="300"
                  y="80"
                  textAnchor="middle"
                  fill="#faf8ff"
                  fontSize="14"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  ESCENARIO PRINCIPAL
                </text>
                {zones.map((tier, index) => {
                  const y = 110 + index * 80;
                  return (
                    <ZoneArea
                      key={tier.id}
                      label={`Seleccionar ${tier.name}`}
                      onSelect={() => onSelectTier(tier.id)}
                    >
                      <rect
                        x="160"
                        y={y}
                        width="280"
                        height="70"
                        rx="8"
                        fill={ZONE_FILLS[index % ZONE_FILLS.length]}
                      />
                      <text
                        x="300"
                        y={y + 30}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="700"
                      >
                        {tier.name.toUpperCase()}
                      </text>
                      <text
                        x="300"
                        y={y + 50}
                        textAnchor="middle"
                        fill="#e9ddff"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {formatPEN(tier.price)} • {tier.note}
                      </text>
                    </ZoneArea>
                  );
                })}
              </svg>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-3 bg-white/80 px-4 py-2 rounded-lg w-full text-xs">
                {zones.map((tier, index) => (
                  <span
                    key={tier.id}
                    className="flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: ZONE_FILLS[index % ZONE_FILLS.length],
                      }}
                    ></span>
                    {tier.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "info" && (
        <div className="mt-2 min-w-0">
          <h3 className="font-display font-semibold text-lg mb-2">
            Sobre el evento
          </h3>
          <p className="text-[0.9375rem] text-on-surface-variant leading-relaxed wrap-break-word">
            {eventDescription}
          </p>
        </div>
      )}

      {activeTab === "policies" && (
        <div className="mt-2 p-4 rounded-xl bg-surface-container-low flex flex-col gap-4 min-w-0">
          <div className="flex items-start gap-3 min-w-0">
            <span className="material-symbols-outlined text-primary text-[24px] shrink-0">
              verified_user
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold">
                Entradas nominadas e intransferibles
              </h4>
              <p className="text-sm text-on-surface-variant wrap-break-word">
                Cada entrada se emite con nombre, apellidos y documento
                (DNI/CE/Pasaporte) del asistente final. El cambio de titular es
                gratuito hasta 48h antes del evento.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 min-w-0">
            <span className="material-symbols-outlined text-secondary text-[24px] shrink-0">
              security
            </span>
            <div className="min-w-0">
              <h4 className="text-sm font-bold">
                Validación QR dinámica en puerta
              </h4>
              <p className="text-sm text-on-surface-variant wrap-break-word">
                El QR se activa 3 horas antes de la apertura. No aceptes códigos
                impresos de revendedores ni capturas estáticas.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

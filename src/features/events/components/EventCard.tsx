import { Link } from "react-router-dom";
import { formatPrice } from "../services/events.service";
import type { CatalogEvent, ViewMode } from "../types/event.types";

interface EventCardProps {
  event: CatalogEvent;
  view: ViewMode;
}

/** Tarjeta de evento: foto, fecha, título, recinto, precio y acceso al detalle. */
export default function EventCard({ event, view }: EventCardProps) {
  const isList = view === "list";

  return (
    <article
      className={`bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex group relative min-w-0 w-full ${
        isList ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      <div
        className={`relative overflow-hidden bg-surface-container-high shrink-0 min-w-0 ${
          isList ? "w-full sm:w-52 lg:w-56 aspect-video sm:aspect-auto sm:min-h-47.5" : "w-full aspect-video"
        }`}
      >
        {/* Sin imagen en db.json se muestra el fondo con gradiente. */}
        {event.image !== "" && (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
            src={event.image}
            alt={event.title}
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent pointer-events-none"></div>
        {/* Etiqueta de categoría sobre la foto. */}
        {event.tag && (
          <span className="absolute top-3 left-3 bg-primary-container/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm max-w-[45%] truncate">
            {event.tag}
          </span>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between gap-3 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="bg-surface-container flex flex-col items-center justify-center min-w-12.5 py-1.5 px-2 rounded-lg text-center shrink-0">
            <span className="text-[11px] uppercase font-bold text-primary">{event.month}</span>
            <span className="font-display font-extrabold text-xl leading-none">{event.day}</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="font-display font-bold text-base sm:text-lg group-hover:text-primary transition-colors wrap-break-word line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center gap-1 text-on-surface-variant text-sm mt-0.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-outline shrink-0">
                location_on
              </span>
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 flex-wrap min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-outline uppercase font-medium">Desde</span>
            <span className="font-display font-bold text-xl sm:text-[1.4rem] text-primary whitespace-nowrap">
              {formatPrice(event.price)}
            </span>
          </div>
          <Link
            // Navega al detalle; el checkout valida ahí la promo con la sesión.
            to={`/event/${event.id}`}
            className="px-4 py-2 bg-primary hover:opacity-90 text-on-primary rounded-lg text-sm font-bold shadow-sm transition-all shrink-0"
          >
            Comprar Entradas
          </Link>
        </div>
      </div>
    </article>
  );
}

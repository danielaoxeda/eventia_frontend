interface EventHeroProps {
  title: string;
  venue: string;
  month: string;
  day: string;
}

/** Portada del evento con datos de db.json: foto, título y recinto. */
export default function EventHero({ title, venue, month, day }: EventHeroProps) {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-sm bg-surface-container-lowest min-w-0">
      <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-surface-container-high">
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

        <div className="absolute bottom-4 right-4 bg-white/95 rounded-lg p-3 text-center shadow-md shrink-0">
          <span className="block text-[11px] font-bold uppercase text-secondary tracking-widest">
            {month}
          </span>
          <span className="block font-display font-extrabold text-2xl leading-none">{day}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-24 text-white min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl tracking-tight drop-shadow-md font-bold wrap-break-word">
            {title}
          </h1>
          <p className="text-sm flex items-center gap-1 mt-1 drop-shadow-sm min-w-0">
            <span className="material-symbols-outlined text-[18px] shrink-0">location_on</span>
            <span className="truncate">{venue}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

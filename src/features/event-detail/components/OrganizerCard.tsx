/** Fila del organizador verificado. */
export default function OrganizerCard() {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-3 min-w-0">
      <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold shrink-0">
        EL
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold truncate flex items-center gap-1.5">
          Eventia Live Productions Perú
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0">
            verified
          </span>
        </h3>
        <p className="text-xs text-outline truncate">Organizador verificado</p>
      </div>
    </div>
  );
}

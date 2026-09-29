/** Cinta de alta concurrencia. */
export default function ConcurrencyAlert() {
  return (
    <div className="w-full bg-primary text-on-primary py-2 px-4 sm:px-6 shadow-sm overflow-hidden">
      <p className="max-w-[1280px] mx-auto flex items-center gap-2 text-xs sm:text-sm min-w-0 truncate">
        <span className="material-symbols-outlined text-[20px] shrink-0">
          local_fire_department
        </span>
        <span className="truncate">
          <strong className="font-bold">Alta concurrencia:</strong> 84% del aforo reservado.
        </span>
      </p>
    </div>
  );
}

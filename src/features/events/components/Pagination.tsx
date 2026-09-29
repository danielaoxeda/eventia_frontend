interface PaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/** Navegación real: calcula rango visible y limita la página al rango válido. */
export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  // Rango "Mostrando X - Y de Z" derivado de página y tamaño.
  const safeTotalPages = Math.max(1, totalPages);
  const safePage = Math.min(Math.max(1, page), safeTotalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);
  const pageNumbers = Array.from({ length: safeTotalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Navegación de páginas de eventos"
      className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 min-w-0"
    >
      <span className="text-sm text-outline text-center sm:text-left break-words">
        Mostrando{" "}
        <strong className="text-on-surface">
          {start} - {end}
        </strong>{" "}
        de <strong className="text-on-surface">{totalItems}</strong>{" "}
        {totalItems === 1 ? "evento" : "eventos"}
      </span>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          aria-label="Página anterior"
          disabled={safePage === 1}
          onClick={() => onPageChange(safePage - 1)}
          type="button"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface-container-low disabled:opacity-60 disabled:cursor-not-allowed hover:bg-surface-container-high transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {pageNumbers.map((item) => (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
            aria-current={safePage === item ? "page" : undefined}
            className={`w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-colors shrink-0 ${
              safePage === item
                ? "bg-primary text-on-primary shadow-sm"
                : "hover:bg-surface-container-high"
            }`}
          >
            {item}
          </button>
        ))}
        <button
          aria-label="Página siguiente"
          disabled={safePage === safeTotalPages}
          onClick={() => onPageChange(safePage + 1)}
          type="button"
          className="w-9 h-9 rounded-lg flex items-center justify-center bg-surface-container-low hover:bg-surface-container-high transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>

      <div className="hidden md:flex items-center gap-1.5 text-xs text-outline whitespace-nowrap shrink-0">
        <span>Página</span>
        <span className="font-bold text-primary">
          {safePage} de {safeTotalPages}
        </span>
      </div>
    </nav>
  );
}

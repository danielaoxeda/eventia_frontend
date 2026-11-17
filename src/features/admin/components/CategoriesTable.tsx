import { ChevronLeft, ChevronRight, Layers, PenLine, PowerOff, RotateCcw, Search, X } from "lucide-react";
import type { AdminCategory, PageResponse } from "../types/admin.types";
import { formatDateTime } from "../utils/adminFormatters";
import StatusBadge from "./StatusBadge";

export type StatusFilter = "Activa" | "Inactiva" | "Todas";

interface CategoriesTableProps {
  page: PageResponse<AdminCategory>;
  search: string;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onPageChange: (page: number) => void;
  onEdit: (category: AdminCategory) => void;
  onToggleStatus: (category: AdminCategory) => void;
}

export default function CategoriesTable({
  page,
  search,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onEdit,
  onToggleStatus,
}: CategoriesTableProps) {
  // page.number es base 0 (Spring Page<T>); la UI muestra base 1
  const currentPage = page.number + 1;
  const totalPages = Math.max(1, page.totalPages);
  const startIndex = page.number * page.size;
  const currentCategories = page.content;

  const resetFilters = () => {
    onSearchChange("");
    onStatusFilterChange("Todas");
  };

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm overflow-hidden flex flex-col justify-between">
      <div>
        <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-outline-variant/20 bg-surface/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-container/40 text-primary flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-on-surface">
                Catálogo de Categorías Registradas
              </h3>
              <p className="text-xs text-on-surface-variant">
                Tabla centralizada para actualización y auditoría de taxonomías
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar categoría..."
                className="pl-9 pr-8 py-1.5 rounded-xl border border-outline-variant/40 bg-surface text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48 sm:w-60"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="inline-flex rounded-xl p-1 bg-surface-container/40 border border-outline-variant/30 text-xs">
              {(["Todas", "Activa", "Inactiva"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusFilterChange(st)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    statusFilter === st
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {st === "Todas" ? "Todas" : st === "Activa" ? "Activas" : "Inactivas"}
                </button>
              ))}
            </div>

            <span className="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-semibold rounded-full border border-outline-variant/30 shrink-0">
              {page.totalElements} Registros
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider bg-surface-container/20">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Nombre</th>
                <th className="py-3.5 px-5">Descripción</th>
                <th className="py-3.5 px-5">Estado</th>
                <th className="py-3.5 px-5">Última Actualización</th>
                <th className="py-3.5 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-xs">
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-on-surface-variant">
                    <p className="mb-2">No se encontraron categorías que coincidan con los criterios.</p>
                    {(search || statusFilter !== "Todas") && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="text-xs text-primary font-semibold hover:underline"
                      >
                        Restablecer filtros
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                currentCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-surface-container/30 transition-colors"
                  >
                    <td className="py-4 px-5 font-semibold text-on-surface-variant whitespace-nowrap">
                      #{category.id}
                    </td>

                    <td className="py-4 px-5 font-bold text-sm text-on-surface whitespace-nowrap">
                      {category.name}
                    </td>

                    <td className="py-4 px-5 text-on-surface-variant leading-relaxed">
                      {category.description || "—"}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <StatusBadge active={category.active} activeLabel="Activa" inactiveLabel="Inactiva" />
                    </td>

                    <td className="py-4 px-5 text-xs text-on-surface-variant font-mono whitespace-nowrap">
                      {formatDateTime(category.updatedAt)}
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(category)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container hover:text-on-surface transition-colors"
                          title="Editar categoría"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {category.active ? (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(category)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-error border border-error-container hover:bg-error-container/20 transition-colors"
                            title="Desactivar categoría"
                          >
                            <PowerOff className="w-3.5 h-3.5" />
                            <span>Desactivar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleStatus(category)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                            title="Activar categoría"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Activar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        <span>
          Mostrando{" "}
          <span className="font-bold text-primary">
            {page.totalElements > 0 ? startIndex + 1 : 0}–
            {startIndex + page.content.length}
          </span>{" "}
          de <span className="font-bold">{page.totalElements}</span> registros
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onPageChange(page.number - 1)}
              disabled={page.first}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber - 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                  currentPage === pageNumber
                    ? "bg-primary text-on-primary"
                    : "border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={() => onPageChange(page.number + 1)}
              disabled={page.last}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
            >
              Siguiente
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

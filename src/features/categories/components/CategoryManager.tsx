import type { AdminCategory } from "../types/category.types";

interface CategoryManagerProps {
  categories: AdminCategory[];
  onToggle: (id: string) => void;
  onToast: (title: string, description: string) => void;
}

/** Tabla de categorías con activar/desactivar seguro (sin DELETE físico). */
export default function CategoryManager({ categories, onToggle, onToast }: CategoryManagerProps) {
  return (
    <section className="flex flex-col gap-4 mt-4 min-w-0">
      <div className="bg-gradient-to-r from-secondary-fixed via-surface-container-high to-primary-fixed/40 p-4 rounded-2xl shadow-sm min-w-0 overflow-hidden">
        <div className="flex items-start gap-4 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[28px]">gavel</span>
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded bg-secondary text-on-secondary whitespace-nowrap">
                Protección de datos
              </span>
              <span className="text-[11px] text-on-secondary-fixed-variant font-semibold">
                Integridad referencial
              </span>
            </div>
            <h2 className="font-display font-bold text-xl text-balance">
              Las categorías no se eliminan, se desactivan
            </h2>
            <p className="text-[0.9375rem] text-on-surface-variant max-w-4xl leading-relaxed break-words">
              Desactivar una categoría la oculta de la cartelera pero{" "}
              <strong className="font-bold">preserva compras, liquidaciones y reportes</strong> sin
              borrado definitivo.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden min-w-0">
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-container/40 min-w-0">
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-lg">Categorías de eventos registradas</h3>
            <p className="text-xs text-outline">Catálogo usado en segmentación y búsqueda</p>
          </div>
          <div className="flex items-center gap-2 text-xs bg-surface-container-high px-3 py-1.5 rounded-lg shrink-0">
            <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
            <span className="whitespace-nowrap">Baja lógica activa</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-4 font-semibold">Categoría oficial</th>
                <th className="py-3.5 px-4 font-semibold">Eventos</th>
                <th className="py-3.5 px-4 font-semibold">Volumen</th>
                <th className="py-3.5 px-4 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acción segura</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {categories.map((category) => (
                <tr key={category.id} className={`hover:bg-surface-container/50 transition-colors ${category.isActive ? "" : "bg-surface-container-low/60 opacity-80"}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[22px]">{category.icon}</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={`text-sm font-bold truncate ${category.isActive ? "" : "line-through text-outline"}`}>
                          {category.name}
                        </span>
                        <span className="text-xs text-outline truncate">
                          Slug: <code className="font-mono text-primary font-semibold">{category.slug}</code>
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold whitespace-nowrap">{category.events} eventos</span>
                    <span className="block text-[11px] text-emerald-600 font-semibold whitespace-nowrap">{category.liveLabel}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold whitespace-nowrap">{category.volume}</span>
                    <span className="block text-[11px] text-outline">Histórico protegido</span>
                  </td>
                  <td className="py-4 px-4">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-[11px] font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Inactiva
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        onToggle(category.id);
                        onToast(
                          category.isActive ? "Categoría desactivada" : "Categoría reactivada",
                          category.isActive
                            ? `"${category.name}" oculta de cartelera, historial intacto.`
                            : `"${category.name}" visible de nuevo en cartelera.`,
                        );
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors whitespace-nowrap ${
                        category.isActive
                          ? "bg-secondary-fixed text-on-secondary-fixed hover:opacity-90"
                          : "bg-primary-fixed text-on-primary-fixed hover:opacity-90"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {category.isActive ? "toggle_off" : "toggle_on"}
                      </span>
                      <span>{category.isActive ? "Desactivar" : "Reactivar"}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
        {[
          { icon: "database", title: "Modelo de persistencia", description: "Las relaciones con eventos y tickets quedan protegidas, sin borrado en cascada." },
          { icon: "receipt_long", title: "Auditoría fiscal", description: "Los comprobantes conservan la categoría de la venta original." },
          { icon: "history", title: "Trazabilidad completa", description: "Cada cambio queda registrado para reportes y bitácora." },
        ].map((item) => (
          <div key={item.title} className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2 text-primary text-sm font-bold min-w-0">
              <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
              <span className="truncate">{item.title}</span>
            </div>
            <p className="text-sm text-on-surface-variant break-words">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

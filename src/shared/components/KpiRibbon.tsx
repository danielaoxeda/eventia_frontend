interface KpiRibbonProps {
  activeCategories: number;
  totalCategories: number;
}

export default function KpiRibbon({ activeCategories, totalCategories }: KpiRibbonProps) {
  const kpis = [
    {
      title: "Identidades Registradas",
      value: "2,842",
      detail: "● 98.4% validadas",
      detailClass: "text-emerald-600",
      icon: "groups",
      iconClass: "bg-primary-fixed text-primary",
    },
    {
      title: "Staff de Puerta Activo",
      value: "38 Operadores",
      detail: "Costa Verde & Jockey Club",
      detailClass: "text-primary",
      icon: "qr_code_scanner",
      iconClass: "bg-surface-container-high",
    },
    {
      title: "Categorías Activas",
      value: `${activeCategories} de ${totalCategories}`,
      detail: "Baja lógica activa",
      detailClass: "text-on-surface-variant",
      icon: "category",
      iconClass: "bg-tertiary-container/20 text-tertiary",
    },
    {
      title: "Auditoría",
      value: "100% OK",
      detail: "Integridad referencial intacta",
      detailClass: "text-emerald-600",
      icon: "verified",
      iconClass: "bg-surface-container-high text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-4 min-w-0">
      {kpis.map((kpi) => (
        <div
          key={kpi.title}
          className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between gap-2 min-w-0"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-[11px] text-outline uppercase tracking-wider truncate">
              {kpi.title}
            </span>
            <span className="font-display font-semibold text-2xl mt-1 whitespace-nowrap">
              {kpi.value}
            </span>
            <span className={`text-xs font-semibold mt-0.5 truncate ${kpi.detailClass}`}>
              {kpi.detail}
            </span>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconClass}`}
          >
            <span className="material-symbols-outlined text-[26px]">{kpi.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

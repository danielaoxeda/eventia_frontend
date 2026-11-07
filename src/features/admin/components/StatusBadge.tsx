interface StatusBadgeProps {
  /**
   * Estado a representar: 'Activo'/'Inactivo' (usuarios) o 'Activa'/'Inactiva' (categorías).
   */
  status: "Activo" | "Inactivo" | "Activa" | "Inactiva";
}

/**
 * Componente reutilizable para visualizar el estado de activación en tablas del panel de administración.
 * Aplica diseño verde para estados activos y rojo/error para inactivos, con un indicador circular.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "Activo" || status === "Activa";

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-error bg-error-container/30 border border-error-container">
      <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
      {status}
    </span>
  );
}

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export default function StatusBadge({
  active,
  activeLabel = "Activo",
  inactiveLabel = "Inactivo",
}: StatusBadgeProps) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
        {activeLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-error bg-error-container/30 border border-error-container">
      <span className="w-1.5 h-1.5 rounded-full bg-error shrink-0" />
      {inactiveLabel}
    </span>
  );
}

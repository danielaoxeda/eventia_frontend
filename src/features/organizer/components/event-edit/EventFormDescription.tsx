interface EventFormDescriptionProps {
  description: string;
  onChange: (field: string, value: string) => void;
}

export default function EventFormDescription({ description, onChange }: EventFormDescriptionProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center material-symbols-outlined text-[20px]">
            edit_note
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Descripción
            </h2>
            <p className="text-xs text-on-surface-variant">
              Descripción del evento.
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-surface-container-low rounded-lg flex flex-col gap-3">
        <textarea
          value={description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={6}
          className="w-full bg-transparent p-4 text-sm text-on-surface resize-y focus:outline-none"
          placeholder="Describe el evento, políticas de acceso, restricciones..."
        />
      </div>
    </section>
  );
}

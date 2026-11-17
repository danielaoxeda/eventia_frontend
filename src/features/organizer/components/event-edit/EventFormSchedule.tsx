interface EventFormScheduleProps {
  eventDate: string;
  showStart: string;
  salesClose: string;
  onChange: (field: string, value: string) => void;
}

export default function EventFormSchedule({ eventDate, showStart, salesClose, onChange }: EventFormScheduleProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2.5 pb-1">
        <span className="w-8 h-8 rounded-lg bg-tertiary-container/15 text-tertiary flex items-center justify-center material-symbols-outlined text-[20px]">schedule</span>
        <div>
          <h2 className="font-display text-lg font-semibold text-on-surface">Fecha y horario</h2>
          <p className="text-xs text-on-surface-variant">Fecha, hora de inicio y hora de fin del evento.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.6875rem] text-on-surface-variant font-semibold">Fecha</label>
          <input type="date" value={eventDate} onChange={(e) => onChange("eventDate", e.target.value)} className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.6875rem] text-on-surface-variant font-semibold">Hora inicio</label>
          <input type="time" value={showStart} onChange={(e) => onChange("showStart", e.target.value)} className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[0.6875rem] text-on-surface-variant font-semibold">Hora fin</label>
          <input type="time" value={salesClose} onChange={(e) => onChange("salesClose", e.target.value)} className="w-full bg-surface-container-low px-3 py-2 rounded-lg text-on-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
    </section>
  );
}

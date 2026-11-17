interface EventFormBannersProps {
  bannerDesktopUrl: string;
  onChange: (field: string, value: string) => void;
}

export default function EventFormBanners({ bannerDesktopUrl, onChange }: EventFormBannersProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2.5 pb-1">
        <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center material-symbols-outlined text-[20px]">panorama</span>
        <div>
          <h2 className="font-display text-lg font-semibold text-on-surface">Imagen del evento</h2>
          <p className="text-xs text-on-surface-variant">URL del banner (opcional).</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={bannerDesktopUrl}
          onChange={(e) => onChange("bannerDesktopUrl", e.target.value)}
          placeholder="https://..."
          className="w-full bg-surface-container-low px-4 py-2.5 rounded-lg text-on-surface text-sm placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
        {bannerDesktopUrl ? (
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container border border-outline-variant/20">
            <img src={bannerDesktopUrl} alt="Banner del evento" className="w-full h-full object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

interface EventFormBannersProps {
  bannerDesktopUrl: string;
  bannerMobileUrl?: string;
}

export default function EventFormBanners({ bannerDesktopUrl }: EventFormBannersProps) {
  return (
    <section className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-surface-container-high text-primary flex items-center justify-center material-symbols-outlined text-[20px]">
            panorama
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Banners de Campaña
            </h2>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Banner Desktop */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-on-surface font-semibold">
              Banner Principal
            </span>
            <span className="text-[0.6875rem] text-outline">1920 x 1080 px</span>
          </div>
          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-surface-container group">
            <img
              src={bannerDesktopUrl}
              alt="Banner Desktop del evento"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent opacity-90" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-on-tertiary">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span className="text-[0.6875rem] font-medium">banner_desktop_master.webp (1.2 MB)</span>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 bg-surface-container-lowest/80 backdrop-blur-md rounded text-on-surface text-[0.6875rem] hover:bg-surface-container-lowest transition-colors"
              >
                Reemplazar
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

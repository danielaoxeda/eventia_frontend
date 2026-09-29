export interface ToastData {
  title: string;
  description: string;
}

export default function Toast({ toast }: { toast: ToastData | null }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-[calc(100vw-3rem)]">
      <div className="flex items-center gap-3 bg-on-surface text-surface px-4 py-3 rounded-xl shadow-xl max-w-md">
        <span className="material-symbols-outlined text-emerald-400 text-[22px] shrink-0">
          check_circle
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold truncate">{toast.title}</span>
          <span className="text-sm opacity-80 break-words">{toast.description}</span>
        </div>
      </div>
    </div>
  );
}

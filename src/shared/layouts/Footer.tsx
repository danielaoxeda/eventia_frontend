/** Pie compacto: marca, enlaces mínimos y copyright. */
export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low mt-10 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="font-display font-semibold text-primary whitespace-nowrap">
          Eventia S.A.C.
        </span>
        <span className="text-xs text-outline whitespace-nowrap">© 2025 Eventia · Lima, Perú</span>
      </div>
    </footer>
  );
}

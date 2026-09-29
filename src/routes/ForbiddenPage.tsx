import { Link } from "react-router-dom";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-2 bg-surface px-4 text-center">
      <h1 className="font-display font-extrabold text-4xl">403</h1>
      <p className="text-sm text-on-surface-variant">
        No tienes permiso para ver esta página
      </p>
      <Link
        to="/"
        className="mt-2 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg"
      >
        Volver al catálogo
      </Link>
    </div>
  );
}

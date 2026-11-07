import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QrCode from "react-qr-code";
import { Ticket } from "lucide-react";
import api from "@/shared/services/api";
import { useAuth } from "@/context/AuthContext";

interface MyTicket {
  id: string;
  event_title: string;
  ticket_type: string;
  event_date: string;
  venue: string;
  qr_code: string;
  status: string;
}

function statusClass(status: string): string {
  if (status === "VIGENTE") return "bg-green-100 text-green-700";
  if (status === "USADO") return "bg-gray-200 text-gray-600";
  return "bg-red-100 text-red-700";
}

function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MisTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<MyTicket[] | null>(null);
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    api
      .get<MyTicket[]>(`/tickets?id_user=${user.id}`)
      .then(({ data }) => {
        if (!cancelled) setTickets(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [user, refresh]);

  const loading = user !== null && tickets === null && !error;

  const handleRetry = () => {
    setError(false);
    setTickets(null);
    setRefresh((r) => r + 1);
  };

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopiedId(code);
        window.setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {});
  };

  const header = (
    <div className="flex items-center gap-3 mb-6">
      <Ticket className="h-8 w-8 text-indigo-600" />
      <h1 className="text-3xl font-extrabold text-slate-900">Mis Entradas</h1>
    </div>
  );

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        {header}
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600 mb-4">
            Inicia sesión para ver tus entradas.
          </p>
          <Link
            to="/login"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {header}

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600">Cargando tus entradas...</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-red-700 mb-4">
            No se pudieron cargar tus entradas.
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && tickets?.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600 mb-4">
            Aún no tienes entradas. ¡Compra desde el catálogo!
          </p>
          <Link
            to="/"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg"
          >
            Ver eventos
          </Link>
        </div>
      )}

      {!loading && !error && tickets && tickets.length > 0 && (
        <ul className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center gap-4"
            >
              <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${statusClass(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <h2 className="mt-2 font-display font-extrabold text-lg text-slate-900">
                  {ticket.event_title}
                </h2>
                <p className="text-sm text-slate-600">{ticket.ticket_type}</p>
                <p className="text-sm text-slate-500">
                  {formatEventDate(ticket.event_date)} · {ticket.venue}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Entrada {ticket.id}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-2">
                <div className="rounded-lg border border-slate-200 bg-white p-2">
                  <QrCode value={ticket.qr_code} size={112} />
                </div>
                <span className="font-mono text-[10px] text-slate-500 break-all text-center max-w-[150px]">
                  {ticket.qr_code}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(ticket.qr_code)}
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
                >
                  {copiedId === ticket.qr_code ? "¡Copiado!" : "Copiar código"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Ticket } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getMyTickets, type BuyerTicket } from "../services/tickets.service";

function statusClass(status: string): string {
  const s = (status || "").toUpperCase();
  if (["VIGENTE", "VALID", "ACTIVE", "EMITIDO"].includes(s)) return "bg-green-100 text-green-700";
  if (["USADO", "USED", "REDEEMED"].includes(s)) return "bg-gray-200 text-gray-600";
  return "bg-red-100 text-red-700";
}

function formatEventDate(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("es-PE", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MisTicketsPage() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<BuyerTicket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyTickets()
      .then((data) => { if (!cancelled) setTickets(data); })
      .catch((err: any) => {
        if (cancelled) return;
        setError(err?.response?.data?.message || "No se pudieron cargar tus entradas. El módulo de tickets del comprador puede no estar disponible en el backend.");
      });
    return () => { cancelled = true; };
  }, [user, refresh]);

  const loading = user !== null && tickets === null && !error;

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
          <p className="text-slate-600 mb-4">Inicia sesión para ver tus entradas.</p>
          <Link to="/login" className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg">Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {header}
      {loading && <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm"><p className="text-slate-600">Cargando tus entradas...</p></div>}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-red-700 mb-4">{error}</p>
          <button onClick={() => { setError(null); setTickets(null); setRefresh((r) => r + 1); }} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg">Reintentar</button>
        </div>
      )}
      {!loading && !error && tickets?.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-600 mb-4">Aún no tienes entradas. ¡Compra desde el catálogo!</p>
          <Link to="/" className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg">Ver eventos</Link>
        </div>
      )}
      {!loading && !error && tickets && tickets.length > 0 && (
        <ul className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <li key={String(ticket.id)} className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
              <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${statusClass(ticket.status)}`}>{ticket.status}</span>
              <h2 className="mt-2 font-display font-extrabold text-lg text-slate-900">{ticket.eventTitle}</h2>
              <p className="text-sm text-slate-600">{ticket.ticketType}</p>
              <p className="text-sm text-slate-500">{formatEventDate(ticket.eventDate)}{ticket.venue ? ` · ${ticket.venue}` : ""}</p>
              <p className="mt-1 text-xs text-slate-400">Entrada #{String(ticket.id)}{ticket.orderId ? ` · Orden #${String(ticket.orderId)}` : ""}</p>
              {ticket.code ? <p className="mt-2 font-mono text-xs text-slate-500 break-all">Código: {ticket.code}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

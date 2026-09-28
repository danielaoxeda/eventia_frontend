import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Footer from "../../../shared/layouts/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import CheckoutPanel from "../components/CheckoutPanel";
import EventHero from "../components/EventHero";
import EventTabs from "../components/EventTabs";
import OrganizerCard from "../components/OrganizerCard";
import { getEventDetail, MAX_TICKETS } from "../services/event-detail.service";
import type {
  DetailTabId,
  EventDetailData,
  TicketTierId,
} from "../types/event-detail.types";
import {
  isPromoUser,
  PROMO_DISCOUNT_PCT,
} from "../../events/services/events.service";
import { useCartContext } from "@/features/checkout/hooks/useCartContext";

/**
 * Ficha del evento: hero, mapa de zonas y checkout lateral.
 * Todo sale de db.json vía el servicio según el `:id` de la ruta.
 * El descuento de la promo depende del nombre de sesión.
 */
export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { clearCart, addToCart } = useCartContext();
  const { isAuthenticated, user } = useAuth();

  // Control de pestañas del evento (mapa, info o politicas)
  const [activeTab, setActiveTab] = useState<DetailTabId>("zones");

  // Guarda la cantidad seleccionada por id de entrada
  const [quantities, setQuantities] = useState<Record<TicketTierId, number>>(
    {},
  );

  // Ficha del evento según la ruta
  const [detail, setDetail] = useState<EventDetailData | null>(null);
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    getEventDetail(id ?? "")
      .then((data) => {
        if (active) {
          setDetail(data);
          setLoadedId(id ?? "");
          setError(null);
        }
      })
      .catch(() => {
        if (active) {
          setLoadedId(id ?? "");
          setError("Revisa que el servidor esté activo (npm run server).");
        }
      });
    return () => {
      active = false;
    };
  }, [id, reload]);

  // Cargando mientras no esté cargada la ficha del id actual
  // (si el usuario navega a otro evento, loadedId deja de coincidir).
  const loading = loadedId !== id;

  /** Si el usuario inicio sesion, se toma su nombre para validad si aplica la promocion */
  const sessionName =
    isAuthenticated && user
      ? `${user.firstName} ${user.lastName}`.trim()
      : null;

  // Suma o resta entradas validando que no pase el maximo permitido
  const updateQuantity = (tierId: TicketTierId, delta: number) => {
    const totalSelected = Object.values(quantities).reduce(
      (acc, qty) => acc + qty,
      0,
    );
    const currentQty = quantities[tierId] ?? 0;
    const newQty = currentQty + delta;

    if (newQty < 0) return;
    if (delta > 0 && totalSelected >= MAX_TICKETS) return;

    setQuantities({
      ...quantities,
      [tierId]: newQty,
    });
  };

  const handleRetry = () => {
    setLoadedId(null);
    setError(null);
    setReload((n) => n + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-3 px-4 text-center">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">
          progress_activity
        </span>
        <p className="text-sm text-on-surface-variant">Cargando evento...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-2 px-4 text-center">
        <span className="material-symbols-outlined text-5xl text-outline">
          cloud_off
        </span>
        <h1 className="font-display font-extrabold text-2xl">
          No se pudo cargar el evento
        </h1>
        <p className="text-sm text-on-surface-variant">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-2 px-4 py-2 bg-primary text-on-primary text-sm font-bold rounded-lg"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!detail || detail.tiers.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="font-display font-extrabold text-4xl">
          Evento no disponible
        </h1>
        <p className="text-sm text-on-surface-variant">
          No encontramos información para este evento.
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

  // Calculo de totales para la barra lateral
  const totalTickets = detail.tiers.reduce(
    (acc, tier) => acc + (quantities[tier.id] ?? 0),
    0,
  );
  const subtotal = detail.tiers.reduce(
    (acc, tier) => acc + tier.price * (quantities[tier.id] ?? 0),
    0,
  );
  const hasPromo = sessionName !== null && isPromoUser(sessionName);
  const discount = hasPromo ? (subtotal * PROMO_DISCOUNT_PCT) / 100 : 0;
  const totals = {
    count: totalTickets,
    subtotal,
    discount,
    total: subtotal - discount,
  };

  const handleProceedToCheckout = () => {
    if (totalTickets === 0) return;

    clearCart();

    detail.tiers.forEach((tier) => {
      const quantity = quantities[tier.id] ?? 0;
      if (quantity > 0) {
        addToCart({
          id_ticket_type: tier.id,
          ticket_name: tier.name,
          event_name: detail.title,
          unit_price: tier.price,
          quantity,
        });
      }
    });

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <main className="w-full pt-16 min-h-screen min-w-0">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 min-w-0">
          <Breadcrumbs title={detail.title} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start min-w-0">
            <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6 min-w-0">
              <EventHero
                title={detail.title}
                venue={detail.venue}
                month={detail.month}
                day={detail.day}
              />
              <EventTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onSelectTier={(tierId) => updateQuantity(tierId, 1)}
                tiers={detail.tiers}
                eventDescription={`${detail.title}: ${detail.dateLabel} en ${detail.venue}.`}
              />
              <OrganizerCard />
            </div>
            <div className="lg:col-span-5 lg:sticky lg:top-20 min-w-0">
              <CheckoutPanel
                tiers={detail.tiers}
                quantities={quantities}
                onUpdateQuantity={updateQuantity}
                totals={totals}
                highlightedTier={null}
                sessionName={sessionName}
                onCheckout={handleProceedToCheckout}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

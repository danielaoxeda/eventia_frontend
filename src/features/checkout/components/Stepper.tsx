import { useState } from "react";
import PaymentMethodStep from "./PaymentMethodStep";
import SummaryStep from "./SummaryStep";
import { Link, useNavigate } from "react-router-dom";
import { validateCard } from "../services/cardValidation.service";
import { useCartContext } from "../hooks/useCartContext";
import { createPurchase } from "../services/purchase.service";
import {
  isPromoUser,
  PROMO_DISCOUNT_PCT,
} from "@/features/events/services/events.service";
import { useAuth } from "@/context/AuthContext";

const steps = [
  { label: "Selección de Entradas" },
  { label: "Método de Pago" },
  { label: "Resumen y Confirmación" },
];

const CheckIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="2.5"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 12.75 6 6 9-13.5"
    />
  </svg>
);

function Stepper() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartContext();
  const { user } = useAuth();
  const [step, setStep] = useState(2);
  const [showErrors, setShowErrors] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const isLastStep = step === steps.length;
  const [card, setCard] = useState({
    number: "",
    exp: "",
    cvv: "",
    name: "",
    cuotas: "1",
  });

  const handleNext = async () => {
    if (step === 2) {
      setShowErrors(true);
      if (!cardValid) return;
    }

    if (isLastStep) {
      if (!user) {
        setPurchaseError("Necesitas iniciar sesión para completar la compra.");
        return;
      }

      setProcessing(true);
      setPurchaseError(null);
      try {
        const sessionName = `${user.firstName} ${user.lastName}`.trim();
        const discountPct = isPromoUser(sessionName) ? PROMO_DISCOUNT_PCT : 0;
        await createPurchase(items, user.id, discountPct);
        clearCart();
        navigate("/mis-tickets");
      } catch {
        setPurchaseError("No se pudo completar la compra. Inténtalo de nuevo.");
      } finally {
        setProcessing(false);
      }
      return;
    }

    setStep((s) => Math.min(steps.length, s + 1));
  };

  const handleBack = () => {
    setPurchaseError(null);
    if (step === 3) {
      setStep(2);
    } else {
      navigate(-1);
    }
  };

  // Tarjeta completada sin ningun campo obligatorio vacio
  const cardErrors = validateCard(card);
  const cardValid = Object.values(cardErrors).every((error) => error === "");

  if (items.length === 0) {
    return (
      <div className="w-full text-center py-16 flex flex-col items-center gap-3">
        <span className="material-symbols-outlined text-5xl text-outline">
          shopping_cart
        </span>
        <h2 className="font-display font-extrabold text-2xl">
          Tu carrito está vacío
        </h2>
        <p className="text-sm text-on-surface-variant">
          Agrega entradas desde el catálogo para continuar.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/*-----------------------------------------------*/}
      {/*Pasos del Formulario*/}
      <div className="flex justify-between items-center pb-6 border-b border-gray-100">
        {steps.map((item, index) => {
          const stepNumber = index + 1;
          const isActive = step === stepNumber;
          const isCompleted = step > stepNumber;

          return (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={`rounded-full w-8 h-8 sm:w-9 sm:h-9 text-xs sm:text-sm shrink-0 flex justify-center items-center font-bold transition-all 
                  ${
                    isActive || isCompleted
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  } 
                  ${isActive ? "ring-2 ring-indigo-200" : ""}`}
              >
                {isCompleted ? <CheckIcon /> : stepNumber}
              </span>

              <div className="hidden sm:flex flex-col text-left leading-tight">
                <p className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">
                  PASO {index + 1}
                </p>
                <p
                  className={`text-sm font-semibold ${
                    isActive ? "text-indigo-600" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/*-----------------------------------------------*/}
      {/*Vistas*/}
      <div className="my-6 p-4 sm:p-6 rounded-xl bg-white shadow-sm border border-gray-100">
        {step === 2 && (
          <PaymentMethodStep
            errors={cardErrors}
            showErrors={showErrors}
            card={card}
            setCard={setCard}
          />
        )}
        {step === 3 && <SummaryStep />}
      </div>
      {/*-----------------------------------------------*/}
      {/*Botones para Retroceder o Avanzar*/}
      {purchaseError && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{purchaseError}</span>
          {!user && (
            <Link to="/login" className="font-bold underline shrink-0">
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
      <div className="flex justify-between items-center">
        <button
          type="button"
          disabled={processing}
          className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={handleBack}
        >
          Atras
        </button>
        <button
          type="button"
          disabled={processing}
          className="px-4 py-2 bg-indigo-600 text-white border rounded hover:bg-indigo-700 disabled:opacity-60"
          onClick={handleNext}
        >
          {processing
            ? "Procesando..."
            : step === steps.length
              ? "Finalizar Compra"
              : "Siguiente"}
        </button>
      </div>
    </div>
  );
}

export default Stepper;

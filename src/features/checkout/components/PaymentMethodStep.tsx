import type { CardForm, CardErrors } from "../types/chekout.types";

interface Props {
  card: CardForm;
  setCard: React.Dispatch<React.SetStateAction<CardForm>>;
  errors: CardErrors;
  showErrors: boolean;
}

function PaymentMethodStep({ card, setCard, errors, showErrors }: Props) {
  const STYLE_INPUT =
    "w-full bg-[#f3f4fd] border-none rounded-md py-3 px-2 text-sm text-gray-700 font-medium";
  const STYLE_LABEL = "block text-xs font-semibold text-gray-800 mb-1.5";

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="w-full max-w-xl mx-auto py-2">
      <form onSubmit={handleForm} className="space-y-4">
        {/* Número de Tarjeta */}
        <div className="">
          <label className={STYLE_LABEL}>Numero de Tarjeta *</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={16}
            placeholder="4557891200000000"
            className={STYLE_INPUT}
            value={card.number}
            onChange={(e) =>
              setCard({
                ...card,
                number: e.target.value.replace(/\D/g, "").slice(0, 16),
              })
            }
          />
          {showErrors && errors.number && (
            <p className="text-xs text-red-600 font-medium mt-1">
              {errors.number}
            </p>
          )}
        </div>

        {/* Expiracion y CVV */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="" className={STYLE_LABEL}>
              Fecha de Expiracion *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={5}
              placeholder="MM/AA"
              className={STYLE_INPUT}
              value={card.exp}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                const exp =
                  digits.length > 2
                    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                    : digits;
                setCard({ ...card, exp });
              }}
            />
            {showErrors && errors.exp && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {errors.exp}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="" className={STYLE_LABEL}>
              CVV / CVC *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={4}
              placeholder="***"
              className={STYLE_INPUT}
              value={card.cvv}
              onChange={(e) =>
                setCard({
                  ...card,
                  cvv: e.target.value.replace(/\D/g, "").slice(0, 4),
                })
              }
            />
            {showErrors && errors.cvv && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {errors.cvv}
              </p>
            )}
          </div>
        </div>

        {/* Nombre y Cuotas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="" className={STYLE_LABEL}>
              Nombre Impreso en la Tarjeta *
            </label>
            <input
              type="text"
              maxLength={40}
              placeholder="CARLOS MENDOZA ZAPATA"
              className={`${STYLE_INPUT} uppercase`}
              value={card.name}
              onChange={(e) =>
                setCard({
                  ...card,
                  name: e.target.value
                    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]/g, "")
                    .slice(0, 40),
                })
              }
            />
            {showErrors && errors.name && (
              <p className="text-xs text-red-600 font-medium mt-1">
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="" className={STYLE_LABEL}>
              Cuotas Financieras
            </label>
            <select
              className={`${STYLE_INPUT} cursor-pointer`}
              value={card.cuotas}
              onChange={(e) => setCard({ ...card, cuotas: e.target.value })}
            >
              <option value="1">1 cuota - Directo (Sin intereses)</option>
              <option value="3">3 cuotas</option>
              <option value="6">6 cuotas</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PaymentMethodStep;

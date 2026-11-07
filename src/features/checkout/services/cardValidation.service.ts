import type { CardErrors, CardForm } from "../types/chekout.types";

export function validateCard(card: CardForm): CardErrors {
  const errors: CardErrors = { number: "", exp: "", cvv: "", name: "" };
  const numberDigits = card.number.replace(/\D/g, "");
  const expDigits = card.exp.replace(/\D/g, "");
  const cvvDigits = card.cvv.replace(/\D/g, "");

  if (numberDigits.length !== 16) {
    errors.number = "Debe tener 16 dígitos";
  }

  if (expDigits.length !== 4) {
    errors.exp = "Usa el formato MM/AA";
  } else {
    const month = Number(expDigits.slice(0, 2));
    const year = 2000 + Number(expDigits.slice(2));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (month < 1 || month > 12) {
      errors.exp = "Mes inválido";
    } else if (new Date(year, month) <= today) {
      // new Date(year, month) = primer día del mes siguiente = fin de vigencia
      errors.exp = "Tarjeta vencida";
    }
  }

  if (cvvDigits.length < 3 || cvvDigits.length > 4) {
    errors.cvv = "Debe tener 3 o 4 dígitos";
  }

  if (card.name.trim().length < 3) {
    errors.name = "Mínimo 3 caracteres";
  }

  return errors;
}

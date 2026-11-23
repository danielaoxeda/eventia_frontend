import { useState } from "react";
import type { TicketType } from "../types/organizer.types";

interface UseTicketFormModalProps {
  isOpen: boolean;
  ticketToEdit: TicketType | null;
  eventId: string;
  onSave: (data: Omit<TicketType, "id" | "soldCount"> & { id?: string }) => void;
}

interface FormValues {
  name: string;
  zone: string;
  pricePEN: number | "";
  capacity: number | "";
  isPresale: boolean;
  maxPerPurchase: number;
  saleStartDate: string;
  saleEndDate: string;
  status: TicketType["status"];
}

function buildFormValues(ticketToEdit: TicketType | null): FormValues {
  return {
    name: ticketToEdit?.name ?? "",
    zone: ticketToEdit?.zone ?? "General",
    pricePEN: ticketToEdit?.pricePEN ?? "",
    capacity: ticketToEdit?.capacity ?? "",
    isPresale: ticketToEdit?.isPresale ?? false,
    maxPerPurchase: ticketToEdit?.maxPerPurchase ?? 4,
    saleStartDate: ticketToEdit?.saleStartDate ?? "",
    saleEndDate: ticketToEdit?.saleEndDate ?? "",
    status: ticketToEdit?.status ?? "active",
  };
}

export function useTicketFormModal({
  isOpen,
  ticketToEdit,
  eventId,
  onSave,
}: UseTicketFormModalProps) {
  const [name, setName] = useState("");
  const [zone, setZone] = useState("General");
  const [pricePEN, setPricePEN] = useState<number | "">("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [isPresale, setIsPresale] = useState(false);
  const [maxPerPurchase, setMaxPerPurchase] = useState<number>(4);
  const [saleStartDate, setSaleStartDate] = useState("");
  const [saleEndDate, setSaleEndDate] = useState("");
  const [status, setStatus] = useState<TicketType["status"]>("active");
  const [errorMsg, setErrorMsg] = useState("");
  const [prevSource, setPrevSource] = useState<{ ticket: TicketType | null; isOpen: boolean } | null>(null);

  // Ajustamos el estado durante el render (patrón de React para "sincronizar
  // estado con props"), solo cuando cambia la tarifa o la apertura del modal,
  // en lugar de hacerlo de forma síncrona en un efecto.
  if (!prevSource || prevSource.ticket !== ticketToEdit || prevSource.isOpen !== isOpen) {
    setPrevSource({ ticket: ticketToEdit, isOpen });
    const values = buildFormValues(ticketToEdit);
    setName(values.name);
    setZone(values.zone);
    setPricePEN(values.pricePEN);
    setCapacity(values.capacity);
    setIsPresale(values.isPresale);
    setMaxPerPurchase(values.maxPerPurchase);
    setSaleStartDate(values.saleStartDate);
    setSaleEndDate(values.saleEndDate);
    setStatus(values.status);
    setErrorMsg("");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("El nombre de la tarifa es obligatorio.");
      return;
    }
    const priceNum = typeof pricePEN === "number" ? pricePEN : parseFloat(pricePEN);
    if (isNaN(priceNum) || priceNum < 0) {
      setErrorMsg("Ingresa un precio válido en Soles (PEN).");
      return;
    }
    const capNum = typeof capacity === "number" ? capacity : parseInt(capacity);
    if (isNaN(capNum) || capNum <= 0) {
      setErrorMsg("El aforo asignado debe ser mayor a 0.");
      return;
    }

    onSave({
      id: ticketToEdit?.id,
      eventId,
      name: name.trim(),
      zone,
      pricePEN: priceNum,
      capacity: capNum,
      isPresale,
      maxPerPurchase,
      saleStartDate: saleStartDate || undefined,
      saleEndDate: saleEndDate || undefined,
      status,
    });
  };

  return {
    name,
    setName,
    zone,
    setZone,
    pricePEN,
    setPricePEN,
    capacity,
    setCapacity,
    isPresale,
    setIsPresale,
    maxPerPurchase,
    setMaxPerPurchase,
    saleStartDate,
    setSaleStartDate,
    saleEndDate,
    setSaleEndDate,
    errorMsg,
    handleSubmit,
  };
}

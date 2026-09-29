import { useState, useEffect } from "react";
import type { TicketType } from "../types/organizer.types";

interface UseTicketFormModalProps {
  isOpen: boolean;
  ticketToEdit: TicketType | null;
  eventId: string;
  onSave: (data: Omit<TicketType, "id" | "soldCount"> & { id?: string }) => void;
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

  useEffect(() => {
    if (ticketToEdit) {
      setName(ticketToEdit.name);
      setZone(ticketToEdit.zone);
      setPricePEN(ticketToEdit.pricePEN);
      setCapacity(ticketToEdit.capacity);
      setIsPresale(ticketToEdit.isPresale ?? false);
      setMaxPerPurchase(ticketToEdit.maxPerPurchase ?? 4);
      setSaleStartDate(ticketToEdit.saleStartDate ?? "");
      setSaleEndDate(ticketToEdit.saleEndDate ?? "");
      setStatus(ticketToEdit.status);
    } else {
      setName("");
      setZone("General");
      setPricePEN("");
      setCapacity("");
      setIsPresale(false);
      setMaxPerPurchase(4);
      setSaleStartDate("");
      setSaleEndDate("");
      setStatus("active");
    }
    setErrorMsg("");
  }, [ticketToEdit, isOpen]);

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

import { useCallback, useEffect, useState } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerEventDetail } from "../services/organizerMappers";
import type { TicketType } from "../types/organizer.types";

export function useEventDetail(id?: string) {
  const [event, setEvent] = useState<OrganizerEventDetail | null>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!id) return;
    let active = true;
    Promise.all([organizerService.getEventById(id), organizerService.getTicketsByEvent(id)])
      .then(([eventData, ticketData]) => {
        if (!active) return;
        setEvent(eventData);
        setTickets(ticketData);
      })
      .catch(() => {
        if (active) setEvent(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  return { event, tickets, loading, reload };
}

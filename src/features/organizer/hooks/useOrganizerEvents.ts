import { useCallback, useEffect, useState } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent } from "../types/organizer.types";

export function useOrganizerEvents() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadEvents = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await organizerService.getEvents();
      setEvents(res);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const deactivateEvent = useCallback(async (id: string, reason = "Inactivado por el organizador") => {
    await organizerService.deactivateEvent(id, reason);
    await loadEvents();
  }, [loadEvents]);

  return { events, loading, refreshing, loadEvents, deactivateEvent };
}

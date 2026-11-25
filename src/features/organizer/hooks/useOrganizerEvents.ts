import { useCallback, useEffect, useState } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerEvent, PageResponse } from "../types/organizer.types";

const EMPTY_PAGE: PageResponse<OrganizerEvent> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
  size: 10,
  first: true,
  last: true,
};

export function useOrganizerEvents() {
  const [pageData, setPageData] = useState<PageResponse<OrganizerEvent>>(EMPTY_PAGE);
  const [pageIndex, setPageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    organizerService
      .getEventsPage(pageIndex)
      .then((data) => {
        if (!active) return;
        setPageData(data);
      })
      .catch(() => {
        if (active) setPageData(EMPTY_PAGE);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [pageIndex, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  const changePage = useCallback((page: number) => {
    setLoading(true);
    setPageIndex(page);
  }, []);

  const deactivateEvent = useCallback(
    async (id: string) => {
      await organizerService.deactivateEvent(id, "Inactivado por el organizador");
      reload();
    },
    [reload]
  );

  return {
    events: pageData.content,
    pageData,
    pageIndex,
    setPageIndex: changePage,
    loading,
    reload,
    deactivateEvent,
  };
}

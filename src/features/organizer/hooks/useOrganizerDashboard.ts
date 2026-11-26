import { useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerDashboardData } from "../types/organizer.types";

export function useOrganizerDashboard() {
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const requestDashboardData = useCallback(() => organizerService.getDashboardData(), []);

  const applyDashboardData = useCallback((res: OrganizerDashboardData) => {
    setData(res);
  }, []);

  const handleDashboardError = useCallback((err: unknown) => {
    console.error("Error loading organizer dashboard:", err);
  }, []);

  const finishLoading = useCallback(() => {
    setLoading(false);
    setRefreshing(false);
  }, []);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      applyDashboardData(await requestDashboardData());
    } catch (err) {
      handleDashboardError(err);
    } finally {
      finishLoading();
    }
  }, [requestDashboardData, applyDashboardData, handleDashboardError, finishLoading]);

  useEffect(() => {
    requestDashboardData().then(applyDashboardData, handleDashboardError).finally(finishLoading);
  }, [requestDashboardData, applyDashboardData, handleDashboardError, finishLoading]);

  return { data, loading, refreshing, loadData };
}

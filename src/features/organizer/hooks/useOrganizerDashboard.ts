import { useState, useEffect, useCallback } from "react";
import { organizerService } from "../services/organizerService";
import type { OrganizerDashboardData } from "../types/organizer.types";

export function useOrganizerDashboard() {
  const [data, setData] = useState<OrganizerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await organizerService.getDashboardData();
      setData(res);
    } catch (err) {
      console.error("Error loading organizer dashboard:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    refreshing,
    loadData,
  };
}

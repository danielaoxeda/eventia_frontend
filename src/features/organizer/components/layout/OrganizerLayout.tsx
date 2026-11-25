import { Activity, CalendarDays } from "lucide-react";
import { useAuth } from "@/context/authContext.shared";
import BackofficeLayout from "@/shared/components/backoffice/BackofficeLayout";
import type { BackofficeNavItem } from "@/shared/components/backoffice/BackofficeSidebar";

const organizerNavItems: BackofficeNavItem[] = [
  {
    path: "/organizador/dashboard",
    label: "Dashboard & Métricas",
    icon: Activity,
  },
  {
    path: "/organizador/eventos",
    label: "Eventos",
    icon: CalendarDays,
  },
];

export default function OrganizerLayout() {
  const { user, logout } = useAuth();

  return (
    <BackofficeLayout
      roleLabel="Organizador"
      navSection="MÓDULO ORGANIZADOR"
      navItems={organizerNavItems}
      user={user}
      onLogout={logout}
    />
  );
}

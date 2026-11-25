import {
  Activity,
  ClipboardList,
  FolderTree,
  Users,
} from "lucide-react";
import { useAuth } from "@/context/authContext.shared";
import BackofficeLayout from "@/shared/components/backoffice/BackofficeLayout";
import type { BackofficeNavItem } from "@/shared/components/backoffice/BackofficeSidebar";

const adminNavItems: BackofficeNavItem[] = [
  {
    path: "/admin/monitoreo",
    label: "Panel de Monitoreo",
    icon: Activity,
  },
  {
    path: "/admin/solicitudes",
    label: "Solicitudes",
    icon: ClipboardList,
  },
  {
    path: "/admin/usuarios",
    label: "Gestión de Usuarios",
    icon: Users,
  },
  {
    path: "/admin/categorias",
    label: "Gestión de Categorías",
    icon: FolderTree,
  },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <BackofficeLayout
      roleLabel="Administrador"
      navSection="ADMINISTRACIÓN"
      navItems={adminNavItems}
      user={user}
      onLogout={logout}
    />
  );
}

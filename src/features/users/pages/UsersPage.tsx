import { useState } from "react";
import { Link } from "react-router-dom";
import AdminHeader from "../../../shared/layouts/AdminHeader";
import AdminSidebar from "../../../shared/layouts/AdminSidebar";
import AdminTabs from "../../../shared/layouts/AdminTabs";
import Toast, { type ToastData } from "../../../shared/components/Toast";
import UserDirectory from "../components/UserDirectory";
import UserModal from "../components/UserModal";
import {
  INITIAL_USERS,
  buildUser,
  downloadCsv,
  exportUsersCsv,
} from "../services/users.service";
import type { AccountStatus, NewDirectoryUser, Role } from "../types/user.types";

/**
 * Gestión de usuarios: directorio filtrable con paginación, alta real,
 * cambio de estado y exporte CSV. Todo el estado vive en la página.
 */
export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AccountStatus | "ALL">("ALL");
  const [users, setUsers] = useState(INITIAL_USERS);
  const [page, setPage] = useState(1);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Toast autodestruible para confirmar cada acción.
  const showToast = (title: string, description: string) => {
    setToast({ title, description });
    window.setTimeout(() => setToast(null), 4000);
  };

  const query = search.trim().toLowerCase();
  const filteredUsers = users.filter((user) => {
    if (roleFilter !== "ALL" && user.role !== roleFilter) return false;
    if (statusFilter !== "ALL" && user.status !== statusFilter) return false;
    if (query && !`${user.name} ${user.email} ${user.docLabel}`.toLowerCase().includes(query))
      return false;
    return true;
  });

  // Alterna Activo/Suspendido sin borrar (baja lógica).
  const toggleUserStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, status: user.status === "Activo" ? "Suspendido" : "Activo" }
          : user,
      ),
    );

  // Inserta al inicio, vuelve a pág. 1 y confirma con toast.
  const createUser = (input: NewDirectoryUser) => {
    setUsers((prev) => [buildUser(`U-${String(prev.length + 1).padStart(2, "0")}`, input), ...prev]);
    setPage(1);
    setUserModalOpen(false);
    showToast("Invitación enviada", `Cuenta creada para ${input.name.trim()}.`);
  };

  const exportDirectory = () => {
    downloadCsv("usuarios-eventia.csv", exportUsersCsv(filteredUsers));
    showToast("Reporte generado", `Se descargaron ${filteredUsers.length} usuarios en CSV.`);
  };

  return (
    <div className="min-h-screen bg-surface overflow-x-hidden">
      <AdminSidebar />
      <div className="pl-0 lg:pl-64 min-w-0">
        <AdminHeader onNewUser={() => setUserModalOpen(true)} />
        <main className="w-full pt-16 px-4 sm:px-6 min-h-screen min-w-0">
          <div className="flex flex-col w-full pb-10 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-4 min-w-0">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    Módulo de administración
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-on-surface-variant whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Eventia S.A.C.
                  </span>
                </div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-balance">
                  Gestión de usuarios y roles
                </h1>
                <p className="text-[0.9375rem] text-on-surface-variant max-w-2xl break-words">
                  Control de credenciales, accesos de puerta y permisos por rol.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-on-primary hover:opacity-90 px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all active:scale-95 whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[20px]">person_add</span>
                  <span>Invitar usuario</span>
                </button>
                <Link
                  to="/admin/categories"
                  className="inline-flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-primary text-[20px]">bookmark_add</span>
                  <span>Nueva categoría</span>
                </Link>
              </div>
            </div>

            <AdminTabs />

            <UserDirectory
              users={filteredUsers}
              search={search}
              onSearchChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
              roleFilter={roleFilter}
              onRoleFilterChange={(value) => {
                setRoleFilter(value);
                setPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              page={page}
              onPageChange={setPage}
              onToggleStatus={toggleUserStatus}
              onToast={showToast}
              onExport={exportDirectory}
            />
          </div>
        </main>
      </div>

      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        onSubmit={createUser}
      />
      <Toast toast={toast} />
    </div>
  );
}

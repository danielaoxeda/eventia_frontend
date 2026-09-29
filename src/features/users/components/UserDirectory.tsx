import type { AccountStatus, DirectoryUser, Role } from "../types/user.types";
import { isPromoUser } from "../../events/services/events.service";

const ROLE_PILL: Record<Role, string> = {
  Administrador: "bg-primary-fixed text-primary",
  Organizador: "bg-tertiary-container/20 text-tertiary",
  Staff: "bg-surface-container-high text-on-surface",
  Cliente: "bg-surface-container text-on-surface-variant",
};

const ROLE_ICON: Record<Role, string> = {
  Administrador: "shield_person",
  Organizador: "campaign",
  Staff: "qr_code_scanner",
  Cliente: "shopping_bag",
};

/** Tamaño de página del directorio. */
export const USERS_PAGE_SIZE = 4;

interface UserDirectoryProps {
  users: DirectoryUser[];
  search: string;
  onSearchChange: (value: string) => void;
  roleFilter: Role | "ALL";
  onRoleFilterChange: (value: Role | "ALL") => void;
  statusFilter: AccountStatus | "ALL";
  onStatusFilterChange: (value: AccountStatus | "ALL") => void;
  page: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string) => void;
  onToast: (title: string, description: string) => void;
  onExport: () => void;
}

/** Tabla de usuarios: filtros, badge promo, acciones y paginación funcional. */
export default function UserDirectory(props: UserDirectoryProps) {
  const {
    users,
    search,
    onSearchChange,
    roleFilter,
    onRoleFilterChange,
    statusFilter,
    onStatusFilterChange,
    page,
    onPageChange,
    onToggleStatus,
    onToast,
    onExport,
  } = props;

  const totalPages = Math.max(1, Math.ceil(users.length / USERS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = users.length === 0 ? 0 : (safePage - 1) * USERS_PAGE_SIZE + 1;
  const end = Math.min(safePage * USERS_PAGE_SIZE, users.length);
  const visible = users.slice((safePage - 1) * USERS_PAGE_SIZE, safePage * USERS_PAGE_SIZE);

  return (
    <section className="flex flex-col gap-4 mt-4 min-w-0">
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 min-w-0">
        <div className="flex flex-1 items-center gap-3 bg-surface-container px-3.5 py-2 rounded-lg min-w-0">
          <span className="material-symbols-outlined text-outline text-[22px] shrink-0">search</span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-[0.9375rem] placeholder:text-outline focus:outline-none w-full min-w-0"
            placeholder="Buscar por nombre, DNI/RUC o correo..."
            type="text"
            aria-label="Buscar usuarios"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-lg text-xs">
            <span className="text-outline whitespace-nowrap">Rol:</span>
            <select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value as Role | "ALL")}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
              aria-label="Filtrar por rol"
            >
              <option value="ALL">Todos los roles</option>
              <option value="Cliente">Cliente (Comprador)</option>
              <option value="Organizador">Organizador / Productor</option>
              <option value="Staff">Personal de puerta / Staff</option>
              <option value="Administrador">Administrador del sistema</option>
            </select>
          </label>
          <label className="flex items-center gap-2 bg-surface-container px-3 py-2 rounded-lg text-xs">
            <span className="text-outline">Estado:</span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as AccountStatus | "ALL")}
              className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer"
              aria-label="Filtrar por estado"
            >
              <option value="ALL">Todos</option>
              <option value="Activo">Activos</option>
              <option value="Suspendido">Suspendidos</option>
            </select>
          </label>
          <button
            type="button"
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high text-xs font-semibold hover:bg-surface-variant transition-colors whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">file_download</span>
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="py-3.5 px-4 font-semibold">Identidad / Usuario</th>
                <th className="py-3.5 px-4 font-semibold">Rol Asignado</th>
                <th className="py-3.5 px-4 font-semibold">Validación RENIEC / SUNAT</th>
                <th className="py-3.5 px-4 font-semibold">Estado</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {visible.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed/60 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {user.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate flex items-center gap-1.5">
                          <span className="truncate">{user.name}</span>
                          {isPromoUser(user.name) && (
                            <span
                              title="Tiene 15% de descuento promo"
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold shrink-0"
                            >
                              <span className="material-symbols-outlined text-[12px]">percent</span>
                              Promo 15%
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-on-surface-variant truncate">{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${ROLE_PILL[user.role]}`}>
                      <span className="material-symbols-outlined text-[14px]">{ROLE_ICON[user.role]}</span>
                      {user.role === "Staff" ? "Personal de puerta" : user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-emerald-600 text-[16px] shrink-0">verified</span>
                        <span className="truncate">{user.docLabel}</span>
                      </span>
                      <span className="text-xs text-outline truncate">{user.docDetail}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {user.status === "Activo" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 text-[11px] font-semibold whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Suspendido
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="Revisar permisos"
                        type="button"
                        onClick={() => onToast("Permisos revisados", `Privilegios de ${user.name} verificados.`)}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                      </button>
                      <button
                        title={user.status === "Activo" ? "Suspender cuenta" : "Reactivar cuenta"}
                        type="button"
                        onClick={() => {
                          onToggleStatus(user.id);
                          onToast(
                            user.status === "Activo" ? "Cuenta suspendida" : "Cuenta reactivada",
                            `${user.name}: ${user.status === "Activo" ? "acceso pausado temporalmente." : "acceso restablecido."}`,
                          );
                        }}
                        className="p-1.5 rounded-lg text-on-surface-variant hover:bg-red-100 hover:text-red-700 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {user.status === "Activo" ? "block" : "check_circle"}
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 px-4 text-center text-sm text-outline">
                    Sin resultados para los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-surface-container/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-on-surface-variant">
          <span>
            Mostrando {start} - {end} de {users.length} {users.length === 1 ? "usuario" : "usuarios"}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => onPageChange(safePage - 1)}
              className="px-3 py-1.5 rounded-lg bg-surface-container font-semibold disabled:opacity-40"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-bold">
              {safePage} de {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => onPageChange(safePage + 1)}
              className="px-3 py-1.5 rounded-lg bg-surface-container font-semibold disabled:opacity-40"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

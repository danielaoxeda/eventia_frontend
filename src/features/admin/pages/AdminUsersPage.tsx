import { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import UsersFilters, { type StatusFilter } from "../components/UsersFilters";
import UsersHeader from "../components/UsersHeader";
import UsersTable from "../components/UsersTable";
import { adminUsersService } from "../services/adminUsersService";
import type {
  AdminUser,
  CreateUserFormData,
  PageResponse,
  UserFormData,
} from "../types/admin.types";
import { getErrorMessage } from "../utils/apiAdapter";

const PAGE_SIZE = 7;

const EMPTY_PAGE: PageResponse<AdminUser> = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  size: PAGE_SIZE,
  number: 0,
  first: true,
  last: true,
};

/**
 * Página principal de Gestión de Organizadores.
 * Lista (paginado, base 0), filtra, da de alta y edita organizadores a través del service.
 */
export default function AdminUsersPage() {
  const [pageData, setPageData] = useState<PageResponse<AdminUser>>(EMPTY_PAGE);
  const [pageIndex, setPageIndex] = useState(0);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [search, setSearch] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

  // Carga del listado cada vez que cambian página, filtros o se fuerza una recarga
  useEffect(() => {
    let cancelled = false;
    adminUsersService
      .getUsers({
        page: pageIndex,
        size: PAGE_SIZE,
        search,
        active: statusFilter === "Todos" ? undefined : statusFilter === "Activo",
      })
      .then((result) => {
        if (cancelled) return;
        setPageData(result);
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(getErrorMessage(e));
      });
    return () => {
      cancelled = true;
    };
  }, [pageIndex, search, statusFilter, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPageIndex(0);
  };

  const handleStatusFilter = (status: StatusFilter) => {
    setStatusFilter(status);
    setPageIndex(0);
  };

  // Alterna el estado activo/inactivo de una cuenta
  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await adminUsersService.toggleUserStatus(user.id, !user.active);
      reload();
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    }
  };

  // Abre el modal en modo edición
  const handleEdit = (user: AdminUser) => {
    setUserToEdit(user);
    setModalOpen(true);
  };

  // Abre el modal para registrar un nuevo Organizador
  const handleNuevoOrganizador = () => {
    setUserToEdit(null);
    setModalOpen(true);
  };

  // Guarda o actualiza según si se está editando o creando. Si falla, el error llega al modal.
  const handleSave = async (form: UserFormData | CreateUserFormData) => {
    if (userToEdit) {
      await adminUsersService.updateUser(userToEdit.id, form);
    } else if ("password" in form) {
      await adminUsersService.createUser(form);
      setPageIndex(0);
    }
    setModalOpen(false);
    reload();
  };

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Cabecera con botón de alta de organizador */}
      <UsersHeader onNuevoOrganizador={handleNuevoOrganizador} />

      {/* Barra de filtros por estado y búsqueda */}
      <UsersFilters
        statusFilter={statusFilter}
        search={search}
        onStatusFilter={handleStatusFilter}
        onSearch={handleSearch}
      />

      {error && (
        <div className="p-3 text-xs rounded-xl bg-error-container/30 border border-error-container text-error font-medium">
          {error}
        </div>
      )}

      {/* Tabla con datos paginados y botones de acción */}
      <UsersTable
        page={pageData}
        onPageChange={setPageIndex}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
      />

      {/* Modal interactivo de alta / edición */}
      <UserModal
        key={`${userToEdit?.id ?? "new"}-${modalOpen}`}
        open={modalOpen}
        userToEdit={userToEdit}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import UserModal from "../components/UserModal";
import UsersFilters from "../components/UsersFilters";
import UsersHeader from "../components/UsersHeader";
import UsersTable from "../components/UsersTable";
import { adminUsersService } from "../services/adminUsersService";
import type { AdminUser, UserFormData, UserRole, UserStatus } from "../types/admin.types";

type RoleFilter = UserRole | "Todos";
type StatusFilter = UserStatus | "Todos";

/**
 * Página principal de Gestión de Usuarios y Accesos.
 * Conecta los filtros, el catálogo de usuarios y el modal de registro/edición
 * mediante peticiones a la API dummy (json-server db.json).
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("Todos");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

  // Carga inicial de usuarios al montar la vista
  useEffect(() => {
    adminUsersService.getUsers().then(setUsers);
  }, []);

  // Filtrado directo en memoria por rol, estado y término de búsqueda
  const q = search.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "Todos" && u.rol !== roleFilter) return false;
    if (statusFilter !== "Todos" && u.estado !== statusFilter) return false;
    if (q && !`${u.nombre} ${u.email} ${u.dni}`.toLowerCase().includes(q)) return false;
    return true;
  });

  // Alterna el estado activo/inactivo de una cuenta
  const handleToggleStatus = async (user: AdminUser) => {
    const nuevoEstado = user.estado === "Activo" ? "Inactivo" : "Activo";
    const actualizado = await adminUsersService.toggleUserStatus(user.id, nuevoEstado);
    setUsers((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
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

  // Guarda o actualiza según si se está editando o creando un nuevo organizador
  const handleSave = async (form: UserFormData) => {
    if (userToEdit) {
      const actualizado = await adminUsersService.updateUser(userToEdit.id, form);
      setUsers((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
    } else {
      const nuevo = await adminUsersService.createUser(form);
      setUsers((prev) => [nuevo, ...prev]);
    }
    setModalOpen(false);
  };

  return (
    <div className="w-full pb-12 space-y-6">
      {/* Cabecera con botón de alta de organizador */}
      <UsersHeader onNuevoOrganizador={handleNuevoOrganizador} />

      {/* Barra de filtros por rol, estado y búsqueda */}
      <UsersFilters
        users={users}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        search={search}
        onRoleFilter={setRoleFilter}
        onStatusFilter={setStatusFilter}
        onSearch={setSearch}
      />

      {/* Tabla con datos filtrados y botones de acción */}
      <UsersTable
        users={filteredUsers}
        onToggleStatus={handleToggleStatus}
        onEdit={handleEdit}
      />

      {/* Modal interactivo de alta / edición */}
      <UserModal
        open={modalOpen}
        userToEdit={userToEdit}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

import { ChevronLeft, ChevronRight, PenLine, PowerOff, RotateCcw } from "lucide-react";
import { useState } from "react";
import type { AdminUser } from "../types/admin.types";
import StatusBadge from "./StatusBadge";

interface UsersTableProps {
  users: AdminUser[];
  onToggleStatus: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
}

const ITEMS_PER_PAGE = 7;

export default function UsersTable({ users, onToggleStatus, onEdit }: UsersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = users.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getRolBadge = (rol: AdminUser["rol"]) => {
    if (rol === "Organizador") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary-fixed/50 text-primary border border-primary-fixed/60">
          <span className="material-symbols-outlined text-[14px]">business</span>
          Organizador
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
        <span className="material-symbols-outlined text-[14px]">person</span>
        Cliente
      </span>
    );
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[860px]">
          <thead>
            <tr className="bg-surface-container-low/60 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/20">
              <th className="py-3.5 px-5 font-display">ID / USUARIO</th>
              <th className="py-3.5 px-5 font-display">DNI</th>
              <th className="py-3.5 px-5 font-display">TELÉFONO</th>
              <th className="py-3.5 px-5 font-display">ROL ASIGNADO</th>
              <th className="py-3.5 px-5 font-display">REGISTRO</th>
              <th className="py-3.5 px-5 font-display">ESTADO DE ACCESO</th>
              <th className="py-3.5 px-5 font-display text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20 text-sm">
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-sm text-on-surface-variant">
                  No se encontraron usuarios con esos criterios.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-surface-container-low/40 transition-colors duration-150"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary-fixed/60">
                        {user.iniciales}
                      </div>
                      <div>
                        <div className="font-bold text-on-surface text-sm leading-tight">
                          {user.nombre}
                        </div>
                        <div className="text-xs text-primary font-medium mt-0.5">
                          {user.email}
                        </div>
                        <div className="text-[11px] text-on-surface-variant font-mono">
                          {user.codigo}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-5 font-mono text-sm text-on-surface">
                    {user.dni}
                  </td>

                  <td className="py-4 px-5 text-sm text-on-surface-variant font-medium">
                    {user.telefono}
                  </td>

                  <td className="py-4 px-5">{getRolBadge(user.rol)}</td>

                  <td className="py-4 px-5 text-sm text-on-surface-variant font-medium">
                    {user.fechaRegistro}
                  </td>

                  <td className="py-4 px-5">
                    <StatusBadge status={user.estado} />
                  </td>

                  <td className="py-4 px-5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container hover:text-on-surface transition-colors"
                        title="Editar usuario"
                      >
                        <PenLine className="w-3.5 h-3.5" />
                        Editar
                      </button>

                      {user.estado === "Activo" ? (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-error border border-error-container hover:bg-error-container/20 transition-colors"
                          title="Desactivar cuenta"
                        >
                          <PowerOff className="w-3.5 h-3.5" />
                          Desactivar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(user)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                          title="Activar cuenta"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Activar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-outline-variant/20 text-xs text-on-surface-variant">
        <span>
          Mostrando{" "}
          <span className="font-bold text-primary">
            {Math.min(startIndex + 1, users.length)}–{Math.min(startIndex + ITEMS_PER_PAGE, users.length)}
          </span>{" "}
          de <span className="font-bold">{users.length}</span> usuarios
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Anterior
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors ${
                currentPage === page
                  ? "bg-primary text-on-primary"
                  : "border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
          >
            Siguiente
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

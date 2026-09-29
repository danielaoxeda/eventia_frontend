/** Roles del directorio (etiquetas en español para la UI). */
export type Role = "Administrador" | "Organizador" | "Staff" | "Cliente";
/** Estado de la cuenta: activa o suspendida (sin borrado). */
export type AccountStatus = "Activo" | "Suspendido";

/** Usuario del directorio con documento y estado. */
export interface DirectoryUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  docLabel: string;
  docDetail: string;
  createdAt: string;
  status: AccountStatus;
}

/** Datos que pide el modal para crear un usuario. */
export interface NewDirectoryUser {
  name: string;
  email: string;
  role: Role;
}

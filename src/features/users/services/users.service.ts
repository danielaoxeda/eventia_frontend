import type { DirectoryUser, NewDirectoryUser, Role } from "../types/user.types";

/** Usuarios dummy iniciales (incluye un Roberto para demo de la promo). */
export const INITIAL_USERS: DirectoryUser[] = [
  {
    id: "U-01",
    name: "Valeria Mendoza Ramos",
    email: "vmendoza@eventia.pe",
    initials: "VM",
    role: "Administrador",
    docLabel: "DNI: 45892110",
    docDetail: "RENIEC Biometría Ok",
    createdAt: "14 Ene 2024, 08:30",
    status: "Activo",
  },
  {
    id: "U-02",
    name: "Carlos Arana Romero",
    email: "contacto@veltrac.pe",
    initials: "CA",
    role: "Organizador",
    docLabel: "RUC: 20554981120",
    docDetail: "SUNAT: VELTRAC ENTERTAINMENT S.A.C.",
    createdAt: "02 Mar 2024, 15:45",
    status: "Activo",
  },
  {
    id: "U-03",
    name: "Miguel Ángel Quiroz",
    email: "mquiroz.staff@eventia.pe",
    initials: "MQ",
    role: "Staff",
    docLabel: "DNI: 70912443",
    docDetail: "Terminal Asignado: #GATE-A3",
    createdAt: "19 Feb 2024, 11:20",
    status: "Activo",
  },
  {
    id: "U-04",
    name: "Luciana Paredes Vega",
    email: "lparedes.dev@gmail.com",
    initials: "LP",
    role: "Cliente",
    docLabel: "DNI: 47990132",
    docDetail: "Cuenta nominada al 100%",
    createdAt: "12 May 2024, 21:05",
    status: "Activo",
  },
  {
    id: "U-05",
    name: "Rodrigo Salazar Benavides",
    email: "rsalazar@eventospop.com",
    initials: "RS",
    role: "Organizador",
    docLabel: "RUC: 20601994821",
    docDetail: "Bloqueo preventivo por revisión",
    createdAt: "10 Jun 2023, 19:12",
    status: "Suspendido",
  },
  {
    id: "U-06",
    name: "Roberto Quispe Huamán",
    email: "rquispe@gmail.com",
    initials: "RQ",
    role: "Cliente",
    docLabel: "DNI: 48120573",
    docDetail: "Cuenta nominada al 100%",
    createdAt: "03 Feb 2025, 10:15",
    status: "Activo",
  },
];

export const USER_ROLES: Role[] = ["Administrador", "Organizador", "Staff", "Cliente"];

/** Construye un usuario nuevo con iniciales y estado activo. */
export function buildUser(id: string, input: NewDirectoryUser): DirectoryUser {
  const parts = input.name.trim().split(/\s+/);
  const initials = parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return {
    id,
    name: input.name.trim(),
    email: input.email.trim(),
    initials: initials || "US",
    role: input.role,
    docLabel: "DNI: pendiente de validación",
    docDetail: "Invitación enviada",
    createdAt: "Ahora mismo",
    status: "Activo",
  };
}

/** Genera el CSV del directorio con comillas escapadas. */
export function exportUsersCsv(users: DirectoryUser[]): string {
  const header = "id,nombre,email,rol,documento,estado";
  const rows = users.map((user) =>
    [user.id, user.name, user.email, user.role, user.docLabel, user.status]
      .map((field) => `"${field.replaceAll('"', '""')}"`)
      .join(","),
  );
  return [header, ...rows].join("\n");
}

/** Descarga un CSV en el navegador vía Blob (sin backend). */
export function downloadCsv(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

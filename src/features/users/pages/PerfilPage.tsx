import { useAuth } from "@/context/AuthContext";
import { getStoredUsers, updateStoredUser } from "@/shared/services/mockUserStorage";
import ProfileHeader from "../components/profile/ProfileHeader";
import ReadOnlyUserInfo from "../components/profile/ReadOnlyUserInfo";
import UpdateAccountForm from "../components/profile/UpdateAccountForm";
import { User, LogIn } from "lucide-react";
import { Link } from "react-router-dom";

export default function PerfilPage() {
  const { user, updateUser } = useAuth();

  // Si por alguna razón la sesión en contexto no tiene un usuario, tomamos el usuario almacenado por defecto
  const currentUser = user || (getStoredUsers().length > 0 ? getStoredUsers()[0] : null);

  const handleUpdate = async (updates: { email?: string; password?: string }) => {
    if (!currentUser) return;

    // Actualizar en localStorage
    const updatedUser = updateStoredUser(currentUser.id, updates);

    // Actualizar contexto global de react
    if (updateUser) {
      updateUser(updatedUser);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Breadcrumb / Titulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-100">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Mi Perfil
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Consulta tus datos personales y gestiona tus credenciales de acceso
              </p>
            </div>
          </div>

          <Link
            to="/mis-tickets"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 transition"
          >
            Ver mis entradas
          </Link>
        </div>

        {currentUser ? (
          <>
            {/* Header del Perfil */}
            <ProfileHeader user={currentUser} />

            <div className="grid grid-cols-1 gap-8">
              {/* Formulario de actualización de correo y contraseña (Editable) */}
              <UpdateAccountForm user={currentUser} onUpdate={handleUpdate} />

              {/* Consulta de datos personales (Solo lectura) */}
              <ReadOnlyUserInfo user={currentUser} />
            </div>
          </>
        ) : (
          /* Estado sin sesión */
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm max-w-lg mx-auto space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
              <LogIn className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Inicia sesión para ver tu perfil
            </h2>
            <p className="text-sm text-slate-500">
              Debes autenticarte para poder consultar y actualizar tus datos personales.
            </p>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-extrabold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Ir a Iniciar Sesión
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

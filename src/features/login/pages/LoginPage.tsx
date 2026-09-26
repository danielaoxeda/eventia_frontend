import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-slate-50 px-6 py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-12">

        {/* Información */}
        <div className="hidden lg:col-span-5 lg:block">
          <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold tracking-wide text-indigo-600">
            ECOSISTEMA EVENTIA
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
            Tus entradas, seguras y en un solo lugar.
          </h1>

          <p className="mt-5 leading-relaxed text-slate-600">
            Accede a tu cuenta para consultar tus entradas y
            gestionar tus eventos desde Eventia.
          </p>
        </div>

        {/* Formulario */}
        <div className="lg:col-span-7">
          <div className="mx-auto max-w-lg rounded-xl bg-white p-8 shadow-xl md:p-10">

            <div className="mb-8 text-center">
              <div className="mb-4 text-2xl font-extrabold text-indigo-600">
                Eventia
              </div>

              <h2 className="text-2xl font-extrabold text-slate-900">
                Bienvenido de nuevo
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Ingresa a tu cuenta para acceder a tus entradas
                y gestionar tus eventos.
              </p>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                className="flex-1 rounded-md bg-white py-2 text-sm font-bold text-indigo-600 shadow-sm"
              >
                Iniciar Sesión
              </button>

              <button
                type="button"
                className="flex-1 rounded-md py-2 text-sm font-semibold text-slate-500"
              >
                Crear Cuenta
              </button>
            </div>

            <LoginForm />

            {/* Registro */}
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Eres nuevo en Eventia?{" "}
              <button
                type="button"
                className="font-bold text-indigo-600 hover:underline"
              >
                Regístrate gratis
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
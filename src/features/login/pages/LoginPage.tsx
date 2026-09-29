import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-slate-50 px-6 py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 lg:grid-cols-2">

        {/* Información */}
        <div className="hidden lg:block">
          <div className="mb-5 inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold tracking-wide text-indigo-600">
            ECOSISTEMA EVENTIA
          </div>

          <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
            Todos tus eventos favoritos en un solo lugar.
          </h1>

          <p className="mt-5 max-w-md leading-relaxed text-slate-600">
            Accede a tu cuenta para consultar tus entradas
            y gestionar tus eventos desde Eventia.
          </p>
        </div>

        {/* Formulario */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-xl">

            {/* Encabezado */}
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

            {/* Formulario */}
            <LoginForm />

            {/* Registro */}
            <p className="mt-6 text-center text-sm text-slate-500">
              ¿Aún no tienes una cuenta?{" "}
              <a
                href="/register"
                className="font-bold text-indigo-600 hover:underline"
              >
                Regístrate
              </a>
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
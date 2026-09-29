import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-xl border border-slate-100">
          <RegisterForm />
        </div>
      </div>
    </section>
  );
}

import { Outlet } from "react-router-dom";
import Header from "../../shared/components/Header";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
}
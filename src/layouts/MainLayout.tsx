import { Outlet } from "react-router-dom";
import PublicHeader from "@/shared/components/PublicHeader";
import UserHeader from "@/shared/components/UserHeader";
import { useAuth } from "@/context/AuthContext";

export default function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      {isAuthenticated ? <UserHeader /> : <PublicHeader />}

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}
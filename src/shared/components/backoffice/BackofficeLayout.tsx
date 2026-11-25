import { useState } from "react";
import { Outlet } from "react-router-dom";
import type { AuthUser } from "@/shared/types/auth.types";
import BackofficeSidebar, { type BackofficeNavItem } from "./BackofficeSidebar";
import BackofficeTopbar from "./BackofficeTopbar";

interface BackofficeLayoutProps {
  roleLabel: string;
  navSection: string;
  navItems: BackofficeNavItem[];
  user: AuthUser | null;
  onLogout: () => void;
}

export default function BackofficeLayout({
  roleLabel,
  navSection,
  navItems,
  user,
  onLogout,
}: BackofficeLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <BackofficeSidebar
        navSection={navSection}
        navItems={navItems}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
      />

      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        <BackofficeTopbar
          roleLabel={roleLabel}
          user={user}
          onLogout={onLogout}
          onToggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 px-4 sm:px-8 py-6 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

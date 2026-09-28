import { Outlet } from "react-router-dom";
import OrganizerSidebar from "./OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

export default function OrganizerLayout() {
  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased flex">
      <OrganizerSidebar />

      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <OrganizerTopbar />

        <main className="flex-1 pt-16 px-6 lg:px-8 pb-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

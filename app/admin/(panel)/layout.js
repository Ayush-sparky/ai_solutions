import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "./AdminSidebar";

// Authenticated admin chrome (sidebar). Wraps every admin page except /login.
export default async function PanelLayout({ children }) {
  // Defense in depth: middleware already guards /admin, but enforce here too
  // (and we need the session for the sidebar).
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <AdminSidebar email={session.email} />
      <div className="lg:pl-64">
        <div className="pt-16 lg:pt-0">{children}</div>
      </div>
    </div>
  );
}

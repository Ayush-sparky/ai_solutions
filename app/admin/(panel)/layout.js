import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getNotificationSnapshot } from "@/lib/notifications";
import AdminShell from "./AdminShell";

// Authenticated admin chrome. Wraps every admin page except /login.
export default async function PanelLayout({ children }) {
  // Defense in depth: middleware already guards /admin, but enforce here too
  // (and we need the session for the chrome).
  const session = await getSession();
  if (!session) redirect("/admin/login");

  // Server-render the current notification state so the bell/badges are correct
  // on first paint; the client then keeps it live over SSE.
  const initialNotifications = await getNotificationSnapshot();

  return (
    <AdminShell email={session.email} initial={initialNotifications}>
      {children}
    </AdminShell>
  );
}

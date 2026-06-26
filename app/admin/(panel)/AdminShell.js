"use client";

// Authenticated admin chrome. Owns the mobile-nav open state and composes the
// sidebar, the top bar (with the live notification bell), the page content, and
// the toast stack — all wrapped in the NotificationProvider so every piece shares
// one live notification state.

import { useState } from "react";
import NotificationProvider from "./NotificationProvider";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import ToastStack from "./ToastStack";

export default function AdminShell({ email, initial, children }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <NotificationProvider initial={initial}>
      <AdminSidebar email={email} open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="lg:pl-64">
        <AdminTopbar onMenu={() => setNavOpen(true)} />
        <main>{children}</main>
      </div>
      <ToastStack />
    </NotificationProvider>
  );
}

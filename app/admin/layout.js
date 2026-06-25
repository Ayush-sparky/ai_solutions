// Admin section layout — intentionally bare (no public header/footer/chat).
export const metadata = {
  title: {
    default: "Admin",
    template: "%s · AI-Solutions Admin",
  },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}

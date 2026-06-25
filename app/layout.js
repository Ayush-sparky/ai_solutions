import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "AI-Solutions — AI Consulting & Automation for Business",
    template: "%s | AI-Solutions",
  },
  description:
    "AI-Solutions helps businesses adopt AI with consulting, process automation, and custom solutions. Explore our services, articles, events, and client reviews.",
};

// Root layout: only the <html>/<body> shell + fonts. Chrome lives in the
// per-section layouts ((site) for public pages, admin for the dashboard).
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">{children}</body>
    </html>
  );
}

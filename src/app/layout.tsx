import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Manrope } from "next/font/google";
import "./globals.css";
import { ChatWidget } from "@/components/chat-widget";
import { DemoBanner } from "@/components/demo-banner";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://medicare-hospital-demo.vercel.app",
  ),
  title: {
    default: "MediCare Hospital | Compassionate Care, Modern Medicine",
    template: "%s | MediCare Hospital",
  },
  description:
    "MediCare Hospital demonstration website. Explore fictional departments, doctors, appointment requests, and patient services.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <div className="flex min-h-screen flex-col bg-white">
          <SiteHeader />
          <DemoBanner />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <ChatWidget />
      </body>
    </html>
  );
}

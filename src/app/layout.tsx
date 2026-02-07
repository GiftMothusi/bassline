import type { Metadata } from "next";
import { Outfit, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Toasts from "@/components/ui/Toasts";
import AuthModal from "@/components/ui/AuthModal";
import Footer from "@/components/layout/Footer";

const body = Outfit({ subsets: ["latin"], variable: "--font-body" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "Bassline — South African Music & Culture",
  description: "Discover, Vote, Celebrate South African Music. The voice of the people.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="min-h-screen font-body antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
        <Toasts />
        <AuthModal />
      </body>
    </html>
  );
}

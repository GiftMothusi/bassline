"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { Menu, X, User, LogOut } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/artists", label: "Artists" },
  { href: "/rankings", label: "Rankings" },
  { href: "/events", label: "Events" },
  { href: "/news", label: "News" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, setAuthModal } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo.png" alt="Bassline" width={180} height={64} priority />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "text-bass-accent bg-bass-accent/10"
                  : "text-gray-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">
                <User size={14} className="inline mr-1" />
                {user.name}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
              >
                <LogOut size={14} /> Sign out
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setAuthModal("login")}
                className="text-sm text-gray-300 hover:text-white px-3 py-1.5"
              >
                Sign in
              </button>
              <button
                onClick={() => setAuthModal("register")}
                className="text-sm bg-bass-accent text-bass-bg font-semibold px-4 py-1.5 rounded-lg hover:bg-bass-accent2 transition-colors"
              >
                Join
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-300 hover:text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/5 animate-in slide-in-from-top">
          <div className="px-4 py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                  pathname === l.href
                    ? "text-bass-accent bg-bass-accent/10"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10">
              {user ? (
                <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-gray-400">
                  Sign out ({user.name})
                </button>
              ) : (
                <div className="flex gap-2 px-4">
                  <button onClick={() => setAuthModal("login")} className="flex-1 py-2 text-sm text-gray-300 border border-white/10 rounded-lg">
                    Sign in
                  </button>
                  <button onClick={() => setAuthModal("register")} className="flex-1 py-2 text-sm bg-bass-accent text-bass-bg font-semibold rounded-lg">
                    Join
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

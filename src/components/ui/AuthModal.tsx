"use client";
import { useState } from "react";
import { useStore } from "@/store";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal() {
  const { authModal, setAuthModal, login, toast } = useStore();
  const [tab, setTab] = useState<"login" | "register">(authModal || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!authModal) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (tab === "register" && !name.trim()) e.name = "Name required";
    if (!email.includes("@")) e.email = "Valid email required";
    if (pass.length < 6) e.pass = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    login({ id: crypto.randomUUID(), name: name || email.split("@")[0], email });
    toast(`Welcome${name ? ", " + name : ""}!`, "success");
    setName(""); setEmail(""); setPass(""); setErrors({});
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={() => setAuthModal(null)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-bass-surface border border-white/10 rounded-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-bold">
              {tab === "login" ? "Welcome back" : "Join Bassline"}
            </h2>
            <button onClick={() => setAuthModal(null)} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex mb-6 bg-bass-bg rounded-lg p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setErrors({}); }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  tab === t ? "bg-bass-surface2 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === "register" && (
              <div>
                <input
                  placeholder="Your name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-bass-accent focus:outline-none transition-colors"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>
            )}
            <div>
              <input
                type="email" placeholder="Email address"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-bass-accent focus:outline-none transition-colors"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                type="password" placeholder="Password"
                value={pass} onChange={(e) => setPass(e.target.value)}
                className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-bass-accent focus:outline-none transition-colors"
              />
              {errors.pass && <p className="text-red-400 text-xs mt-1">{errors.pass}</p>}
            </div>
            <button
              onClick={submit} disabled={loading}
              className="w-full bg-bass-accent text-bass-bg font-semibold py-3 rounded-lg hover:bg-bass-accent2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

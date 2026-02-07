"use client";
import { create } from "zustand";

interface User { id: string; name: string; email: string }
interface Toast { id: string; msg: string; type: "success" | "error" | "info" }

interface Store {
  // Auth
  user: User | null;
  authModal: "login" | "register" | null;
  login: (u: User) => void;
  logout: () => void;
  setAuthModal: (m: "login" | "register" | null) => void;
  // Voting
  monthlyVote: string | null;
  ratings: Record<string, number>;
  hotNot: Record<string, "hot" | "not">;
  songVote: string | null;
  favorites: string[];
  voteMonthly: (id: string) => void;
  rate: (id: string, stars: number) => void;
  voteHotNot: (id: string, v: "hot" | "not") => void;
  voteSong: (id: string) => void;
  toggleFav: (id: string) => void;
  // Toasts
  toasts: Toast[];
  toast: (msg: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;
}

export const useStore = create<Store>((set, get) => ({
  user: null,
  authModal: null,
  login: (u) => set({ user: u, authModal: null }),
  logout: () => set({ user: null, monthlyVote: null, ratings: {}, hotNot: {}, songVote: null, favorites: [] }),
  setAuthModal: (m) => set({ authModal: m }),

  monthlyVote: null,
  ratings: {},
  hotNot: {},
  songVote: null,
  favorites: [],

  voteMonthly: (id) => {
    if (!get().user) return set({ authModal: "login" });
    set({ monthlyVote: id });
    get().toast("Vote recorded!", "success");
  },
  rate: (id, stars) => {
    if (!get().user) return set({ authModal: "login" });
    set((s) => ({ ratings: { ...s.ratings, [id]: stars } }));
    get().toast(`Rated ${stars} stars`, "success");
  },
  voteHotNot: (id, v) => {
    if (!get().user) return set({ authModal: "login" });
    set((s) => ({ hotNot: { ...s.hotNot, [id]: v } }));
    get().toast(v === "hot" ? "🔥 Hot!" : "🧊 Not!", "success");
  },
  voteSong: (id) => {
    if (!get().user) return set({ authModal: "login" });
    set({ songVote: id });
    get().toast("Song vote recorded!", "success");
  },
  toggleFav: (id) => {
    if (!get().user) return set({ authModal: "login" });
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    }));
  },

  toasts: [],
  toast: (msg, type = "success") => {
    const id = Math.random().toString(36).slice(2);
    set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

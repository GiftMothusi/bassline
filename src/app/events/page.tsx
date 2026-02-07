"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Plus, X, Loader2, Music, Clock } from "lucide-react";
import { useStore } from "@/store";
import { PROVINCES, GENRES } from "@/lib/constants";

interface EventItem {
  id: string; name: string; date: string; venue: string; city: string;
  province: string; genre: string; description: string; status: "pending" | "published";
}

export default function EventsPage() {
  const { user, setAuthModal, toast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState({ name: "", date: "", venue: "", city: "", province: "Gauteng", genre: "Amapiano", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.date) e.date = "Required";
    if (!form.venue.trim()) e.venue = "Required";
    if (!form.city.trim()) e.city = "Required";
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setEvents((prev) => [...prev, { ...form, id: crypto.randomUUID(), status: "pending" }]);
    toast("Event submitted for approval!", "success");
    setForm({ name: "", date: "", venue: "", city: "", province: "Gauteng", genre: "Amapiano", description: "" });
    setShowForm(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Community</span>
          <h1 className="text-4xl font-display font-black mt-1">Events</h1>
          <p className="text-gray-400 mt-2">SA music events — submit yours for the community.</p>
        </div>
        <button
          onClick={() => user ? setShowForm(true) : setAuthModal("login")}
          className="flex items-center gap-2 bg-bass-accent text-bass-bg font-semibold px-5 py-3 rounded-xl hover:bg-bass-accent2 transition-colors text-sm"
        >
          <Plus size={16} /> Submit Event
        </button>
      </div>

      {/* Submission form modal */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowForm(false)}
        >
          <motion.div
            initial={{ scale: 0.95 }} animate={{ scale: 1 }}
            className="w-full max-w-lg bg-bass-surface border border-white/10 rounded-2xl p-6 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Submit Event</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {([
                { key: "name", label: "Event Name", type: "text" },
                { key: "date", label: "Date", type: "date" },
                { key: "venue", label: "Venue", type: "text" },
                { key: "city", label: "City", type: "text" },
              ] as const).map((f) => (
                <div key={f.key}>
                  <label className="text-xs text-gray-400 mb-1 block">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-bass-accent/50 focus:outline-none"
                  />
                  {errors[f.key] && <p className="text-red-400 text-xs mt-1">{errors[f.key]}</p>}
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Province</label>
                <select value={form.province} onChange={(e) => setForm((p) => ({ ...p, province: e.target.value }))}
                  className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none appearance-none">
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Genre</label>
                <select value={form.genre} onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
                  className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none appearance-none">
                  {GENRES.filter((g) => g !== "All").map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  className="w-full bg-bass-bg border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-bass-accent/50 focus:outline-none resize-none"
                />
              </div>
              <button
                onClick={submit} disabled={loading}
                className="w-full bg-bass-accent text-bass-bg font-semibold py-3 rounded-lg hover:bg-bass-accent2 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Submit for Approval
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Events list */}
      {events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-bass-surface border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-wider text-bass-accent bg-bass-accent/10 px-2 py-0.5 rounded-full">{ev.genre}</span>
                <span className="text-[10px] uppercase tracking-wider text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">{ev.status}</span>
              </div>
              <h3 className="text-lg font-display font-bold mb-2">{ev.name}</h3>
              <div className="space-y-1 text-sm text-gray-400">
                <p className="flex items-center gap-2"><Calendar size={14} /> {ev.date}</p>
                <p className="flex items-center gap-2"><MapPin size={14} /> {ev.venue}, {ev.city}</p>
              </div>
              {ev.description && <p className="text-sm text-gray-500 mt-3">{ev.description}</p>}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24">
          <Calendar size={48} className="mx-auto text-gray-700 mb-4" />
          <h3 className="text-lg font-display font-bold text-gray-400 mb-2">No events yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Be the first to submit a South African music event. Approved events will appear here for the whole community.
          </p>
        </div>
      )}
    </div>
  );
}

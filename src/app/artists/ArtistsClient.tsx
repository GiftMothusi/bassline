"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, Users } from "lucide-react";
import ArtistCard from "@/components/ui/ArtistCard";
import Link from "next/link";
import Image from "next/image";
import { GENRES } from "@/lib/constants";
import type { DzArtist } from "@/lib/deezer";

type A = DzArtist & { genre: string };

function fmt(n: number) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

export default function ArtistsClient({ artists }: { artists: A[] }) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const [sort, setSort] = useState<"fans" | "name" | "albums">("fans");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = useMemo(() => {
    let list = [...artists];
    if (q) list = list.filter((a) => a.name.toLowerCase().includes(q.toLowerCase()));
    if (genre !== "All") list = list.filter((a) => a.genre === genre);
    if (sort === "fans") list.sort((a, b) => b.nb_fan - a.nb_fan);
    else if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "albums") list.sort((a, b) => b.nb_album - a.nb_album);
    return list;
  }, [artists, q, genre, sort]);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Directory</span>
        <h1 className="text-4xl font-display font-black mt-1">Artists</h1>
        <p className="text-gray-400 mt-2">Explore South Africa&apos;s finest — all data live from Deezer.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search artists..."
            className="w-full bg-bass-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-bass-accent/50 focus:outline-none"
          />
        </div>

        {/* Genre filter */}
        <select
          value={genre} onChange={(e) => setGenre(e.target.value)}
          className="bg-bass-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-bass-accent/50 focus:outline-none appearance-none cursor-pointer"
        >
          {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}
          className="bg-bass-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-bass-accent/50 focus:outline-none appearance-none cursor-pointer"
        >
          <option value="fans">Most Fans</option>
          <option value="name">A — Z</option>
          <option value="albums">Most Albums</option>
        </select>

        {/* View toggle */}
        <div className="flex bg-bass-surface border border-white/10 rounded-xl overflow-hidden">
          <button onClick={() => setView("grid")} className={`px-3 py-3 ${view === "grid" ? "bg-bass-accent/10 text-bass-accent" : "text-gray-400"}`}>
            <Grid3X3 size={18} />
          </button>
          <button onClick={() => setView("list")} className={`px-3 py-3 ${view === "list" ? "bg-bass-accent/10 text-bass-accent" : "text-gray-400"}`}>
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">{filtered.length} artist{filtered.length !== 1 && "s"} found</p>

      {/* Grid view */}
      {view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ArtistCard id={a.id} name={a.name} picture_big={a.picture_big} nb_fan={a.nb_fan} genre={a.genre} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
              <Link href={`/artists/${a.id}`} className="flex items-center gap-4 p-4 rounded-xl bg-bass-surface border border-white/5 hover:border-bass-accent/20 transition-all group">
                <span className="text-sm text-gray-500 w-6 text-right font-mono">{i + 1}</span>
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image src={a.picture_medium} alt={a.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-bass-accent transition-colors">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.genre}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm text-white">{fmt(a.nb_fan)}</p>
                  <p className="text-xs text-gray-500">fans</p>
                </div>
                <div className="text-right hidden md:block">
                  <p className="text-sm text-white">{a.nb_album}</p>
                  <p className="text-xs text-gray-500">albums</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No artists found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

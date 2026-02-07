"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ExternalLink, Disc3, Calendar, Music } from "lucide-react";
import { GENRES } from "@/lib/constants";

interface Release {
  id: number; title: string; artistName: string; artistId: number;
  cover: string; coverBig: string; date: string; type: string; tracks: number; link: string; genre: string;
}

export default function NewsClient({ releases }: { releases: Release[] }) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");
  const [type, setType] = useState("all");

  const filtered = useMemo(() => {
    let list = [...releases];
    if (q) list = list.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()) || r.artistName.toLowerCase().includes(q.toLowerCase()));
    if (genre !== "All") list = list.filter((r) => r.genre === genre);
    if (type !== "all") list = list.filter((r) => r.type === type);
    return list;
  }, [releases, q, genre, type]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-8">
        <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Latest</span>
        <h1 className="text-4xl font-display font-black mt-1">New Releases</h1>
        <p className="text-gray-400 mt-2">Fresh albums, EPs, and singles from SA artists — live from Deezer.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search releases..."
            className="w-full bg-bass-surface border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:border-bass-accent/50 focus:outline-none"
          />
        </div>
        <select value={genre} onChange={(e) => setGenre(e.target.value)}
          className="bg-bass-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          {GENRES.map((g) => <option key={g}>{g}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-bass-surface border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none appearance-none cursor-pointer">
          <option value="all">All Types</option>
          <option value="album">Albums</option>
          <option value="ep">EPs</option>
          <option value="single">Singles</option>
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-6">{filtered.length} releases found</p>

      {/* Featured release */}
      {featured && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="grid md:grid-cols-2 gap-6 bg-bass-surface border border-white/5 rounded-2xl overflow-hidden">
            <a href={featured.link} target="_blank" rel="noopener noreferrer" className="relative aspect-square group">
              <Image src={featured.coverBig} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </a>
            <div className="p-6 flex flex-col justify-center">
              <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Latest Release</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold mt-2">{featured.title}</h2>
              <Link href={`/artists/${featured.artistId}`} className="text-gray-400 hover:text-bass-accent transition-colors mt-1">
                {featured.artistName}
              </Link>
              <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={14} /> {featured.date}</span>
                <span className="flex items-center gap-1"><Disc3 size={14} /> {featured.type}</span>
                <span className="flex items-center gap-1"><Music size={14} /> {featured.tracks} tracks</span>
              </div>
              <div className="flex gap-3 mt-6">
                <a href={featured.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-bass-accent text-bass-bg font-semibold px-6 py-3 rounded-xl hover:bg-bass-accent2 transition-colors text-sm">
                  Listen on Deezer <ExternalLink size={14} />
                </a>
                <Link href={`/artists/${featured.artistId}`}
                  className="inline-flex items-center gap-2 border border-white/10 text-gray-300 px-6 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm">
                  View Artist
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Release grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {rest.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="group block">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                <Image src={r.coverBig || r.cover} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ExternalLink size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <p className="text-sm font-semibold text-white truncate group-hover:text-bass-accent transition-colors">{r.title}</p>
              <p className="text-xs text-gray-500 truncate">{r.artistName}</p>
              <p className="text-xs text-gray-600 mt-0.5">{r.date} &middot; {r.type}</p>
            </a>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24">
          <Disc3 size={48} className="mx-auto text-gray-700 mb-4" />
          <p className="text-gray-400">No releases match your search.</p>
        </div>
      )}
    </div>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Play, Star, Flame, Snowflake, Heart, Users, Disc3, Trophy } from "lucide-react";
import { useStore } from "@/store";
import ArtistCard from "@/components/ui/ArtistCard";
import type { DzArtist, DzTrack, DzAlbum } from "@/lib/deezer";

type A = DzArtist & { genre: string };

interface Props {
  artist: A;
  topTracks: DzTrack[];
  albums: DzAlbum[];
  related: A[];
}

function fmt(n: number) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}
function dur(s: number) { return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`; }

export default function ArtistDetailClient({ artist, topTracks, albums, related }: Props) {
  const { user, ratings, hotNot, monthlyVote, favorites, rate, voteHotNot, voteMonthly, toggleFav } = useStore();
  const id = String(artist.id);
  const myRating = ratings[id] || 0;
  const myHotNot = hotNot[id];
  const isMonthlyVote = monthlyVote === id;
  const isFav = favorites.includes(id);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px]">
        <Image src={artist.picture_xl} alt={artist.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-bass-bg via-bass-bg/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-bass-bg/80 to-transparent" />

        <div className="absolute top-4 left-4 lg:left-8">
          <Link href="/artists" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white glass px-4 py-2 rounded-xl">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-6 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-block text-bass-accent text-xs uppercase tracking-widest font-medium bg-bass-accent/10 px-3 py-1 rounded-full mb-3">
              {artist.genre}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black">{artist.name}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-300">
              <span className="flex items-center gap-1"><Users size={14} /> {fmt(artist.nb_fan)} fans</span>
              <span className="flex items-center gap-1"><Disc3 size={14} /> {artist.nb_album} albums</span>
              <a href={artist.link} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-bass-accent hover:underline">
                Deezer <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Actions bar */}
      <section className="sticky top-16 z-30 glass border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center gap-4">
          {/* Star rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => rate(id, s)} className="p-0.5 transition-transform hover:scale-125">
                <Star size={20} className={s <= myRating ? "text-bass-accent fill-bass-accent" : "text-gray-600"} />
              </button>
            ))}
            {myRating > 0 && <span className="text-xs text-gray-400 ml-2">You: {myRating}/5</span>}
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Hot or Not */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => voteHotNot(id, "hot")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                myHotNot === "hot" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <Flame size={14} /> Hot
            </button>
            <button
              onClick={() => voteHotNot(id, "not")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                myHotNot === "not" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "text-gray-400 hover:bg-white/5"
              }`}
            >
              <Snowflake size={14} /> Not
            </button>
          </div>

          <div className="w-px h-6 bg-white/10" />

          {/* Monthly vote */}
          <button
            onClick={() => voteMonthly(id)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
              isMonthlyVote ? "bg-bass-accent/20 text-bass-accent border border-bass-accent/30" : "text-gray-400 hover:bg-white/5"
            }`}
          >
            <Trophy size={14} /> {isMonthlyVote ? "Your Monthly Pick" : "Vote Artist of the Month"}
          </button>

          {/* Favorite */}
          <button onClick={() => toggleFav(id)} className="ml-auto p-2 hover:bg-white/5 rounded-lg transition-colors">
            <Heart size={18} className={isFav ? "text-red-400 fill-red-400" : "text-gray-400"} />
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-12">
            {/* Top Tracks */}
            <div>
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Play size={18} className="text-bass-accent" /> Top Tracks
              </h2>
              <div className="space-y-1">
                {topTracks.map((t, i) => (
                  <motion.a
                    key={t.id}
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-sm text-gray-500 w-6 text-right font-mono">{i + 1}</span>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image src={t.album.cover_medium} alt={t.title} fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={12} className="text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate group-hover:text-bass-accent transition-colors">{t.title_short}</p>
                      <p className="text-xs text-gray-500 truncate">{t.album.title}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{dur(t.duration)}</span>
                    <ExternalLink size={12} className="text-gray-600 group-hover:text-gray-400" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Albums */}
            <div>
              <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <Disc3 size={18} className="text-bass-accent" /> Discography
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {albums.map((a) => (
                  <a key={a.id} href={a.link} target="_blank" rel="noopener noreferrer" className="group">
                    <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                      <Image src={a.cover_big || a.cover_medium} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <p className="text-sm text-white truncate group-hover:text-bass-accent transition-colors">{a.title}</p>
                    <p className="text-xs text-gray-500">{a.release_date?.slice(0, 4)} &middot; {a.record_type}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Stats card */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Stats</h3>
              {[
                { label: "Fans", value: fmt(artist.nb_fan) },
                { label: "Albums", value: String(artist.nb_album) },
                { label: "Top Tracks", value: String(topTracks.length) },
              ].map((s) => (
                <div key={s.label} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{s.label}</span>
                  <span className="text-sm font-semibold text-white">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Listen on Deezer */}
            <a
              href={artist.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass rounded-2xl p-6 hover:border-bass-accent/20 transition-colors text-center"
            >
              <p className="text-sm text-gray-400 mb-2">Listen on</p>
              <p className="text-lg font-display font-bold text-bass-accent">Deezer</p>
              <p className="text-xs text-gray-500 mt-1">Stream full tracks &rarr;</p>
            </a>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Related Artists</h3>
                <div className="space-y-3">
                  {related.slice(0, 5).map((r) => (
                    <Link key={r.id} href={`/artists/${r.id}`} className="flex items-center gap-3 group">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                        <Image src={r.picture_medium} alt={r.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate group-hover:text-bass-accent transition-colors">{r.name}</p>
                        <p className="text-xs text-gray-500">{fmt(r.nb_fan)} fans</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

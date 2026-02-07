"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Users, Music, Trophy, ChevronRight, Play } from "lucide-react";
import ArtistCard from "@/components/ui/ArtistCard";
import type { DzArtist, DzTrack } from "@/lib/deezer";

type ArtistWithGenre = DzArtist & { genre: string };

interface Props {
  artists: ArtistWithGenre[];
  featured: ArtistWithGenre;
  featuredTracks: DzTrack[];
}

function formatNum(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function HomeClient({ artists, featured, featuredTracks }: Props) {
  const topByFans = [...artists].sort((a, b) => b.nb_fan - a.nb_fan).slice(0, 8);
  const totalFans = artists.reduce((s, a) => s + a.nb_fan, 0);

  return (
    <div className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bass-bg via-bass-bg2 to-bass-surface" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239CFF00' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block text-bass-accent text-sm font-medium tracking-widest uppercase mb-4">
              The Voice of the People
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-[0.9] mb-6">
              South African<br />
              <span className="text-bass-accent">Music</span> &amp; Culture
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-xl mb-8">
              Discover, vote, and celebrate SA&apos;s finest artists. Community-powered rankings — no gatekeepers, no politics.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/artists"
                className="inline-flex items-center gap-2 bg-bass-accent text-bass-bg font-bold px-8 py-4 rounded-xl hover:bg-bass-accent2 transition-all hover:shadow-[0_0_30px_rgba(156,255,0,0.3)]"
              >
                Discover Artists <ArrowRight size={18} />
              </Link>
              <Link
                href="/rankings"
                className="inline-flex items-center gap-2 border border-bass-accent/30 text-bass-accent font-medium px-8 py-4 rounded-xl hover:bg-bass-accent/10 transition-all"
              >
                Vote Now <Trophy size={18} />
              </Link>
            </div>
          </motion.div>

          {/* Hero stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-8 mt-16"
          >
            {[
              { label: "Artists", value: artists.length, icon: Music },
              { label: "Total Fans", value: formatNum(totalFans), icon: Users },
              { label: "Genres", value: Object.keys(ARTIST_GENRES_SET(artists)).length, icon: Trophy },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-bass-accent/10 flex items-center justify-center">
                  <s.icon size={18} className="text-bass-accent" />
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-white">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Artist ─── */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Spotlight</span>
              <h2 className="text-3xl font-display font-bold mt-1">Featured Artist</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href={`/artists/${featured.id}`} className="group">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src={featured.picture_xl}
                  alt={featured.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bass-bg/90 via-bass-bg/20 to-transparent" />
                <div className="absolute bottom-0 p-6">
                  <span className="text-bass-accent text-xs uppercase tracking-wider">{featured.genre}</span>
                  <h3 className="text-3xl font-display font-bold mt-1">{featured.name}</h3>
                  <p className="text-gray-400 text-sm mt-2">{formatNum(featured.nb_fan)} fans &middot; {featured.nb_album} albums</p>
                </div>
              </div>
            </Link>
            <div className="flex flex-col justify-center">
              <h4 className="text-sm text-gray-400 uppercase tracking-wider mb-4">Top Tracks</h4>
              <div className="space-y-2">
                {featuredTracks.map((t, i) => (
                  <a
                    key={t.id}
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-sm text-gray-500 w-6 text-right font-mono">{i + 1}</span>
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <Image src={t.album.cover_medium} alt={t.title} fill className="object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={14} className="text-white" fill="white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{t.title_short}</p>
                      <p className="text-xs text-gray-500">{t.album.title}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">{formatDuration(t.duration)}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Top Artists ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Community</span>
            <h2 className="text-3xl font-display font-bold mt-1">Top Artists</h2>
          </div>
          <Link href="/artists" className="text-sm text-bass-accent hover:underline flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {topByFans.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ArtistCard id={a.id} name={a.name} picture_big={a.picture_big} nb_fan={a.nb_fan} genre={a.genre} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-bass-surface via-bass-bg2 to-bass-bg p-12 md:p-16 border border-bass-accent/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-bass-accent/5 rounded-full blur-[120px]" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4">
              Your Voice <span className="text-bass-accent">Matters</span>
            </h2>
            <p className="text-gray-400 max-w-lg mb-8">
              Join the Bassline community and vote for your favourite SA artists. No industry politics — just the people&apos;s choice.
            </p>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-2 bg-bass-accent text-bass-bg font-bold px-8 py-4 rounded-xl hover:bg-bass-accent2 transition-all"
            >
              Start Voting <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper to get unique genres from artists
function ARTIST_GENRES_SET(artists: { genre: string }[]) {
  const set: Record<string, boolean> = {};
  artists.forEach((a) => { set[a.genre] = true; });
  return set;
}

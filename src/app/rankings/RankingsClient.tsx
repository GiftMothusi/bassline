"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, Users } from "lucide-react";
import { useStore } from "@/store";
import { GENRES } from "@/lib/constants";
import type { DzArtist } from "@/lib/deezer";

type A = DzArtist & { genre: string };

function fmt(n: number) {
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(0) + "K";
  return String(n);
}

const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%231a1d35'/%3E%3Ctext x='50%25' y='50%25' font-size='60' text-anchor='middle' dy='.3em' fill='%239CFF00'%3E♪%3C/text%3E%3C/svg%3E";

function getSrc(url: string | undefined | null): string {
  return url && url.length > 0 ? url : PLACEHOLDER_IMG;
}

const rankColors = ["text-yellow-400", "text-gray-300", "text-amber-600"];
const rankIcons = [Crown, Trophy, Medal];

export default function RankingsClient({ artists }: { artists: A[] }) {
  const { user, monthlyVote, voteMonthly, setAuthModal } = useStore();
  const [genre, setGenre] = useState("All");

  const sorted = [...artists]
    .filter((a) => genre === "All" || a.genre === genre)
    .sort((a, b) => b.nb_fan - a.nb_fan);

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="mb-8">
        <span className="text-bass-accent text-xs uppercase tracking-widest font-medium">Community</span>
        <h1 className="text-4xl font-display font-black mt-1">Rankings</h1>
        <p className="text-gray-400 mt-2">
          Artist of the Month — ranked by Deezer fans.{" "}
          {user ? "Cast your vote below." : "Sign in to vote."}
        </p>
      </div>

      {/* Current vote indicator */}
      {monthlyVote && (
        <div className="glass rounded-xl p-4 mb-6 flex items-center gap-3 border-l-2 border-bass-accent/50">
          <Trophy size={16} className="text-bass-accent" />
          <span className="text-sm text-gray-300">
            Your vote: <strong className="text-white">{artists.find((a) => String(a.id) === monthlyVote)?.name || "Unknown"}</strong>
          </span>
        </div>
      )}

      {/* Genre filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              genre === g
                ? "bg-bass-accent text-bass-bg font-semibold"
                : "bg-bass-surface text-gray-400 hover:text-white hover:bg-bass-surface2"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Podium — top 3 */}
      {sorted.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[sorted[1], sorted[0], sorted[2]].map((a, idx) => {
            const rank = idx === 1 ? 0 : idx === 0 ? 1 : 2;
            const RankIcon = rankIcons[rank];
            return (
              <motion.div
                key={`podium-${a.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rank * 0.1 }}
                className={`relative flex flex-col items-center p-6 rounded-2xl border border-white/5 ${
                  rank === 0 ? "bg-gradient-to-b from-yellow-500/10 to-bass-surface -mt-4 pb-8" : "bg-bass-surface mt-4"
                }`}
              >
                <RankIcon size={rank === 0 ? 28 : 20} className={`${rankColors[rank]} mb-3`} />
                <Link href={`/artists/${a.id}`} className="group">
                  <div className={`relative ${rank === 0 ? "w-28 h-28" : "w-20 h-20"} rounded-full overflow-hidden mb-3 border-2 ${
                    rank === 0 ? "border-yellow-400/50" : "border-white/10"
                  }`}>
                    <Image
                      src={getSrc(a.picture_big)}
                      alt={`${a.name} profile picture`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                      unoptimized={!a.picture_big}
                    />
                  </div>
                  <p className="text-sm font-bold text-center group-hover:text-bass-accent transition-colors">{a.name}</p>
                </Link>
                <p className="text-xs text-gray-500 mt-1">{fmt(a.nb_fan)} fans</p>
                <span className="text-xs text-gray-600 mt-1">{a.genre}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full leaderboard */}
      <div className="space-y-2">
        {sorted.map((a, i) => {
          const id = String(a.id);
          const isVoted = monthlyVote === id;
          return (
            <motion.div
              key={`rank-${a.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                isVoted ? "bg-bass-accent/10 border border-bass-accent/20" : "bg-bass-surface border border-white/5 hover:border-white/10"
              }`}
            >
              <span className={`text-lg font-display font-bold w-8 text-right ${
                i < 3 ? rankColors[i] : "text-gray-500"
              }`}>
                {i + 1}
              </span>
              <Link href={`/artists/${a.id}`} className="flex items-center gap-3 flex-1 min-w-0 group">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                  <Image
                    src={getSrc(a.picture_medium)}
                    alt={`${a.name} profile picture`}
                    fill
                    className="object-cover"
                    unoptimized={!a.picture_medium}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate group-hover:text-bass-accent transition-colors">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.genre} &middot; {fmt(a.nb_fan)} fans</p>
                </div>
              </Link>
              <button
                onClick={() => user ? voteMonthly(id) : setAuthModal("login")}
                className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  isVoted
                    ? "bg-bass-accent text-bass-bg"
                    : "border border-white/10 text-gray-400 hover:border-bass-accent/30 hover:text-bass-accent"
                }`}
              >
                {isVoted ? "✓ Voted" : "Vote"}
              </button>
            </motion.div>
          );
        })}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-20">
          <Users size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-gray-400">No artists found in this genre.</p>
        </div>
      )}
    </div>
  );
}
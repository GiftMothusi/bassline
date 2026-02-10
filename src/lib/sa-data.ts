/**
 * SA Artist Data Access Layer
 *
 * Reads from src/data/sa-artists.json (populated by the discovery cron).
 * Provides typed helpers that replace the old hardcoded SA_ARTIST_IDS.
 *
 * If the JSON doesn't exist or is empty, falls back to seed data.
 */

import type { DiscoveredArtist, DiscoveryResult } from "./discovery";

// Import the JSON — Next.js handles this at build/request time
let data: DiscoveryResult;

try {
  data = require("@/data/sa-artists.json") as DiscoveryResult;
} catch {
  // Fallback if file doesn't exist yet
  data = { generated: "", totalScanned: 0, totalMatched: 0, artists: [] };
}

// ─── Exports ───

/** All verified SA artists sorted by fans (descending) */
export const SA_ARTISTS: DiscoveredArtist[] = data.artists;

/** Just the Deezer IDs — drop-in replacement for old SA_ARTIST_IDS */
export const SA_ARTIST_IDS: number[] = data.artists.map((a) => a.deezerId);

/** Genre lookup by Deezer ID — drop-in replacement for old ARTIST_GENRES */
export const ARTIST_GENRES: Record<number, string> = Object.fromEntries(
  data.artists.map((a) => [a.deezerId, a.genre])
);

/** Set of all Deezer IDs for O(1) lookup */
const SA_ID_SET = new Set(SA_ARTIST_IDS);

/** Check if a Deezer ID belongs to a verified SA artist */
export function isSAArtist(deezerId: number): boolean {
  return SA_ID_SET.has(deezerId);
}

/** Get top N artists by fan count */
export function getTopArtists(n = 15): DiscoveredArtist[] {
  return SA_ARTISTS.slice(0, n);
}

/** Get artists filtered by genre */
export function getArtistsByGenre(genre: string): DiscoveredArtist[] {
  if (genre === "All") return SA_ARTISTS;
  return SA_ARTISTS.filter((a) => a.genre === genre);
}

/** All unique genres in the dataset */
export function getAvailableGenres(): string[] {
  const set = new Set(SA_ARTISTS.map((a) => a.genre));
  return ["All", ...Array.from(set).sort()];
}

/** Dataset metadata */
export const SA_DATASET = {
  generated: data.generated,
  totalArtists: data.totalMatched,
  totalScanned: data.totalScanned,
};

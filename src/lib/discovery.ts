/**
 * SA Artist Discovery Engine
 *
 * Fetches ALL South African artists from MusicBrainz (source of truth for nationality),
 * then matches each to a Deezer profile for live data (images, fans, albums, tracks).
 *
 * MusicBrainz rate limit: 1 req/sec (we use 1.2s gap)
 * Deezer rate limit: 50 req/5sec (we use 200ms gap)
 */

// ─── Types ───
export interface DiscoveredArtist {
  deezerId: number;
  name: string;
  mbid: string;
  mbName: string;
  type: string; // "Person" | "Group" | "Other"
  genre: string;
  fans: number;
  albums: number;
  picture: string;
  matchScore: number;
}

export interface DiscoveryResult {
  generated: string;
  totalScanned: number;
  totalMatched: number;
  artists: DiscoveredArtist[];
}

// ─── Config ───
const MB_BASE = "https://musicbrainz.org/ws/2";
const MB_SA_AREA_ID = "50cc7852-862e-30ae-aa82-385fe7135b7f"; // South Africa MBID
const MB_USER_AGENT = "Bassline/2.0 (https://bassline.co.za)";
const MB_PAGE_SIZE = 100;
const MB_DELAY = 1200; // 1.2s between MusicBrainz requests
const DZ_BASE = "https://api.deezer.com";
const DZ_DELAY = 200; // 200ms between Deezer requests

// ─── Helpers ───
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON<T>(url: string, userAgent?: string): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (userAgent) headers["User-Agent"] = userAgent;

  const res = await fetch(url, { headers, cache: "no-store" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json() as Promise<T>;
}

// ─── Step 1: Browse ALL SA artists from MusicBrainz ───
interface MBArtistRaw {
  id: string;
  name: string;
  "sort-name": string;
  type?: string;
  disambiguation?: string;
  country?: string;
  "life-span"?: { begin?: string; end?: string; ended?: boolean };
}

interface MBBrowseResponse {
  "artist-count": number;
  "artist-offset": number;
  artists: MBArtistRaw[];
}

export interface MBArtist {
  mbid: string;
  name: string;
  type: string;
  disambiguation: string;
  beginYear: string | null;
}

export async function fetchAllSAArtistsFromMB(
  onProgress?: (fetched: number, total: number) => void
): Promise<MBArtist[]> {
  const artists: MBArtist[] = [];
  let offset = 0;
  let total: number | null = null;

  while (total === null || offset < total) {
    const url = `${MB_BASE}/artist?area=${MB_SA_AREA_ID}&limit=${MB_PAGE_SIZE}&offset=${offset}&fmt=json`;

    try {
      const data = await fetchJSON<MBBrowseResponse>(url, MB_USER_AGENT);
      total = data["artist-count"];
      const batch = data.artists || [];

      for (const a of batch) {
        artists.push({
          mbid: a.id,
          name: a.name,
          type: a.type || "Unknown",
          disambiguation: a.disambiguation || "",
          beginYear: a["life-span"]?.begin?.slice(0, 4) || null,
        });
      }

      onProgress?.(artists.length, total);
      offset += MB_PAGE_SIZE;

      if (offset < total) await sleep(MB_DELAY);
    } catch (err) {
      console.error(`[MB] Error at offset ${offset}:`, err);
      // Wait and retry once
      await sleep(5000);
      try {
        const data = await fetchJSON<MBBrowseResponse>(url, MB_USER_AGENT);
        total = data["artist-count"];
        for (const a of data.artists || []) {
          artists.push({
            mbid: a.id,
            name: a.name,
            type: a.type || "Unknown",
            disambiguation: a.disambiguation || "",
            beginYear: a["life-span"]?.begin?.slice(0, 4) || null,
          });
        }
        offset += MB_PAGE_SIZE;
      } catch {
        console.error(`[MB] Retry failed at offset ${offset}, moving on`);
        offset += MB_PAGE_SIZE; // skip this page
      }
    }
  }

  return artists;
}

// ─── Step 2: Match MusicBrainz artists to Deezer ───
interface DzSearchResult {
  data: Array<{
    id: number;
    name: string;
    nb_fan: number;
    nb_album: number;
    picture_big: string;
    picture_medium: string;
  }>;
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`ʼ]/g, "'")
    .replace(/[""]/g, '"')
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s'&-]/g, "")
    .trim();
}

function scoreMatch(
  mbName: string,
  dzName: string,
  dzFans: number,
  dzAlbums: number
): number {
  const a = normalize(mbName);
  const b = normalize(dzName);
  let score = 0;

  // Name similarity
  if (a === b) score += 50;
  else if (a.includes(b) || b.includes(a)) score += 30;
  else if (a.split(" ")[0] === b.split(" ")[0] && a.length > 3) score += 15;

  // Fan count indicates real, active artist on Deezer
  if (dzFans >= 100_000) score += 20;
  else if (dzFans >= 10_000) score += 15;
  else if (dzFans >= 1_000) score += 10;
  else if (dzFans >= 50) score += 5;

  // Has actual music on Deezer
  if (dzAlbums >= 5) score += 10;
  else if (dzAlbums >= 1) score += 5;

  return score;
}

const MATCH_THRESHOLD = 40; // Minimum score to accept a match

export async function matchToDeezer(
  mbArtists: MBArtist[],
  onProgress?: (processed: number, total: number, matched: number) => void
): Promise<{ matched: DiscoveredArtist[]; unmatchedCount: number }> {
  const matched: DiscoveredArtist[] = [];
  let unmatchedCount = 0;

  for (let i = 0; i < mbArtists.length; i++) {
    const mb = mbArtists[i];

    // Skip non-music types
    if (mb.type === "Character") {
      unmatchedCount++;
      continue;
    }

    try {
      const q = encodeURIComponent(mb.name);
      const data = await fetchJSON<DzSearchResult>(
        `${DZ_BASE}/search/artist?q=${q}&limit=5`
      );
      const results = data.data || [];

      if (results.length === 0) {
        unmatchedCount++;
        onProgress?.(i + 1, mbArtists.length, matched.length);
        await sleep(DZ_DELAY);
        continue;
      }

      // Find best match
      let best: (typeof results)[0] | null = null;
      let bestScore = 0;

      for (const dz of results) {
        const s = scoreMatch(mb.name, dz.name, dz.nb_fan, dz.nb_album);
        if (s > bestScore) {
          bestScore = s;
          best = dz;
        }
      }

      if (best && bestScore >= MATCH_THRESHOLD) {
        matched.push({
          deezerId: best.id,
          name: best.name,
          mbid: mb.mbid,
          mbName: mb.name,
          type: mb.type,
          genre: assignGenre(mb.name, best.name, mb.disambiguation),
          fans: best.nb_fan || 0,
          albums: best.nb_album || 0,
          picture: best.picture_big || best.picture_medium || "",
          matchScore: bestScore,
        });
      } else {
        unmatchedCount++;
      }
    } catch {
      unmatchedCount++;
    }

    onProgress?.(i + 1, mbArtists.length, matched.length);
    await sleep(DZ_DELAY);
  }

  return { matched, unmatchedCount };
}

// ─── Step 3: Genre assignment ───
const KNOWN_GENRES: Record<string, string> = {
  "kabza de small": "Amapiano",
  "dj maphorisa": "Amapiano",
  "focalistic": "Amapiano",
  "uncle waffles": "Amapiano",
  "vigro deep": "Amapiano",
  "tyler icu": "Amapiano",
  "de mthuda": "Amapiano",
  "dbn gogo": "Amapiano",
  "kelvin momo": "Amapiano",
  "musa keys": "Amapiano",
  "young stunna": "Amapiano",
  "daliwonga": "Amapiano",
  "busta 929": "Amapiano",
  "mr jazziq": "Amapiano",
  "lady du": "Amapiano",
  "sha sha": "Amapiano",
  "boohle": "Amapiano",
  "ami faku": "Afro Pop",
  "tyla": "Afro Pop",
  "brenda fassie": "Afro Pop",
  "yvonne chaka chaka": "Afro Pop",
  "lira": "Afro Pop",
  "zahara": "Afro Pop",
  "nasty c": "Hip Hop",
  "cassper nyovest": "Hip Hop",
  "a-reece": "Hip Hop",
  "emtee": "Hip Hop",
  "shane eagle": "Hip Hop",
  "kwesta": "Hip Hop",
  "nadia nakai": "Hip Hop",
  "youngstacpt": "Hip Hop",
  "k.o": "Hip Hop",
  "aka": "Hip Hop",
  "riky rick": "Hip Hop",
  "stogie t": "Hip Hop",
  "priddy ugly": "Hip Hop",
  "blxckie": "Hip Hop",
  "costa titch": "Hip Hop",
  "black coffee": "House",
  "nomcebo zikode": "House",
  "master kg": "House",
  "zakes bantwini": "Afro House",
  "shimza": "Afro House",
  "culoe de song": "Afro House",
  "da capo": "Afro House",
  "caiiro": "Afro House",
  "enoo napa": "Afro House",
  "oskido": "Kwaito",
  "arthur mafokate": "Kwaito",
  "mandoza": "Kwaito",
  "trompies": "Kwaito",
  "bongo maffin": "Kwaito",
  "boom shaka": "Kwaito",
  "mzekezeke": "Kwaito",
  "dj cleo": "Kwaito",
  "makhadzi": "Lekompo",
  "babes wodumo": "Gqom",
  "dj lag": "Gqom",
  "dj tira": "Gqom",
  "sjava": "Maskandi",
  "ladysmith black mambazo": "Maskandi",
  "ihashi elimhlophe": "Maskandi",
  "benjamin dube": "Gospel",
  "rebecca malope": "Gospel",
  "joyous celebration": "Gospel",
  "sipho makhabane": "Gospel",
  "hle": "Gospel",
  "omega khunou": "Gospel",
  "miriam makeba": "Afro Pop",
  "hugh masekela": "Jazz",
  "abdullah ibrahim": "Jazz",
  "jonas gwangwa": "Jazz",
  "jonathan butler": "Jazz",
  "johnny clegg": "Rock",
  "die antwoord": "Electronic",
  "goldfish": "Electronic",
  "black motion": "Afro House",
  "mafikizolo": "Afro Pop",
  "freshlyground": "Afro Pop",
  "locusts": "Rock",
  "seether": "Rock",
  "civil twilight": "Rock",
  "parlotones": "Rock",
};

const GENRE_HINTS: Record<string, string[]> = {
  Amapiano: ["amapiano", "piano", "log drum", "yanos"],
  House: ["house", "deep house", "soulful house"],
  "Afro House": ["afro house", "afro tech"],
  "Hip Hop": ["hip hop", "rap", "hip-hop", "mc", "rapper", "emcee"],
  "Afro Pop": ["afro pop", "afropop", "r&b", "pop", "afro soul"],
  Gqom: ["gqom", "durban"],
  Kwaito: ["kwaito"],
  Maskandi: ["maskandi", "zulu traditional", "isicathamiya"],
  Gospel: ["gospel", "worship", "christian", "praise", "church"],
  Lekompo: ["lekompo", "bolobedu"],
  Jazz: ["jazz"],
  Reggae: ["reggae", "dancehall"],
  Rock: ["rock", "metal", "punk", "alternative"],
  Electronic: ["electronic", "edm", "techno", "trance"],
};

function assignGenre(
  mbName: string,
  dzName: string,
  disambiguation: string
): string {
  // Check known artist genres
  const key = mbName.toLowerCase().trim();
  if (KNOWN_GENRES[key]) return KNOWN_GENRES[key];

  const dzKey = dzName.toLowerCase().trim();
  if (KNOWN_GENRES[dzKey]) return KNOWN_GENRES[dzKey];

  // Check disambiguation for hints
  const d = disambiguation.toLowerCase();
  for (const [genre, hints] of Object.entries(GENRE_HINTS)) {
    if (hints.some((h) => d.includes(h))) return genre;
  }

  return "Other";
}

// ─── Full Pipeline ───
export async function runDiscoveryPipeline(
  onLog?: (msg: string) => void
): Promise<DiscoveryResult> {
  const log = onLog || console.log;

  log("[1/3] Fetching SA artists from MusicBrainz...");
  const mbArtists = await fetchAllSAArtistsFromMB((fetched, total) => {
    if (fetched % 200 === 0 || fetched === total) {
      log(`  MusicBrainz: ${fetched}/${total} fetched`);
    }
  });
  log(`  ✓ ${mbArtists.length} SA artists found in MusicBrainz`);

  // Filter out non-performers
  const filtered = mbArtists.filter((a) => a.type !== "Character");
  log(`  Filtered to ${filtered.length} potential performers`);

  log("[2/3] Matching to Deezer...");
  const { matched, unmatchedCount } = await matchToDeezer(
    filtered,
    (done, total, m) => {
      if (done % 100 === 0 || done === total) {
        log(`  Deezer: ${done}/${total} processed, ${m} matched`);
      }
    }
  );
  log(`  ✓ ${matched.length} matched, ${unmatchedCount} unmatched`);

  // Deduplicate by Deezer ID and sort by fans
  log("[3/3] Deduplicating and sorting...");
  const seen = new Set<number>();
  const deduped = matched
    .sort((a, b) => b.fans - a.fans)
    .filter((a) => {
      if (seen.has(a.deezerId)) return false;
      seen.add(a.deezerId);
      return true;
    });

  const result: DiscoveryResult = {
    generated: new Date().toISOString(),
    totalScanned: filtered.length,
    totalMatched: deduped.length,
    artists: deduped,
  };

  log(`✓ Pipeline complete: ${deduped.length} unique SA artists`);
  return result;
}

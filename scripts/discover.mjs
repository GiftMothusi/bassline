#!/usr/bin/env node
/**
 * Standalone SA Artist Discovery Script
 *
 * Run this locally to populate src/data/sa-artists.json
 * Usage: node scripts/discover.mjs
 *
 * This is the same pipeline that the cron API route runs,
 * but packaged as a standalone script for local/CI use.
 */

import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT = join(__dirname, "..", "src", "data", "sa-artists.json");

// ─── Config ───
const MB_BASE = "https://musicbrainz.org/ws/2";
const MB_SA_AREA = "50cc7852-862e-30ae-aa82-385fe7135b7f";
const MB_UA = "Bassline/2.0 (https://bassline.co.za)";
const DZ_BASE = "https://api.deezer.com";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJSON(url, ua) {
  const h = { Accept: "application/json" };
  if (ua) h["User-Agent"] = ua;
  const r = await fetch(url, { headers: h });
  if (!r.ok) throw new Error(`${r.status} — ${url}`);
  return r.json();
}

// ─── Known SA artist genres ───
const KNOWN_GENRES = {
  "kabza de small": "Amapiano", "dj maphorisa": "Amapiano", "focalistic": "Amapiano",
  "uncle waffles": "Amapiano", "vigro deep": "Amapiano", "tyler icu": "Amapiano",
  "de mthuda": "Amapiano", "dbn gogo": "Amapiano", "kelvin momo": "Amapiano",
  "musa keys": "Amapiano", "young stunna": "Amapiano", "daliwonga": "Amapiano",
  "busta 929": "Amapiano", "mr jazziq": "Amapiano", "lady du": "Amapiano",
  "sha sha": "Amapiano", "boohle": "Amapiano",
  "ami faku": "Afro Pop", "tyla": "Afro Pop", "brenda fassie": "Afro Pop",
  "yvonne chaka chaka": "Afro Pop", "lira": "Afro Pop", "zahara": "Afro Pop",
  "mafikizolo": "Afro Pop", "freshlyground": "Afro Pop", "miriam makeba": "Afro Pop",
  "nasty c": "Hip Hop", "cassper nyovest": "Hip Hop", "a-reece": "Hip Hop",
  "emtee": "Hip Hop", "shane eagle": "Hip Hop", "kwesta": "Hip Hop",
  "nadia nakai": "Hip Hop", "youngstacpt": "Hip Hop", "k.o": "Hip Hop",
  "aka": "Hip Hop", "riky rick": "Hip Hop", "stogie t": "Hip Hop",
  "priddy ugly": "Hip Hop", "blxckie": "Hip Hop", "costa titch": "Hip Hop",
  "black coffee": "House", "nomcebo zikode": "House", "master kg": "House",
  "zakes bantwini": "Afro House", "shimza": "Afro House", "culoe de song": "Afro House",
  "da capo": "Afro House", "caiiro": "Afro House", "black motion": "Afro House",
  "oskido": "Kwaito", "arthur mafokate": "Kwaito", "mandoza": "Kwaito",
  "trompies": "Kwaito", "bongo maffin": "Kwaito", "boom shaka": "Kwaito",
  "dj cleo": "Kwaito",
  "makhadzi": "Lekompo",
  "babes wodumo": "Gqom", "dj lag": "Gqom", "dj tira": "Gqom",
  "sjava": "Maskandi", "ladysmith black mambazo": "Maskandi",
  "benjamin dube": "Gospel", "rebecca malope": "Gospel", "joyous celebration": "Gospel",
  "hle": "Gospel", "omega khunou": "Gospel",
  "hugh masekela": "Jazz", "abdullah ibrahim": "Jazz", "jonas gwangwa": "Jazz",
  "johnny clegg": "Rock", "die antwoord": "Electronic", "goldfish": "Electronic",
  "seether": "Rock", "parlotones": "Rock",
};

function assignGenre(mbName, dzName, disambig) {
  const k1 = mbName.toLowerCase().trim();
  const k2 = dzName.toLowerCase().trim();
  if (KNOWN_GENRES[k1]) return KNOWN_GENRES[k1];
  if (KNOWN_GENRES[k2]) return KNOWN_GENRES[k2];
  const d = (disambig || "").toLowerCase();
  if (d.includes("amapiano")) return "Amapiano";
  if (d.includes("hip hop") || d.includes("rap")) return "Hip Hop";
  if (d.includes("house")) return "House";
  if (d.includes("gospel")) return "Gospel";
  if (d.includes("kwaito")) return "Kwaito";
  if (d.includes("gqom")) return "Gqom";
  if (d.includes("jazz")) return "Jazz";
  if (d.includes("rock") || d.includes("metal")) return "Rock";
  if (d.includes("maskandi")) return "Maskandi";
  if (d.includes("pop")) return "Afro Pop";
  return "Other";
}

function normalize(n) {
  return n.toLowerCase().replace(/[^a-z0-9\s'&-]/g, "").replace(/\s+/g, " ").trim();
}

function matchScore(mbName, dzName, fans, albums) {
  const a = normalize(mbName), b = normalize(dzName);
  let s = 0;
  if (a === b) s += 50;
  else if (a.includes(b) || b.includes(a)) s += 30;
  else if (a.split(" ")[0] === b.split(" ")[0] && a.length > 3) s += 15;
  if (fans >= 100000) s += 20;
  else if (fans >= 10000) s += 15;
  else if (fans >= 1000) s += 10;
  else if (fans >= 50) s += 5;
  if (albums >= 5) s += 10;
  else if (albums >= 1) s += 5;
  return s;
}

// ─── Main ───
async function main() {
  console.log("\n🎵 Bassline SA Artist Discovery\n");

  // Step 1: MusicBrainz
  console.log("[1/3] Fetching from MusicBrainz (area=South Africa)...");
  const mbArtists = [];
  let offset = 0, total = null;

  while (total === null || offset < total) {
    const url = `${MB_BASE}/artist?area=${MB_SA_AREA}&limit=100&offset=${offset}&fmt=json`;
    try {
      const d = await fetchJSON(url, MB_UA);
      total = d["artist-count"];
      for (const a of d.artists || []) {
        mbArtists.push({
          mbid: a.id, name: a.name, type: a.type || "Unknown",
          disambig: a.disambiguation || "",
        });
      }
      process.stdout.write(`\r  ${mbArtists.length}/${total} artists...`);
      offset += 100;
      if (offset < total) await sleep(1200);
    } catch (e) {
      console.error(`\n  Error at offset ${offset}: ${e.message}`);
      await sleep(5000);
      offset += 100;
    }
  }
  console.log(`\n  ✓ ${mbArtists.length} SA artists from MusicBrainz\n`);

  // Filter
  const filtered = mbArtists.filter((a) => a.type !== "Character");

  // Step 2: Deezer matching
  console.log("[2/3] Matching to Deezer...");
  const matched = [];
  let unmatched = 0;

  for (let i = 0; i < filtered.length; i++) {
    const mb = filtered[i];
    try {
      const d = await fetchJSON(`${DZ_BASE}/search/artist?q=${encodeURIComponent(mb.name)}&limit=5`);
      const results = d.data || [];
      let best = null, bestS = 0;
      for (const dz of results) {
        const s = matchScore(mb.name, dz.name, dz.nb_fan || 0, dz.nb_album || 0);
        if (s > bestS) { bestS = s; best = dz; }
      }
      if (best && bestS >= 40) {
        matched.push({
          deezerId: best.id, name: best.name, mbid: mb.mbid, mbName: mb.name,
          type: mb.type, genre: assignGenre(mb.name, best.name, mb.disambig),
          fans: best.nb_fan || 0, albums: best.nb_album || 0,
          picture: best.picture_big || best.picture_medium || "",
          matchScore: bestS,
        });
      } else { unmatched++; }
    } catch { unmatched++; }

    if ((i + 1) % 50 === 0 || i === filtered.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${filtered.length} processed, ${matched.length} matched`);
    }
    await sleep(200);
  }
  console.log(`\n  ✓ ${matched.length} matched, ${unmatched} unmatched\n`);

  // Step 3: Deduplicate + save
  console.log("[3/3] Saving...");
  const seen = new Set();
  const deduped = matched
    .sort((a, b) => b.fans - a.fans)
    .filter((a) => { if (seen.has(a.deezerId)) return false; seen.add(a.deezerId); return true; });

  const result = {
    generated: new Date().toISOString(),
    totalScanned: filtered.length,
    totalMatched: deduped.length,
    artists: deduped,
  };

  const dir = dirname(OUTPUT);
  mkdirSync(dir, { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(result, null, 2));

  // Stats
  const genres = {};
  deduped.forEach((a) => { genres[a.genre] = (genres[a.genre] || 0) + 1; });

  console.log(`\n  ✅ ${deduped.length} unique SA artists saved to src/data/sa-artists.json`);
  console.log(`\n  Top 10:`);
  deduped.slice(0, 10).forEach((a, i) => {
    console.log(`    ${i + 1}. ${a.name} — ${a.fans.toLocaleString()} fans (${a.genre})`);
  });
  console.log(`\n  Genres:`);
  Object.entries(genres).sort((a, b) => b[1] - a[1]).forEach(([g, c]) => {
    console.log(`    ${g}: ${c}`);
  });
  console.log("");
}

main().catch((e) => { console.error("Failed:", e); process.exit(1); });

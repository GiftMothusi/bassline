import { getArtist, getAlbums } from "@/lib/deezer";
import { SA_ARTIST_IDS, ARTIST_GENRES } from "@/lib/constants";
import NewsClient from "./NewsClient";

export const metadata = { title: "News & Releases — Bassline" };

interface Release {
  id: number; title: string; artistName: string; artistId: number;
  cover: string; coverBig: string; date: string; type: string; tracks: number; link: string; genre: string;
}

export default async function NewsPage() {
  const releases: Release[] = [];

  // Fetch recent albums from each SA artist
  const artistResults = await Promise.allSettled(
    SA_ARTIST_IDS.map(async (id) => {
      const [artist, albums] = await Promise.all([getArtist(id), getAlbums(id, 5)]);
      return { artist, albums };
    })
  );

  for (const r of artistResults) {
    if (r.status !== "fulfilled") continue;
    const { artist, albums } = r.value;
    for (const a of albums) {
      releases.push({
        id: a.id,
        title: a.title,
        artistName: artist.name,
        artistId: artist.id,
        cover: a.cover_medium,
        coverBig: a.cover_big || a.cover_xl || a.cover_medium,
        date: a.release_date,
        type: a.record_type,
        tracks: a.nb_tracks,
        link: a.link,
        genre: ARTIST_GENRES[artist.id] || "Other",
      });
    }
  }

  // Sort by release date (newest first)
  releases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return <NewsClient releases={releases} />;
}

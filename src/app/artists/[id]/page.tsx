import { getArtist, getTopTracks, getAlbums, getRelated } from "@/lib/deezer";
import { ARTIST_GENRES } from "@/lib/constants";
import ArtistDetailClient from "./ArtistDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const artist = await getArtist(parseInt(id, 10));
    return { title: `${artist.name} — Bassline` };
  } catch { return { title: "Artist — Bassline" }; }
}

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  try {
    const [artist, topTracks, albums, related] = await Promise.all([
      getArtist(numId),
      getTopTracks(numId, 10),
      getAlbums(numId, 20),
      getRelated(numId, 6),
    ]);

    return (
      <ArtistDetailClient
        artist={{ ...artist, genre: ARTIST_GENRES[numId] || "Other" }}
        topTracks={topTracks}
        albums={albums}
        related={related.map((r) => ({ ...r, genre: ARTIST_GENRES[r.id] || "Other" }))}
      />
    );
  } catch {
    notFound();
  }
}

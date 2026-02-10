import { getArtist, getTopTracks, getAlbums, getRelated } from "@/lib/deezer";
import { ARTIST_GENRES, isSAArtist } from "@/lib/constants";
import ArtistDetailClient from "./ArtistDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const artist = await getArtist(parseInt(id, 10));
    return { title: `${artist.name} — Bassline` };
  } catch {
    return { title: "Artist — Bassline" };
  }
}

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) notFound();

  try {
    const [artist, topTracks, albums, rawRelated] = await Promise.all([
      getArtist(numId),
      getTopTracks(numId, 10),
      getAlbums(numId, 20),
      getRelated(numId, 20),
    ]);

    // Only show related artists that are verified SA
    const related = rawRelated
      .filter((r) => isSAArtist(r.id))
      .slice(0, 6)
      .map((r) => ({ ...r, genre: ARTIST_GENRES[r.id] || "Other" }));

    return (
      <ArtistDetailClient
        artist={{ ...artist, genre: ARTIST_GENRES[numId] || "Other" }}
        topTracks={topTracks}
        albums={albums}
        related={related}
      />
    );
  } catch {
    notFound();
  }
}

import { NextResponse } from "next/server";
import { getArtist, getTopTracks, getAlbums, getRelatedSA } from "@/lib/deezer";
import { ARTIST_GENRES, SA_ARTIST_ID_SET } from "@/lib/constants";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const [artist, topTracks, albums, related] = await Promise.all([
      getArtist(numId),
      getTopTracks(numId),
      getAlbums(numId),
      getRelatedSA(numId, SA_ARTIST_ID_SET, 6),
    ]);
    return NextResponse.json({
      ...artist,
      genre: ARTIST_GENRES[numId] || "Other",
      topTracks,
      albums,
      related: related.map((r) => ({ ...r, genre: ARTIST_GENRES[r.id] || "Other" })),
    });
  } catch {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
}
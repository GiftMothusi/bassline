import { NextResponse } from "next/server";
import { getArtist, getTopTracks, getAlbums, getRelated } from "@/lib/deezer";
import { ARTIST_GENRES, isSAArtist } from "@/lib/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId))
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const [artist, topTracks, albums, rawRelated] = await Promise.all([
      getArtist(numId),
      getTopTracks(numId),
      getAlbums(numId),
      getRelated(numId, 20),
    ]);

    const related = rawRelated
      .filter((r) => isSAArtist(r.id))
      .slice(0, 6)
      .map((r) => ({ ...r, genre: ARTIST_GENRES[r.id] || "Other" }));

    return NextResponse.json({
      ...artist,
      genre: ARTIST_GENRES[numId] || "Other",
      topTracks,
      albums,
      related,
    });
  } catch {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }
}

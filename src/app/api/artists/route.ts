import { NextResponse } from "next/server";
import { getArtist } from "@/lib/deezer";
import { SA_ARTIST_IDS, ARTIST_GENRES } from "@/lib/constants";

export async function GET() {
  try {
    const artists = await Promise.allSettled(SA_ARTIST_IDS.map((id) => getArtist(id)));
    const data = artists
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getArtist>>> => r.status === "fulfilled")
      .map((r) => ({ ...r.value, genre: ARTIST_GENRES[r.value.id] || "Other" }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}

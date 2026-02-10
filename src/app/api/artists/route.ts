import { NextResponse } from "next/server";
import { getArtist } from "@/lib/deezer";
import { SA_ARTISTS, ARTIST_GENRES } from "@/lib/constants";

export async function GET() {
  try {
    const toFetch = SA_ARTISTS.slice(0, 50);
    const results = await Promise.allSettled(
      toFetch.map((sa) => getArtist(sa.deezerId))
    );
    const data = results
      .filter(
        (r): r is PromiseFulfilledResult<
          Awaited<ReturnType<typeof getArtist>>
        > => r.status === "fulfilled"
      )
      .map((r) => ({
        ...r.value,
        genre: ARTIST_GENRES[r.value.id] || "Other",
      }));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch artists" },
      { status: 500 }
    );
  }
}

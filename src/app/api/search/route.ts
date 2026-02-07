import { NextResponse } from "next/server";
import { searchArtists, searchTracks } from "@/lib/deezer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "artist";
  if (!q) return NextResponse.json({ data: [] });
  try {
    const data = type === "track" ? await searchTracks(q) : await searchArtists(q);
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

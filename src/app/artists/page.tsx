import { getArtist } from "@/lib/deezer";
import { SA_ARTIST_IDS, ARTIST_GENRES } from "@/lib/constants";
import ArtistsClient from "./ArtistsClient";

export const metadata = { title: "Artists — Bassline" };

export default async function ArtistsPage() {
  const results = await Promise.allSettled(SA_ARTIST_IDS.map((id) => getArtist(id)));
  const artists = results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getArtist>>> => r.status === "fulfilled")
    .map((r) => ({ ...r.value, genre: ARTIST_GENRES[r.value.id] || "Other" }));

  return <ArtistsClient artists={artists} />;
}

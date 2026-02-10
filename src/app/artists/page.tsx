import { getArtist } from "@/lib/deezer";
import { SA_ARTISTS, ARTIST_GENRES } from "@/lib/constants";
import ArtistsClient from "./ArtistsClient";

export const metadata = { title: "Artists — Bassline" };

export default async function ArtistsPage() {
  // Fetch live Deezer data for top 50 SA artists
  const toFetch = SA_ARTISTS.slice(0, 50);

  const results = await Promise.allSettled(
    toFetch.map((sa) => getArtist(sa.deezerId))
  );
  const artists = results
    .filter(
      (r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getArtist>>> =>
        r.status === "fulfilled"
    )
    .map((r) => ({
      ...r.value,
      genre: ARTIST_GENRES[r.value.id] || "Other",
    }));

  return <ArtistsClient artists={artists} />;
}

import { getArtist } from "@/lib/deezer";
import { getTopArtists, ARTIST_GENRES } from "@/lib/constants";
import RankingsClient from "./RankingsClient";

export const metadata = { title: "Rankings — Bassline" };

export default async function RankingsPage() {
  const topSA = getTopArtists(30);

  const results = await Promise.allSettled(
    topSA.map((sa) => getArtist(sa.deezerId))
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

  return <RankingsClient artists={artists} />;
}

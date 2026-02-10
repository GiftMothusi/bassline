import { getArtist, getTopTracks } from "@/lib/deezer";
import { getTopArtists, ARTIST_GENRES } from "@/lib/constants";
import HomeClient from "@/components/layout/HomeClient";

export default async function HomePage() {
  const topSA = getTopArtists(20);

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

  // Featured = most popular
  const featured = [...artists].sort((a, b) => b.nb_fan - a.nb_fan)[0];
  let featuredTracks: Awaited<ReturnType<typeof getTopTracks>> = [];
  if (featured) {
    try {
      featuredTracks = await getTopTracks(featured.id, 5);
    } catch {}
  }

  return (
    <HomeClient
      artists={artists}
      featured={featured}
      featuredTracks={featuredTracks}
    />
  );
}

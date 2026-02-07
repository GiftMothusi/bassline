import { getArtist, getTopTracks } from "@/lib/deezer";
import { SA_ARTIST_IDS, ARTIST_GENRES } from "@/lib/constants";
import HomeClient from "@/components/layout/HomeClient";

export default async function HomePage() {
  // Fetch all SA artists live from Deezer
  const results = await Promise.allSettled(SA_ARTIST_IDS.map((id) => getArtist(id)));
  const artists = results
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getArtist>>> => r.status === "fulfilled")
    .map((r) => ({ ...r.value, genre: ARTIST_GENRES[r.value.id] || "Other" }));

  // Fetch top tracks from the most popular artist for featured section
  const featured = artists.sort((a, b) => b.nb_fan - a.nb_fan)[0];
  let featuredTracks: Awaited<ReturnType<typeof getTopTracks>> = [];
  if (featured) {
    try { featuredTracks = await getTopTracks(featured.id, 5); } catch {}
  }

  return <HomeClient artists={artists} featured={featured} featuredTracks={featuredTracks} />;
}

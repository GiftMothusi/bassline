// Deezer public API — no auth needed
const API = "https://api.deezer.com";

export interface DzArtist {
  id: number; name: string; link: string;
  picture: string; picture_small: string; picture_medium: string;
  picture_big: string; picture_xl: string;
  nb_album: number; nb_fan: number; tracklist: string;
}

export interface DzAlbum {
  id: number; title: string; link: string;
  cover: string; cover_small: string; cover_medium: string;
  cover_big: string; cover_xl: string;
  release_date: string; record_type: string; nb_tracks: number;
  artist: { id: number; name: string };
}

export interface DzTrack {
  id: number; title: string; title_short: string;
  duration: number; rank: number; preview: string; link: string;
  artist: { id: number; name: string };
  album: {
    id: number; title: string; cover: string;
    cover_medium: string; cover_big: string; cover_xl: string;
  };
}

async function dz<T>(path: string): Promise<T> {
  const r = await fetch(`${API}${path}`, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`Deezer ${r.status}`);
  return r.json();
}

export const getArtist = (id: number) => dz<DzArtist>(`/artist/${id}`);

export const getTopTracks = async (id: number, n = 10) =>
  ((await dz<{ data: DzTrack[] }>(`/artist/${id}/top?limit=${n}`)).data ?? []);

export const getAlbums = async (id: number, n = 20) =>
  ((await dz<{ data: DzAlbum[] }>(`/artist/${id}/albums?limit=${n}`)).data ?? []);

export const getRelated = async (id: number, n = 10) => {
  try { return (await dz<{ data: DzArtist[] }>(`/artist/${id}/related?limit=${n}`)).data ?? []; }
  catch { return []; }
};

/**
 * Get related artists filtered to only SA artists in our curated list.
 * Falls back to fetching full SA artist data for better recommendations.
 */
export const getRelatedSA = async (id: number, saIds: Set<number>, n = 6) => {
  try {
    // Fetch more from Deezer to increase chance of SA artist matches
    const related = await getRelated(id, 50);
    // Filter to only artists in our SA list
    const saRelated = related.filter((a) => saIds.has(a.id) && a.id !== id);
    return saRelated.slice(0, n);
  } catch {
    return [];
  }
};

export const searchArtists = async (q: string, n = 25) =>
  ((await dz<{ data: DzArtist[] }>(`/search/artist?q=${encodeURIComponent(q)}&limit=${n}`)).data ?? []);

export const searchTracks = async (q: string, n = 25) =>
  ((await dz<{ data: DzTrack[] }>(`/search/track?q=${encodeURIComponent(q)}&limit=${n}`)).data ?? []);
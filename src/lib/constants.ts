/**
 * App Constants
 *
 * Artist data comes from sa-data.ts (powered by the discovery pipeline).
 * This file re-exports artist helpers and holds static non-artist constants.
 */

// Artist data — powered by MusicBrainz → Deezer discovery pipeline
export {
  SA_ARTISTS,
  SA_ARTIST_IDS,
  ARTIST_GENRES,
  isSAArtist,
  getTopArtists,
  getArtistsByGenre,
  getAvailableGenres,
  SA_DATASET,
} from "./sa-data";

// Static constants
export const GENRES = [
  "All",
  "Amapiano",
  "House",
  "Hip Hop",
  "Afro Pop",
  "Afro House",
  "Gqom",
  "Lekompo",
  "Maskandi",
  "Gospel",
  "Kwaito",
  "Afro Soul",
  "Jazz",
  "Reggae",
  "Rock",
  "Electronic",
  "Other",
];

export const PROVINCES = [
  "Gauteng",
  "Western Cape",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Free State",
  "Eastern Cape",
  "North West",
  "Northern Cape",
];

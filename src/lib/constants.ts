// Verified Deezer IDs for South African artists
// ALL data (name, image, bio, albums) fetched live from Deezer API
// IDs verified against https://www.deezer.com/artist/{ID} on 2026-02-07
export const SA_ARTIST_IDS = [
  8671236,    // Kabza De Small
  1220981,    // Tyla (main canonical profile with full bio)
  8907066,    // Nasty C
  49541722,   // Black Coffee
  11145336,   // Makhadzi
  8355648,    // DJ Maphorisa
  5895321,    // Cassper Nyovest (was 4860761 = J Balvin!)
  1387344,    // Zakes Bantwini (was 5765438 = wrong artist)
  10282494,   // Babes Wodumo
  10695498,   // Sjava
  163177647,  // Uncle Waffles (was 168995527 = wrong artist)
  9635624,    // Focalistic
  73551,      // Benjamin Dube (was 4495513 = wrong artist)
  324473,     // OSKIDO (was 5245647 = wrong artist)
  60344202,   // Nomcebo Zikode (was 6847498 = wrong artist)
];

// Genre tags we assign (Deezer doesn't always have SA genre info)
export const ARTIST_GENRES: Record<number, string> = {
  8671236: "Amapiano",      // Kabza De Small
  1220981: "Afro Pop",      // Tyla
  8907066: "Hip Hop",       // Nasty C
  49541722: "House",        // Black Coffee
  11145336: "Lekompo",      // Makhadzi
  8355648: "Amapiano",      // DJ Maphorisa
  5895321: "Hip Hop",       // Cassper Nyovest
  1387344: "Afro House",    // Zakes Bantwini
  10282494: "Gqom",         // Babes Wodumo
  10695498: "Maskandi",     // Sjava
  163177647: "Amapiano",    // Uncle Waffles
  9635624: "Amapiano",      // Focalistic
  73551: "Gospel",          // Benjamin Dube
  324473: "Kwaito",         // OSKIDO
  60344202: "House",        // Nomcebo Zikode
};

// Set of valid SA artist IDs for quick lookup (used to filter related artists)
export const SA_ARTIST_ID_SET = new Set(SA_ARTIST_IDS);

export const GENRES = [
  "All", "Amapiano", "House", "Hip Hop", "Afro Pop",
  "Afro House", "Gqom", "Lekompo", "Maskandi", "Gospel", "Kwaito",
];

export const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Free State", "Eastern Cape", "North West", "Northern Cape",
];
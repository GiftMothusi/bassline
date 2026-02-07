// Verified Deezer IDs for South African artists
// ALL data (name, image, bio, albums) fetched live from Deezer API
// IDs verified against https://www.deezer.com/artist/{ID} on 2026-02-07
export const SA_ARTIST_IDS = [
  8671236,    // Kabza De Small       — deezer.com/artist/8671236
  1220981,    // Tyla                  — deezer.com/artist/1220981
  8907066,    // Nasty C               — deezer.com/artist/8907066
  49541722,   // Black Coffee          — deezer.com/artist/49541722
  11145336,   // Makhadzi              — deezer.com/artist/11145336
  8355648,    // DJ Maphorisa          — deezer.com/artist/8355648
  5895321,    // Cassper Nyovest       — deezer.com/artist/5895321
  1387344,    // Zakes Bantwini        — deezer.com/artist/1387344
  10282494,   // Babes Wodumo          — deezer.com/artist/10282494
  10695498,   // Sjava                 — deezer.com/artist/10695498
  163177647,  // Uncle Waffles         — deezer.com/artist/163177647
  11871785,   // Focalistic            — deezer.com/artist/11871785
  73551,      // Benjamin Dube         — deezer.com/artist/73551
  324473,     // OSKIDO                — deezer.com/artist/324473
  60344202,   // Nomcebo Zikode        — deezer.com/artist/60344202
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
  11871785: "Amapiano",     // Focalistic
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
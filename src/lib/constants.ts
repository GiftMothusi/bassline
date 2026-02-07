// Verified Deezer IDs for South African artists
// ALL data (name, image, bio, albums) fetched live from Deezer API
export const SA_ARTIST_IDS = [
  8671236,    // Kabza De Small
  134421582,  // Tyla
  8907066,    // Nasty C
  49541722,   // Black Coffee
  11145336,   // Makhadzi
  8355648,    // DJ Maphorisa
  4860761,    // Cassper Nyovest
  5765438,    // Zakes Bantwini
  10282494,   // Babes Wodumo
  10695498,   // Sjava
  168995527,  // Uncle Waffles
  9635624,    // Focalistic
  4495513,    // Benjamin Dube
  5245647,    // Oskido
  6847498,    // Nomcebo Zikode
];

// Genre tags we assign (Deezer doesn't always have SA genre info)
export const ARTIST_GENRES: Record<number, string> = {
  8671236: "Amapiano",
  134421582: "Afro Pop",
  8907066: "Hip Hop",
  49541722: "House",
  11145336: "Lekompo",
  8355648: "Amapiano",
  4860761: "Hip Hop",
  5765438: "Afro House",
  10282494: "Gqom",
  10695498: "Maskandi",
  168995527: "Amapiano",
  9635624: "Amapiano",
  4495513: "Gospel",
  5245647: "Kwaito",
  6847498: "House",
};

export const GENRES = [
  "All", "Amapiano", "House", "Hip Hop", "Afro Pop",
  "Afro House", "Gqom", "Lekompo", "Maskandi", "Gospel", "Kwaito",
];

export const PROVINCES = [
  "Gauteng", "Western Cape", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Free State", "Eastern Cape", "North West", "Northern Cape",
];

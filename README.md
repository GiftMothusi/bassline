# Bassline — South African Music & Culture Platform

> **For the People. By the People. Unbiased. Beautiful.**

A modern entertainment website celebrating South African music artists, powered by live data from the [Deezer API](https://developers.deezer.com/).

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Components)
- **UI:** React 19, TypeScript, Tailwind CSS
- **Animations:** Framer Motion
- **State:** Zustand
- **Icons:** Lucide React
- **Data:** Deezer Public API (no auth required)
- **Fonts:** Outfit + Bricolage Grotesque (Google Fonts)

## Features

- **Artist Directory** — Browse 15+ SA artists with real photos, fan counts, and albums from Deezer
- **Artist Profiles** — Full detail pages with top tracks, discography, related artists
- **Rankings** — Community voting for Artist of the Month
- **Star Ratings** — Rate artists 1-5 stars
- **Hot or Not** — Quick voting on artist momentum
- **New Releases** — Latest albums and singles from SA artists, live from Deezer
- **Events** — Community event submission with approval workflow
- **Auth** — Client-side registration and login
- **Responsive** — Mobile-first design
- **Dark Theme** — #0c0e1a + #9CFF00 neon green accent

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

No API keys needed — Deezer's public endpoints require no authentication.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home (server → fetches artists)
│   ├── layout.tsx            # Root layout with fonts, nav, footer
│   ├── artists/
│   │   ├── page.tsx          # Artist directory (server)
│   │   ├── ArtistsClient.tsx # Client: search, filter, sort
│   │   └── [id]/
│   │       ├── page.tsx      # Artist detail (server)
│   │       └── ArtistDetailClient.tsx
│   ├── rankings/             # Rankings + voting
│   ├── events/               # Event submission
│   ├── news/                 # New releases from Deezer
│   └── api/                  # API routes (proxy to Deezer)
├── components/
│   ├── layout/               # Navbar, Footer, HomeClient
│   └── ui/                   # ArtistCard, AuthModal, Toasts
├── lib/
│   ├── deezer.ts             # Deezer API client
│   └── constants.ts          # Artist IDs, genres, provinces
└── store/
    └── index.ts              # Zustand store (auth, voting, toasts)
```

## Data Flow

1. **Server Components** fetch data from Deezer API at request time (cached 1 hour)
2. **API Routes** provide endpoints for client-side fetching
3. **Client Components** handle interactivity (voting, filtering, auth)
4. **Zustand Store** manages client-side state (no backend DB yet)

## SA Artists Included

Kabza De Small, Tyla, Nasty C, Black Coffee, Makhadzi, DJ Maphorisa, Cassper Nyovest, Zakes Bantwini, Babes Wodumo, Sjava, Uncle Waffles, Focalistic, Benjamin Dube, Oskido, Nomcebo Zikode

## Adding More Artists

Add their Deezer ID to `src/lib/constants.ts`:

```ts
export const SA_ARTIST_IDS = [
  8671236,    // Kabza De Small
  // ... add more IDs
];
```

Find Deezer IDs at: `https://www.deezer.com/en/artist/{ID}`

---

Built with ❤️ for the South African music community.

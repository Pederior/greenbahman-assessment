export interface Game {
  id: number;
  name: string;
  background_image: string;
  background_image_additional?: string;
  description_raw?: string;
  released: string;
  rating: number;
  rating_top: number;
  genres: { id: number; name: string }[];
  platforms: { platform: { id: number; name: string } }[];
  stores?: { store: { id: number; name: string } }[];
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface GamesResponse {
  count: number;
  results: Game[];
  next: string | null;
  previous: string | null;
}
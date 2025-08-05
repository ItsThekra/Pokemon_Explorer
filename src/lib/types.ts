// Types for Pokemon data
export interface PokemonCard {
  id: string;
  name: string;
  image: string;
  types: string[];
  stats?: { name: string; value: number }[];
  abilities?: string[];
}

export interface PokemonDetails {
  id: string;
  name: string;
  image: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: string[];
  height: number;
  weight: number;
  base_experience: number;
}

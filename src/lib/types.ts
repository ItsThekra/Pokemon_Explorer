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

// Raw API response types
export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    stat: {
      name: string;
    };
    base_stat: number;
  }>;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  base_experience: number;
}

export interface PokemonListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
  next: string | null;
  previous: string | null;
}

export interface TypeListResponse {
  results: Array<{
    name: string;
    url: string;
  }>;
}

// Page data types
export interface PageData {
  pokemons: PokemonCard[];
  allPokemons: PokemonCard[];
  types: string[];
  searchTerm: string;
  selectedType: string;
  hasNext: boolean;
  hasPrevious: boolean;
  offset: number;
  limit: number;
  error?: string;
}

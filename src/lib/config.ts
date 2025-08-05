// This is anApplication configuration:
export const CONFIG = {
  // Pokemon loading settings
  POKEMON_PER_PAGE: 5,
  MAX_POKEMON_LOAD: 50,
  SEARCH_LIMIT_EXTENDED: 200,
  
  // App metadata
  APP_NAME: 'Pokédx Explorer',
  APP_DESCRIPTION: 'Gotta catch \'em all!',
  
  // UI settings
  SIDEBAR_BREAKPOINT: 'lg', // Tailwind breakpoint
  MOBILE_MENU_Z_INDEX: 40,
  DETAILS_PANEL_Z_INDEX: 50,
} as const;

// Type filters
export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

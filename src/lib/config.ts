// Application configuration
export const CONFIG = {
  // Pokemon loading settings
  POKEMON_PER_PAGE: 5,
  MAX_POKEMON_LOAD: 50,
  SEARCH_LIMIT_EXTENDED: 200,
  
  // API settings
  API_TIMEOUT: 8000, // 8 seconds
  DEBOUNCE_DELAY: 300, // 300ms for search
  
  // Pokemon API endpoints (for reference only)
  POKEMON_API_BASE: 'https://pokeapi.co/api/v2',
  
  // App metadata
  APP_NAME: 'Pokédex Explorer',
  APP_DESCRIPTION: 'Gotta catch \'em all!',
  
  // UI settings
  SIDEBAR_BREAKPOINT: 'lg', // Tailwind breakpoint
  MOBILE_MENU_Z_INDEX: 40,
  DETAILS_PANEL_Z_INDEX: 50,
} as const;

// Type filters available
export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
] as const;

export type PokemonType = typeof POKEMON_TYPES[number];

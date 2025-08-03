import type { PageServerLoad } from './$types';
import { CONFIG } from '$lib/config';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const searchTerm = url.searchParams.get('search') || '';
  const selectedType = url.searchParams.get('type') || '';
  const loadedCount = Number(url.searchParams.get('loaded') ?? 0);
  const loadMore = url.searchParams.get('loadMore') === 'true';
  
  // Load Pokemon settings from config
  const increment = CONFIG.POKEMON_PER_PAGE; //every time increment by 5 
  const maxPokemon = CONFIG.MAX_POKEMON_LOAD;
  const currentlyLoaded = loadMore ? Math.min(loadedCount + increment, maxPokemon) : Math.min(Math.max(loadedCount, increment), maxPokemon);
  
  try {
    // Get the current host from the URL
    const host = url.origin;
    
    // For better search and type filtering, load more Pokemon when searching
    const searchLimit = (searchTerm || selectedType) ? CONFIG.SEARCH_LIMIT_EXTENDED : maxPokemon;
    
    // Load Pokemon AND types in parallel (MAJOR PERFORMANCE BOOST!)
    const [pokemonRes, typesRes] = await Promise.all([
      fetch(`${host}/api/pokemon?limit=${searchLimit}&offset=0`),
      fetch(`${host}/api/types`)
    ]);
    
    const [pokemonData, typesData] = await Promise.all([
      pokemonRes.json(),
      typesRes.json()
    ]);
    
    const types = typesData.results.map((type: { name: string }) => type.name);
    
    // Load detailed Pokemon data with timeout protection
    const detailedPokemons = await Promise.all(
      pokemonData.results.map(async (poke: { name: string; url: string }) => {
        const id = poke.url.split('/').filter(Boolean).pop();
        
        try {
          // Add timeout to prevent hanging requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 8000);
          
          const detail = await fetch(`${host}/api/pokemon/${id}`, {
            signal: controller.signal
          }).then((res) => res.json());
          
          clearTimeout(timeoutId);
          
          return {
            id,
            name: poke.name,
            image: detail.sprites?.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: detail.types?.map((t: { type: { name: string } }) => t.type.name) || ['normal'],
            stats: detail.stats?.map((s: { stat: { name: string }; base_stat: number }) => ({
              name: s.stat.name,
              value: s.base_stat
            })) || [],
            abilities: detail.abilities?.map((a: { ability: { name: string } }) => a.ability.name) || []
          };
        } catch (error) {
          console.error(`Failed to load Pokemon ${id}:`, error);
          // Return fallback data instead of failing
          return {
            id,
            name: poke.name,
            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
            types: ['normal'],
            stats: [
              { name: 'hp', value: 50 },
              { name: 'attack', value: 50 },
              { name: 'defense', value: 50 }
            ],
            abilities: ['hidden-ability']
          };
        }
      })
    );
    
    // Filter Pokemon based on search and type
    let filteredPokemons = detailedPokemons;
    
    // Apply search filter first
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      
      filteredPokemons = filteredPokemons.filter((p) => {
        const pokemonName = p.name.toLowerCase();
        // Simple search: check if Pokemon name contains the search term
        return pokemonName.includes(searchLower);
      });
    }
    
    // Apply type filter - clean the selected type parameter
    if (selectedType && selectedType !== '' && selectedType.toLowerCase() !== 'all') {
      const cleanType = selectedType.toLowerCase().trim();
      filteredPokemons = filteredPokemons.filter((p) =>
        p.types.includes(cleanType)
      );
    }
    
    // Apply load more functionality to filtered results
    let finalPokemons = filteredPokemons;
    
    if (searchTerm || selectedType) {
      // For search/filter results, show only the currently loaded amount
      finalPokemons = filteredPokemons.slice(0, currentlyLoaded);
    } else {
      // For normal browsing, show only the currently loaded amount
      finalPokemons = filteredPokemons.slice(0, currentlyLoaded);
    }
    
    // Calculate if we can load more
    const canLoadMore = finalPokemons.length < Math.min(filteredPokemons.length, maxPokemon) && currentlyLoaded < maxPokemon;
    const remainingCount = Math.min(filteredPokemons.length, maxPokemon) - currentlyLoaded;

    return {
      pokemons: finalPokemons,
      allPokemons: detailedPokemons,
      types,
      searchTerm,
      selectedType: selectedType || '',
      totalCount: pokemonData.count,
      currentlyLoaded,
      maxPokemon,
      canLoadMore,
      remainingCount,
      filteredCount: filteredPokemons.length
    };
  } catch (error) {
    console.error('Failed to load Pokemon data:', error);
    return {
      pokemons: [],
      allPokemons: [],
      types: [],
      searchTerm: '',
      selectedType: '',
      totalCount: 0,
      currentlyLoaded: 0,
      maxPokemon: 50,
      canLoadMore: false,
      remainingCount: 0,
      filteredCount: 0,
      error: 'Failed to load Pokémon data'
    };
  }
};

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, url }) => {
  const searchTerm = url.searchParams.get('search') || '';
  const selectedType = url.searchParams.get('type') || '';
  const loadedCount = Number(url.searchParams.get('loaded') ?? 0);
  const loadMore = url.searchParams.get('loadMore') === 'true';
  
  // Debug: log the URL and parameters
  console.log('DEBUG: Full URL:', url.toString());
  console.log('DEBUG: URL search params:', url.search);
  console.log('DEBUG: Raw type param:', url.searchParams.get('type'));
  console.log('DEBUG: All params:', Object.fromEntries(url.searchParams.entries()));
  console.log('DEBUG: Loaded count:', loadedCount, 'Load more:', loadMore);
  
  // Load 5 Pokemon at a time, max 50 total
  const increment = 5;
  const maxPokemon = 50;
  const currentlyLoaded = loadMore ? Math.min(loadedCount + increment, maxPokemon) : Math.min(Math.max(loadedCount, increment), maxPokemon);
  
  try {
    // Get the current host from the URL
    const host = url.origin;
    console.log('Host:', host);
    
    // For better search and type filtering, load more Pokemon when searching
    const searchLimit = (searchTerm || selectedType) ? 1000 : maxPokemon;
    
    console.log(`Loading Pokemon data - Currently loaded: ${currentlyLoaded}, Search limit: ${searchLimit}...`);
    
    // Load Pokemon for current batch or extended range for filtering
    const pokemonRes = await fetch(`${host}/api/pokemon?limit=${searchLimit}&offset=0`);
    console.log('Pokemon API response status:', pokemonRes.status);
    const pokemonData = await pokemonRes.json();
    console.log('Total Pokemon count:', pokemonData.count);
    console.log('Loading Pokemon batch size:', pokemonData.results.length);
    
    // Load detailed Pokemon data from local API routes
    console.log('Loading detailed Pokemon data...');
    const detailedPokemons = await Promise.all(
      pokemonData.results.map(async (poke: { name: string; url: string }) => {
        const id = poke.url.split('/').filter(Boolean).pop();
        console.log(`Fetching details for Pokemon ${id}...`);
        const detail = await fetch(`${host}/api/pokemon/${id}`).then((res) => res.json());
        
        return {
          id,
          name: poke.name,
          image: detail.sprites.front_default,
          types: detail.types.map((t: { type: { name: string } }) => t.type.name),
          stats: detail.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
            name: s.stat.name,
            value: s.base_stat
          })),
          abilities: detail.abilities.map((a: { ability: { name: string } }) => a.ability.name)
        };
      })
    );
    console.log('Detailed Pokemon loaded:', detailedPokemons.length);
    
    // Load Pokemon types from local API routes
    const typesRes = await fetch(`${host}/api/types`);
    const typesData = await typesRes.json();
    const types = typesData.results.map((type: { name: string }) => type.name);
    
    // Filter Pokemon based on search and type
    let filteredPokemons = detailedPokemons;
    
    // Apply search filter first
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      console.log(`Searching for: "${searchLower}"`);
      
      filteredPokemons = filteredPokemons.filter((p) => {
        const pokemonName = p.name.toLowerCase();
        // Simple search: check if Pokemon name contains the search term
        const matches = pokemonName.includes(searchLower);
        if (matches) {
          console.log(`Found match: ${p.name} contains "${searchLower}"`);
        }
        return matches;
      });
      console.log(`After search filter (${searchTerm}): ${filteredPokemons.length} Pokemon found`);
    }
    
    // Apply type filter - clean the selected type parameter
    if (selectedType && selectedType !== '' && selectedType.toLowerCase() !== 'all') {
      const cleanType = selectedType.toLowerCase().trim();
      filteredPokemons = filteredPokemons.filter((p) =>
        p.types.includes(cleanType)
      );
      console.log(`After type filter (${cleanType}): ${filteredPokemons.length} Pokemon`);
    }
    
    // Apply load more functionality to filtered results
    let finalPokemons = filteredPokemons;
    
    if (searchTerm || selectedType) {
      // For search/filter results, show only the currently loaded amount
      finalPokemons = filteredPokemons.slice(0, currentlyLoaded);
      console.log(`Load more results: showing first ${currentlyLoaded} of ${filteredPokemons.length}`);
    } else {
      // For normal browsing, show only the currently loaded amount
      finalPokemons = filteredPokemons.slice(0, currentlyLoaded);
      console.log(`Load more results: showing first ${currentlyLoaded} of ${filteredPokemons.length}`);
    }
    
    // Calculate if we can load more
    const canLoadMore = finalPokemons.length < Math.min(filteredPokemons.length, maxPokemon) && currentlyLoaded < maxPokemon;
    const remainingCount = Math.min(filteredPokemons.length, maxPokemon) - currentlyLoaded;
    
    console.log('Final result being returned:', {
      pokemonCount: finalPokemons.length,
      allPokemonCount: pokemonData.count,
      firstPokemon: finalPokemons[0]?.name || 'none',
      searchTerm,
      selectedType: selectedType || '',
      currentlyLoaded,
      canLoadMore,
      remainingCount
    });

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

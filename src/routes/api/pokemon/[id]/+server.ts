import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONFIG } from '$lib/config';
import { fetchWithRetry, createMockPokemon } from '$lib/utils/network';

export const GET: RequestHandler = async ({ params, request }) => {
  try {
    const { id } = params;
    
    // Validate Pokemon ID
    const pokemonId = parseInt(id || '0');
    if (isNaN(pokemonId) || pokemonId < 1 || pokemonId > 1010) {
      return json({ error: 'Invalid Pokemon ID' }, { status: 400 });
    }
    
    try {
      const response = await fetchWithRetry(
        `https://pokeapi.co/api/v2/pokemon/${id}`, 
        {
          retries: 3,
          delay: 1000,
          backoff: true,
          timeout: CONFIG.API_TIMEOUT
        }
      );
      
      const data = await response.json();
      
      // Validate response data
      if (!data || !data.id || !data.name) {
        throw new Error('Invalid response data from Pokemon API');
      }
      
      return json(data);
      
    } catch (fetchError) {
      console.error(`Pokemon detail API error for ID ${id}:`, fetchError);
      
      // Return comprehensive mock response as fallback
      const mockPokemon = createMockPokemon(pokemonId);
      
      console.log(`Returning mock data for Pokemon ${pokemonId} due to API error`);
      return json(mockPokemon, { 
        status: 200,
        headers: {
          'X-Fallback': 'true',
          'X-Error': 'API unavailable',
          'Cache-Control': 'public, max-age=60' // Cache for 1 minute
        }
      });
    }
    
  } catch (error) {
    console.error(`Unexpected error for Pokemon ID ${params.id}:`, error);
    
    const pokemonId = parseInt(params.id || '1');
    const mockPokemon = createMockPokemon(pokemonId);
    
    return json(mockPokemon, { 
      status: 200,
      headers: {
        'X-Fallback': 'true',
        'X-Error': 'Unexpected error'
      }
    });
  }
};

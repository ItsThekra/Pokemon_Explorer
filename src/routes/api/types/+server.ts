import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CONFIG } from '$lib/config';
import { fetchWithRetry } from '$lib/utils/network';

// Mock types data for fallback
const MOCK_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark',
  'steel', 'fairy'
];

export const GET: RequestHandler = async () => {
  try {
    // Proxy to PokéAPI for types with retry mechanism
    const response = await fetchWithRetry(
      'https://pokeapi.co/api/v2/type',
      {
        retries: 3,
        delay: 1000,
        backoff: true,
        timeout: CONFIG.API_TIMEOUT
      }
    );
    
    const data = await response.json();
    
    // Validate response data
    if (!data || !data.results) {
      throw new Error('Invalid response data from Pokemon API');
    }
    
    return json(data, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Source': 'pokemon-api'
      }
    });
    
  } catch (error) {
    console.error('Types API error:', error);
    
    // Return mock types as fallback
    const mockData = {
      count: MOCK_TYPES.length,
      next: null,
      previous: null,
      results: MOCK_TYPES.map(type => ({
        name: type,
        url: `https://pokeapi.co/api/v2/type/${type}/`
      }))
    };
    
    return json(mockData, { 
      status: 200,
      headers: {
        'X-Fallback': 'true',
        'X-Error': 'API unavailable',
        'Cache-Control': 'public, max-age=300' // Cache fallback for 5 minutes
      }
    });
  }
};

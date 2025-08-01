import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const limit = url.searchParams.get('limit') || '20';
    const offset = url.searchParams.get('offset') || '0';
    
    // Proxy to PokéAPI
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from PokéAPI');
    }
    
    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Pokemon API error:', error);
    return json(
      { error: 'Failed to fetch Pokemon data' },
      { status: 500 }
    );
  }
};

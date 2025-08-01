import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
  try {
    // Proxy to PokéAPI for types
    const response = await fetch('https://pokeapi.co/api/v2/type');
    
    if (!response.ok) {
      throw new Error('Failed to fetch types from PokéAPI');
    }
    
    const data = await response.json();
    return json(data);
  } catch (error) {
    console.error('Types API error:', error);
    return json(
      { error: 'Failed to fetch Pokemon types' },
      { status: 500 }
    );
  }
};

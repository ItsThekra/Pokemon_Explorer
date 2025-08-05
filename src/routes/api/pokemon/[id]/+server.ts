// This page is waiting for the params to featch Pokémon details
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon: ${response.status}`);
    }

    const data = await response.json();
    return json(data);

  } catch (error) {
    console.error('API: Error fetching Pokemon:', error);
    return json({ error: 'Failed to fetch Pokemon' }, { status: 500 });
  }
}

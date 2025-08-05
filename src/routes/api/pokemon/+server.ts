import { json } from '@sveltejs/kit';

export async function GET({ url }) 
{
  const limit = url.searchParams.get('limit') || '20';
  const offset = url.searchParams.get('offset') || '0';
  
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  return json(data);
}

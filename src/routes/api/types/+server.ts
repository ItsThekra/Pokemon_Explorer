import { json } from '@sveltejs/kit';

export async function GET() {
  
  const response = await fetch('https://pokeapi.co/api/v2/type');
  const data = await response.json();
  return json(data);
}

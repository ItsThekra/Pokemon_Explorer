import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const data = await response.json();
  return json(data);
}

import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch, url }) => {
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = Number(url.searchParams.get("limit") ?? 20);
  const res = await fetch(`/api/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();
  return { pokemons: data.results, next: data.next, previous: data.previous };
};
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  import type { PokemonDetails } from '$lib/types';

  let details: PokemonDetails | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    const id = $page.params.id;
    
    try {
      const res = await fetch(`/api/pokemon/${id}`);
      if (!res.ok) throw new Error('Failed to fetch Pokémon details');
      
      const pokemonData = await res.json();
      
      details = {
        id: pokemonData.id.toString(),
        name: pokemonData.name,
        image: pokemonData.sprites.front_default,
        types: pokemonData.types.map((t: { type: { name: string } }) => t.type.name),
        stats: pokemonData.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
          name: s.stat.name,
          value: s.base_stat
        })),
        abilities: pokemonData.abilities.map((a: { ability: { name: string } }) => a.ability.name),
        height: pokemonData.height,
        weight: pokemonData.weight,
        base_experience: pokemonData.base_experience
      };
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="min-h-screen bg-black text-white p-6">
  {#if loading}
    <div class="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  {:else if error}
    <div class="text-center">
      <h1 class="text-2xl font-bold text-red-400 mb-4">Error</h1>
      <p class="text-zinc-400">{error}</p>
      <a href="/" class="mt-4 inline-block text-blue-400 hover:text-blue-300">← Back to Pokémon list</a>
    </div>
  {:else if details}
    <div class="mx-auto max-w-2xl">
      <a href="/" class="mb-6 inline-block text-blue-400 hover:text-blue-300">← Back to Pokémon list</a>
      
      <div class="flex flex-col items-center">
        <img
          src={details.image}
          alt={details.name}
          class="mb-6 h-80 w-80 rounded object-contain"
        />

        <h1 class="mb-4 text-center text-4xl font-bold capitalize">
          {details.name}
          <span class="text-xl text-zinc-400">#{details.id}</span>
        </h1>

        <!-- Types -->
        <div class="mb-6 flex flex-wrap gap-2">
          {#each details.types as type}
            <span class="rounded-full bg-blue-600 px-3 py-1 text-sm font-medium capitalize">
              {type}
            </span>
          {/each}
        </div>

        <!-- Physical Stats -->
        <div class="mb-8 grid w-full max-w-md grid-cols-2 gap-4">
          <div class="rounded bg-zinc-800 p-4 text-center">
            <div class="text-2xl font-bold">{details.height / 10}m</div>
            <div class="text-sm text-zinc-400">Height</div>
          </div>
          <div class="rounded bg-zinc-800 p-4 text-center">
            <div class="text-2xl font-bold">{details.weight / 10}kg</div>
            <div class="text-sm text-zinc-400">Weight</div>
          </div>
        </div>

        <!-- Base Experience -->
        <div class="mb-8 w-full max-w-md rounded bg-zinc-800 p-4 text-center">
          <div class="text-2xl font-bold">{details.base_experience}</div>
          <div class="text-sm text-zinc-400">Base Experience</div>
        </div>

        <!-- Base Stats -->
        <div class="w-full max-w-md">
          <h2 class="mb-4 text-2xl font-semibold">Base Stats</h2>
          <div class="space-y-3">
            {#each details.stats as stat}
              <div>
                <div class="flex justify-between text-sm capitalize mb-1">
                  <span class="font-medium">{stat.name.replace('-', ' ')}</span>
                  <span class="font-bold">{stat.value}</span>
                </div>
                <div class="h-3 w-full rounded bg-zinc-700">
                  <div
                    class="h-3 rounded bg-gradient-to-r from-blue-500 to-purple-500"
                    style="width: {Math.min((stat.value / 255) * 100, 100)}%"
                  ></div>
                </div>
              </div>
            {/each}
          </div>
        </div>

        <!-- Abilities -->
        <div class="mt-8 w-full max-w-md">
          <h2 class="mb-4 text-2xl font-semibold">Abilities</h2>
          <div class="flex flex-wrap gap-2">
            {#each details.abilities as ability}
              <span class="rounded bg-zinc-800 px-4 py-2 text-sm font-medium capitalize">
                {ability.replace('-', ' ')}
              </span>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
<script lang="ts">
  import { onMount } from 'svelte';
  import Spinner from '$lib/components/Spinner.svelte';
  export let params: { id: string };

  interface PokemonDetails {
    name: string;
    sprites: { front_default: string };
    stats: { stat: { name: string }, base_stat: number }[];
    abilities: { ability: { name: string } }[];
    types: { type: { name: string } }[];
  }

  let details: PokemonDetails | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      const res = await fetch(`/api/pokemon/${params.id}`);
      if (!res.ok) throw new Error('Failed to fetch Pokémon details');
      details = await res.json();
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  });
</script>

<div class="p-4">
  {#if loading}
    <Spinner />
  {:else if error}
    <div class="text-red-500 text-center">{error}</div>
  {:else if details}
    <h1 class="text-3xl font-bold text-white">{details.name}</h1>
    <img src={details.sprites.front_default} alt={details.name} class="w-48 mx-auto" />
    <div class="text-white mt-4">
      <h2 class="text-xl">Types</h2>
      <ul>
        {#each details.types as typeObj}
          <li>{typeObj.type.name}</li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4">Base Stats</h2>
      <ul>
        {#each details.stats as stat}
          <li>{stat.stat.name}: {stat.base_stat}</li>
        {/each}
      </ul>
      <h2 class="text-xl mt-4">Abilities</h2>
      <ul>
        {#each details.abilities as abilityObj}
          <li>{abilityObj.ability.name}</li>
        {/each}
      </ul>
    </div>
  {/if}
</div>
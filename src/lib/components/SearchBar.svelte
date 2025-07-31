<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let search = '';

  function handleInput() {
    dispatch('search', search.trim().toLowerCase());
  }
</script>

<input
  type="text"
  placeholder="Search Pokémon..."
  bind:value={search}
  on:input={handleInput}
  class="w-full sm:w-90 px-4 py-2 rounded bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring focus:ring-purple-500"
/>
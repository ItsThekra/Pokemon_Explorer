<!-- Start Script -->
<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let poke: {
		id: string;
		name: string;
		image: string;
		types: string[];
	};

	function typeColor(type: string) {
		switch (type.toLowerCase()) {
			case 'fire':
				return 'bg-red-600';
			case 'water':
				return 'bg-blue-600';
			case 'grass':
				return 'bg-green-600';
			case 'electric':
				return 'bg-yellow-400 text-black';
			case 'poison':
				return 'bg-purple-700';
			case 'flying':
				return 'bg-indigo-500';
			case 'normal':
				return 'bg-zinc-700';
			case 'ground':
				return 'bg-amber-700';
			case 'psychic':
				return 'bg-pink-500';
			case 'ice':
				return 'bg-cyan-300 text-black';
			default:
				return 'bg-zinc-600';
		}
	}

	function handleClick() {
		dispatch('click', poke); // Send the clicked Pokémon data to the parent component
	}
</script>
<!-- Start Script -->

<!-- Start HTML -->
<button
	type="button"
	on:click={handleClick}
	class="flex w-full cursor-pointer items-center justify-between rounded-xl border border-zinc-800 px-4 py-5 text-left hover:bg-zinc-800"
>
	<div>
		<h2 class="font-medium text-white capitalize">{poke.name}</h2>
		<p class="text-xs text-zinc-400">#{poke.id}</p>
	</div>

	<div class="flex flex-wrap justify-end gap-2">
		{#each poke.types as t}
			<span class={`rounded-full px-2 py-1 text-xs capitalize ${typeColor(t)}`}>
				{t}
			</span>
		{/each}
	</div>
</button>
<!-- End HTML -->

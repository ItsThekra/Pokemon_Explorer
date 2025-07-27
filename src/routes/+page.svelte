<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Spinner from '$lib/components/Spinner.svelte';

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (!node.contains(event.target as Node)) {
				callback();
			}
		};
		document.addEventListener('mousedown', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('mousedown', handleClick, true);
			}
		};
	}

	type PokemonCard = {
		id: string;
		name: string;
		image: string;
		types: string[];
		stats?: { name: string; value: number }[];
		abilities?: string[];
	};

	let pokemons: PokemonCard[] = [];
	let loading = false;
	let error = '';
	let selectedPokemon: PokemonCard | null = null;

	let limit = 20;
	let offset = 0;

	let searchTerm = '';
	let selectedType: string = '';
	let types: string[] = [];

	$: filteredPokemons = pokemons.filter((p) => {
		return (
			p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
			(selectedType === '' || p.types.includes(selectedType))
		);
	});

	async function loadPokemons() {
		loading = true;
		error = '';
		try {
			const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
			const data = await res.json();
			const detailedPokemons = await Promise.all(
				data.results.map(async (poke: { name: string; url: string }) => {
					const id = poke.url.split('/').filter(Boolean).pop();
					const detail = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) =>
						res.json()
					);
					return {
						id,
						name: poke.name,
						image: detail.sprites.front_default,
						types: detail.types.map((t: { type: { name: string } }) => t.type.name),
						stats: detail.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
							name: s.stat.name,
							value: s.base_stat
						})),
						abilities: detail.abilities.map((a: { ability: { name: string } }) => a.ability.name)
					};
				})
			);
			pokemons = [...pokemons, ...detailedPokemons];
			offset += limit;
		} catch (e) {
			error = 'Failed to load Pokémon.';
		} finally {
			loading = false;
		}
	}

	async function loadTypes() {
		try {
			const res = await fetch('https://pokeapi.co/api/v2/type');
			const data = await res.json();
			types = data.results.map((type: { name: string }) => type.name);
		} catch (e) {
			error = 'Failed to load Pokémon types.';
		}
	}

	onMount(() => {
		loadPokemons();
		loadTypes();
	});
</script>

<div class="flex h-screen flex-col overflow-hidden bg-black text-white md:flex-row">
	<aside class="w-full border-b border-zinc-800 bg-zinc-900 p-4 md:w-64 md:border-r md:border-b-0">
		<h1 class="mt-3 mb-15 text-xl font-bold">Pokémon Explorer</h1>

		<h3 class="mt-6 mb-5 text-white">Filter by Type</h3>
		<select class="w-full rounded-md bg-zinc-800 p-2 text-white" bind:value={selectedType}>
			<option value="">All Types</option>
			{#each types as type}
				<option value={type}>{type}</option>
			{/each}
		</select>
	</aside>

	<main class="w-full overflow-y-auto border-r border-zinc-800 bg-zinc-950 p-4 md:w-[400px]">
		<SearchBar on:search={(e) => (searchTerm = e.detail)} />

		<div class="mt-4 h-[calc(100vh-120px)] space-y-2 overflow-y-auto pr-2">
			{#each filteredPokemons as poke}
				<Card {poke} on:click={() => (selectedPokemon = poke)} />
			{/each}

			{#if loading}
				<Spinner />
			{/if}

			{#if !loading && filteredPokemons.length === 0}
				<p class="mt-6 text-center text-zinc-400">No Pokémon found.</p>
			{/if}
		</div>
	</main>

	{#if selectedPokemon}
		<section
			class="fixed inset-0 z-50 overflow-y-auto rounded-none bg-zinc-950 p-6 transition-transform duration-300 md:static md:z-0 md:block md:flex-1 md:rounded-none"
			use:clickOutside={() => (selectedPokemon = null)}
		>
			<div class="mx-auto flex max-w-md flex-col items-center">
				<button
					on:click={() => (selectedPokemon = null)}
					class="mb-4 self-end text-2xl text-white hover:text-red-500 md:hidden">&times;</button
				>

				<img
					src={selectedPokemon.image}
					alt={selectedPokemon.name}
					class="mb-4 h-80 w-80 rounded object-contain"
				/>

				<h2 class="mb-2 text-center text-3xl font-bold capitalize">
					{selectedPokemon.name}
					<span class="text-lg text-zinc-400">#{selectedPokemon.id}</span>
				</h2>

				<h3 class="mt-6 mb-2 self-start text-xl font-semibold">Base Stats</h3>
				<div class="w-full space-y-2">
					{#each selectedPokemon.stats ?? [] as stat}
						{#if stat}
							<div>
								<div class="flex justify-between text-sm capitalize">
									<span>{(stat as { name: string; value: number }).name.replace('-', ' ')}</span>
									<span>{(stat as { name: string; value: number }).value}</span>
								</div>
								<div class="h-2 w-full rounded bg-zinc-700">
									<div
										class="h-2 rounded bg-blue-500"
										style="width: {Math.min((stat as { name: string; value: number }).value, 100)}%"
									></div>
								</div>
							</div>
						{/if}
					{/each}
				</div>

				<h3 class="mt-6 mb-2 self-start text-xl font-semibold">Abilities</h3>
				<div class="flex flex-wrap gap-2 self-start">
					{#each selectedPokemon.abilities ?? [] as ability}
						<span class="rounded bg-zinc-800 px-3 py-1 text-sm capitalize">
							{ability.replace('-', ' ')}
						</span>
					{/each}
				</div>
			</div>
		</section>
	{/if}

	{#if selectedPokemon === null}
		<p class="mt-30 ml-100 hidden text-center text-white md:block">
			Click on the Pokémon to explore features !
		</p>
	{/if}
</div>

<style>
	@media (max-width: 768px) {
		section {
			max-width: 100vw;
			max-height: 100vh;
			border-radius: 1rem;
			margin: 1rem;
			background-color: #0f0f0f;
			box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
		}
	}
</style>

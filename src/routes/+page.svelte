<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Card from '$lib/components/Card.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import type { PageData } from './$types';
	import type { PokemonCard, PokemonDetails } from '$lib/types';
	import { CONFIG } from '$lib/config';
	
	// Available shadcn/ui components only
	import { Button } from "$lib/components/ui/button/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Label } from "$lib/components/ui/label/index.js";

	let { data }: { data: PageData } = $props();

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

	let selectedPokemon = $state<PokemonDetails | null>(null);
	let loadingDetails = $state(false);
	let searchTerm = $state(data.searchTerm || '');
	let selectedTypeValue = $state(data.selectedType || '');
	let sidebarOpen = $state(false);
	
	// Load more state from server
	let currentlyLoaded = $state(data.currentlyLoaded || 5);
	let maxPokemon = $state(data.maxPokemon || 50);
	let canLoadMore = $state(data.canLoadMore || false);
	let remainingCount = $state(data.remainingCount || 0);

	// Use server-side data directly
	const pokemons = $derived(data.pokemons || []);

	// Update state when data changes
	$effect(() => {
		currentlyLoaded = data.currentlyLoaded || 5;
		maxPokemon = data.maxPokemon || 50;
		canLoadMore = data.canLoadMore || false;
		remainingCount = data.remainingCount || 0;
		
		// Sync search and filter state from server
		searchTerm = data.searchTerm || '';
		selectedTypeValue = data.selectedType || '';
		
		// Stop searching indicator when data arrives
		isSearching = false;
	});

	// Search handlers - simplified
	let searchTimeout: ReturnType<typeof setTimeout> | undefined;
	let isSearching = $state(false);
	
	function handleSearchInput(value: string) {
		searchTerm = value;
		isSearching = true;
		
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		// Quick debounce for better UX
		searchTimeout = setTimeout(() => {
			updateURL();
		}, CONFIG.DEBOUNCE_DELAY);
	}

	function handleSearch() {
		// Immediate search when Enter is pressed
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		isSearching = true;
		updateURL();
	}

	function handleTypeChange(value: string) {
		selectedTypeValue = value || '';
		isSearching = true;
		// Immediate filter change
		updateURL();
	}

	function clearSearch() {
		searchTerm = '';
		isSearching = true;
		updateURL();
	}

	function resetFilters() {
		searchTerm = '';
		selectedTypeValue = '';
		isSearching = true;
		updateURL();
	}

	// Update URL to trigger server reload - simplified
	function updateURL() {
		const params = new URLSearchParams();
		
		// Add search if exists
		if (searchTerm && searchTerm.trim().length > 0) {
			params.set('search', searchTerm.trim());
		}
		
		// Add type filter if exists  
		if (selectedTypeValue && selectedTypeValue !== '' && selectedTypeValue !== 'all') {
			params.set('type', selectedTypeValue.trim());
		}
		
		// Always reset to 5 Pokemon when searching or filtering
		params.set('loaded', CONFIG.POKEMON_PER_PAGE.toString());
		
		const newURL = `${window.location.pathname}?${params.toString()}`;
		goto(newURL, { replaceState: false, noScroll: true });
	}

	// Load more functions
	function loadMorePokemon() {
		if (canLoadMore) {
			const url = new URL(window.location.href);
			url.searchParams.set('loaded', currentlyLoaded.toString());
			url.searchParams.set('loadMore', 'true');
			goto(url.toString());
		}
	}

	async function selectPokemon(pokemon: PokemonCard) {
		sidebarOpen = false;
		
		loadingDetails = true;
		try {
			// Use local API route that proxies to PokéAPI
			const res = await fetch(`/api/pokemon/${pokemon.id}`);
			const details = await res.json();
			
			selectedPokemon = {
				id: pokemon.id,
				name: details.name,
				image: details.sprites.front_default,
				types: details.types.map((t: { type: { name: string } }) => t.type.name),
				stats: details.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
					name: s.stat.name,
					value: s.base_stat
				})),
				abilities: details.abilities.map((a: { ability: { name: string } }) => a.ability.name),
				height: details.height,
				weight: details.weight,
				base_experience: details.base_experience
			};
		} catch (error) {
			console.error('Failed to load Pokemon details:', error);
		} finally {
			loadingDetails = false;
		}
	}

	function closePokemonDetails() {
		selectedPokemon = null;
	}

	function toggleSidebar() {
		sidebarOpen = !sidebarOpen;
	}

	// Cleanup timeout on component destroy
	$effect(() => {
		return () => {
			if (searchTimeout) {
				clearTimeout(searchTimeout);
			}
		};
	});
</script>

<div class="flex flex-col lg:flex-row h-screen overflow-hidden bg-background text-foreground">
	<!-- Mobile Header -->
	<div class="lg:hidden bg-card border-b border-border p-3 flex items-center justify-between">
		<h1 class="text-lg font-bold text-primary">{CONFIG.APP_NAME}</h1>
		<button
			onclick={toggleSidebar}
			class="p-2 hover:bg-muted rounded-md transition-colors"
			aria-label="Toggle menu"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
			</svg>
		</button>
	</div>

	<!-- Sidebar -->
	<aside class="
		{sidebarOpen ? 'fixed inset-0 z-40' : 'hidden'} lg:relative lg:block 
		w-full lg:w-80 xl:w-96 bg-card border-r border-border lg:p-3 xl:p-6 flex flex-col
	">
		<!-- Mobile Backdrop -->
		{#if sidebarOpen}
			<div 
				class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm"
				onclick={() => sidebarOpen = false}
				role="button"
				tabindex="0"
				aria-label="Close sidebar"
				onkeydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
			></div>
		{/if}
		
		<!-- Sidebar Content -->
		<div class="relative bg-card p-3 lg:p-0 lg:flex-1 lg:space-y-4 xl:space-y-6 h-full lg:h-auto overflow-y-auto">
			<!-- Mobile Close Button -->
			<div class="lg:hidden flex items-center justify-between mb-4 pb-3 border-b border-border">
				<h1 class="text-xl font-bold text-primary">{CONFIG.APP_NAME}</h1>
				<button
					onclick={() => sidebarOpen = false}
					class="p-2 hover:bg-muted rounded-md transition-colors"
					aria-label="Close sidebar"
				>
					<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
					</svg>
				</button>
			</div>

			<div class="hidden lg:block text-center">
				<h1 class="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-2">{CONFIG.APP_NAME}</h1>
				<p class="text-xs lg:text-sm text-muted-foreground">{CONFIG.APP_DESCRIPTION}</p>
			</div>

		<!-- Search and Filters -->
		<div class="space-y-3 lg:space-y-4">
			<h3 class="text-base lg:text-lg font-semibold text-primary mb-2 lg:mb-3">Search & Filter</h3>

			<!-- Search Bar -->
			<div class="space-y-2">
				<Label for="search" class="text-sm font-medium">Search Pokémon</Label>
				<div class="relative">
					<SearchBar 
						id="search"
						placeholder="Search by name or ID..."
						value={searchTerm}
						oninput={(e) => handleSearchInput((e.target as HTMLInputElement)?.value || '')}
						onsubmit={handleSearch}
						class="w-full h-9 pl-9 pr-9 text-sm {searchTerm ? 'ring-2 ring-primary ring-offset-2' : ''}"
					/>
					<svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
					</svg>
					{#if searchTerm}
						<button
							onclick={clearSearch}
							class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground hover:text-destructive transition-colors"
						>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
							</svg>
						</button>
					{/if}
				</div>
				{#if isSearching}
					<div class="flex items-center space-x-2 text-xs text-muted-foreground">
						<div class="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
						<span>Searching...</span>
					</div>
				{/if}
			</div>

			<!-- Type Filter -->
			<div class="space-y-2">
				<Label for="type-filter" class="text-sm font-medium">Filter by Type</Label>
				<select
					id="type-filter"
					bind:value={selectedTypeValue}
					oninput={(e) => handleTypeChange((e.target as HTMLSelectElement)?.value || '')}
					class="w-full h-9 rounded-md border border-input bg-card text-card-foreground px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-card focus:text-card-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {selectedTypeValue ? 'ring-2 ring-primary ring-offset-2' : ''}"
				>
					<option value="" class="bg-card text-card-foreground">All Types</option>
					{#each data.types || [] as type}
						<option value={type} class="capitalize bg-card text-card-foreground hover:bg-accent">{type}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Reset Filters Button -->
		{#if searchTerm || selectedTypeValue}
			<div class="pt-2">
				<button
					onclick={resetFilters}
					class="w-full px-3 py-2 text-sm bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md transition-colors flex items-center justify-center space-x-2"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
					</svg>
					<span>Reset {selectedTypeValue ? 'Type Filter' : 'Search'}</span>
				</button>
			</div>
		{/if}			{#if data.error}
				<div class="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
					<p class="text-sm text-destructive">{data.error}</p>
				</div>
			{/if}

			<!-- Bottom Count Display -->
			<div class="pt-4 border-t border-border">
				<div class="flex items-center justify-between text-sm text-muted-foreground">
					<div class="flex items-center space-x-2">
						<div class="w-3 h-3 bg-green-500 rounded-full"></div>
						<span>Pokemon Explorer</span>
						{#if searchTerm}
							<span class="text-xs bg-blue-500/10 text-blue-600 px-2 py-1 rounded">
								Search: "{searchTerm}"
							</span>
						{/if}
						<!-- {#if selectedTypeValue && selectedTypeValue !== ''}
							<span class="text-xs bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-full">
								🏷️ {selectedTypeValue} type
							</span>
						{/if} -->
					</div>
					<span class="font-mono text-xs">
						{pokemons.length}
						{#if searchTerm}
							search results
						{:else if selectedTypeValue && selectedTypeValue !== ''}
							{selectedTypeValue}-type Pokémon
						{:else if data.filteredCount && data.filteredCount !== data.totalCount}
							of {data.filteredCount} filtered
						{:else}
							of {data.totalCount || 0}
						{/if}
					</span>
				</div>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 bg-background overflow-hidden">
		<div class="h-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none">
			<div class="p-3 lg:p-4">
				<!-- Pokemon List/Column -->
				<div class="space-y-3 max-w-2xl">
					{#each pokemons as poke}
						<Card {poke} onclick={() => selectPokemon(poke)} />
					{/each}
				</div>

				{#if pokemons.length === 0 && !data.error}
					<div class="text-center py-12">
						<div class="text-muted-foreground mb-4">
							<svg class="w-12 h-12 lg:w-16 lg:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
							</svg>
						</div>
						<h3 class="text-base sm:text-lg font-semibold mb-2">No Pokémon found</h3>
						<p class="text-muted-foreground text-xs sm:text-sm lg:text-base">Try adjusting your search or filter criteria.</p>
					</div>
				{/if}

				<!-- Pagination Controls -->
				<div class="pt-6 pb-4 max-w-2xl">
					<div class="flex flex-col items-center space-y-4 mb-4">
						{#if canLoadMore && pokemons.length > 0}
							<Button 
								variant="default" 
								size="lg"
								onclick={loadMorePokemon}
								class="px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold"
							>
								Load More ({remainingCount} Remaining)
								<svg class="w-4 h-4 sm:w-5 sm:h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
								</svg>
							</Button>
						{:else if currentlyLoaded >= maxPokemon && pokemons.length > 0}
							<div class="text-center py-4">
								<Badge variant="secondary" class="text-sm sm:text-lg px-4 sm:px-6 py-1 sm:py-2">
									🎉 All Pokemon Downloaded ({maxPokemon}/{maxPokemon})
								</Badge>
							</div>
						{/if}
					</div>
					
					{#if pokemons.length > 0}
						<p class="text-xs sm:text-sm text-muted-foreground text-center">
							Showing {pokemons.length} of {data.filteredCount || data.totalCount || 1302} Pokemon
						</p>
					{/if}
				</div>
			</div>
		</div>
	</main>

	<!-- Pokemon Details Panel -->
	{#if selectedPokemon}
		<aside class="fixed inset-0 lg:relative lg:w-96 xl:w-[500px] lg:border-l border-border bg-card z-50 lg:z-auto">
			{#if loadingDetails}
				<div class="flex justify-center items-center h-full">
					<Spinner />
				</div>
			{:else}
				{@const totalStats = selectedPokemon.stats.reduce((sum, stat) => sum + stat.value, 0)}
				<div class="h-full flex flex-col">
					<!-- Header with close button -->
					<div class="p-3 sm:p-4 md:p-6 border-b border-border bg-gradient-to-r from-card to-muted/20">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="text-base sm:text-lg md:text-xl font-bold text-primary">Pokémon Details</h2>
								<p class="text-xs sm:text-sm text-muted-foreground">Tap to explore stats</p>
							</div>
							<Button 
								variant="ghost" 
								size="icon" 
								onclick={closePokemonDetails} 
								class="w-8 h-8 sm:w-10 sm:h-10 hover:bg-destructive/10 hover:text-destructive"
							>
								<svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m6 6 12 12M6 18 18 6"/>
								</svg>
							</Button>
						</div>
					</div>

					<div class="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-none">
						<div class="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
							<!-- Pokemon Image -->
							<div class="text-center">
								<div class="relative inline-block">
									<div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl sm:rounded-2xl blur-lg sm:blur-xl"></div>
									<img
										src={selectedPokemon.image}
										alt={selectedPokemon.name}
										class="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 mx-auto object-contain rounded-xl sm:rounded-2xl bg-gradient-to-br from-card to-muted/30 p-3 sm:p-4 shadow-lg border"
									/>
								</div>
								<h2 class="text-xl sm:text-2xl font-bold capitalize mt-3 sm:mt-4 text-primary">
									{selectedPokemon.name}
								</h2>
								<p class="text-muted-foreground text-xs sm:text-sm">#{selectedPokemon.id.toString().padStart(3, '0')}</p>
							</div>

							<!-- Pokemon Types -->
							{#if selectedPokemon.types.length > 0}
								<div class="bg-gradient-to-r from-muted/20 to-card p-3 sm:p-4 rounded-xl border">
									<h3 class="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-center text-primary">Pokémon Type</h3>
									<div class="flex gap-2 sm:gap-3 justify-center flex-wrap">
										{#each selectedPokemon.types as type}
											<div class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold capitalize bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/20 shadow-sm">
												{type}
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Base Stats with Modern Design -->
							{#if selectedPokemon.stats.length > 0}
								<div class="bg-gradient-to-br from-accent/10 to-muted/30 p-3 sm:p-4 rounded-xl border">
									<h3 class="text-sm sm:text-base font-bold mb-3 sm:mb-4 text-center text-primary">Base Stats (Total: {totalStats})</h3>
									<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
										{#each selectedPokemon.stats as stat}
											{@const percentage = (stat.value / 255) * 100}
											{@const statColor = stat.value > 100 ? 'bg-green-500' : stat.value > 70 ? 'bg-yellow-500' : 'bg-red-500'}
											<div class="bg-card/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
												<div class="flex justify-between items-center mb-2">
													<span class="text-xs sm:text-sm font-medium capitalize text-foreground">
														{stat.name.replace('-', ' ')}
													</span>
													<span class="text-sm sm:text-base font-bold text-primary">{stat.value}</span>
												</div>
												<div class="w-full bg-muted/60 rounded-full h-2 sm:h-2.5 overflow-hidden">
													<div 
														class="{statColor} h-full rounded-full transition-all duration-500 ease-out shadow-sm"
														style="width: {percentage}%"
													></div>
												</div>
											</div>
										{/each}
									</div>
								</div>
							{/if}

							<!-- Abilities -->
							{#if selectedPokemon.abilities.length > 0}
								<div class="bg-gradient-to-br from-card/50 to-accent/20 p-3 sm:p-4 rounded-xl border">
									<h3 class="text-sm sm:text-base font-bold mb-2 sm:mb-3 text-center text-primary">Special Abilities</h3>
									<div class="space-y-2 sm:space-y-3">
										{#each selectedPokemon.abilities as ability}
											<div class="text-xs sm:text-sm capitalize bg-background/80 border border-border/50 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center font-medium hover:border-primary/30 transition-colors">
												✨ {ability.replace('-', ' ')}
											</div>
										{/each}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</aside>
	{/if}
</div>

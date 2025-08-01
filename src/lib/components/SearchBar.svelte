<script lang="ts">
	let { 
		value, 
		oninput, 
		onsubmit, 
		placeholder = "Search Pokémon...", 
		id = "search-input",
		class: className = ""
	}: {
		value: string;
		oninput?: (event: Event) => void;
		onsubmit?: () => void;
		placeholder?: string;
		id?: string;
		class?: string;
	} = $props();

	function handleInput(event: Event) {
		if (oninput) {
			oninput(event);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && onsubmit) {
			onsubmit();
		}
	}

	// Handle clear functionality
	function clearSearch() {
		const inputElement = document.getElementById(id) as HTMLInputElement;
		if (inputElement) {
			inputElement.value = '';
			const event = new Event('input', { bubbles: true });
			inputElement.dispatchEvent(event);
			if (oninput) {
				oninput(event);
			}
		}
	}
</script>

<div class="relative">
	<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
		<svg 
			class="w-5 h-5 text-muted-foreground" 
			fill="none" 
			stroke="currentColor" 
			viewBox="0 0 24 24"
		>
			<path 
				stroke-linecap="round" 
				stroke-linejoin="round" 
				stroke-width="2" 
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	</div>
	<input
		{id}
		type="text"
		{placeholder}
		{value}
		oninput={handleInput}
		onkeydown={handleKeydown}
		class="pl-10 pr-10 w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 {className}"
	/>
	
	<!-- Clear button -->
	{#if value && value.length > 0}
		<button
			type="button"
			onclick={clearSearch}
			aria-label="Clear search"
			class="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-foreground transition-colors"
		>
			<svg class="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
			</svg>
		</button>
	{/if}
</div>
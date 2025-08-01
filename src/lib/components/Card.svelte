<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";

	let { poke, onclick }: {
		poke: {
			id: string;
			name: string;
			image: string;
			types: string[];
		};
		onclick?: () => void;
	} = $props();

	function handleClick() {
		onclick?.();
	}

	// Enhanced type colors with gradients for better visual appeal
	const typeColors: Record<string, string> = {
		normal: "bg-gradient-to-r from-gray-400 to-gray-500",
		fire: "bg-gradient-to-r from-red-500 to-orange-500",
		water: "bg-gradient-to-r from-blue-500 to-blue-600",
		electric: "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black",
		grass: "bg-gradient-to-r from-green-500 to-green-600",
		ice: "bg-gradient-to-r from-cyan-300 to-cyan-400 text-black",
		fighting: "bg-gradient-to-r from-red-700 to-red-800",
		poison: "bg-gradient-to-r from-purple-500 to-purple-600",
		ground: "bg-gradient-to-r from-yellow-600 to-amber-600",
		flying: "bg-gradient-to-r from-indigo-400 to-indigo-500",
		psychic: "bg-gradient-to-r from-pink-500 to-pink-600",
		bug: "bg-gradient-to-r from-green-400 to-green-500",
		rock: "bg-gradient-to-r from-yellow-800 to-amber-800",
		ghost: "bg-gradient-to-r from-purple-700 to-purple-800",
		dragon: "bg-gradient-to-r from-indigo-700 to-purple-700",
		dark: "bg-gradient-to-r from-gray-800 to-gray-900",
		steel: "bg-gradient-to-r from-gray-500 to-gray-600",
		fairy: "bg-gradient-to-r from-pink-300 to-pink-400 text-black"
	};
</script>

<Card.Root 
	class="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border border-border/50 bg-gradient-to-r from-card to-card/80 hover:border-primary/40 overflow-hidden rounded-xl"
	onclick={handleClick}
>
	<Card.Content class="p-3 sm:p-4">
		<div class="flex items-center space-x-3 sm:space-x-4">
			<!-- Pokemon Image Container -->
			<div class="relative flex-shrink-0">
				<div class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-muted/30 to-muted/60 rounded-2xl flex items-center justify-center shadow-inner border border-border/30">
					<img
						src={poke.image}
						alt={poke.name}
						class="w-10 h-10 sm:w-14 sm:h-14 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
						loading="lazy"
					/>
				</div>
				<!-- Pokemon Number Badge -->
				<div class="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full shadow-lg border border-primary/20 min-w-[24px] sm:min-w-[28px] text-center">
					#{poke.id.padStart(3, '0')}
				</div>
			</div>
			
			<!-- Pokemon Info -->
			<div class="flex-1 min-w-0">
				<!-- Pokemon Name -->
				<h3 class="text-base sm:text-lg font-bold capitalize text-foreground group-hover:text-primary transition-colors mb-1 sm:mb-2 truncate tracking-wide">
					{poke.name}
				</h3>
				
				<!-- Pokemon Types -->
				<div class="flex gap-1 sm:gap-2 flex-wrap">
					{#each poke.types as type}
						<Badge 
							variant="secondary" 
							class="text-xs {typeColors[type] || 'bg-muted'} text-white border-0 font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full capitalize shadow-sm hover:shadow-md transition-shadow"
						>
							{type}
						</Badge>
					{/each}
				</div>
			</div>

			<!-- Hover Arrow -->
			<div class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
				<div class="w-8 h-8 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center">
					<svg class="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
					</svg>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
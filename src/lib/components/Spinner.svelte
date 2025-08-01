<script lang="ts">
	import { Skeleton } from "$lib/components/ui/skeleton/index.js";

	let { type = "loading" }: { type?: "loading" | "card" } = $props();
</script>

{#if type === "card"}
	<!-- Pokemon card skeleton -->
	<div class="flex items-center space-x-4 p-4 border rounded-lg">
		<Skeleton class="h-16 w-16 rounded-lg" />
		<div class="space-y-2 flex-1">
			<Skeleton class="h-4 w-24" />
			<div class="flex gap-2">
				<Skeleton class="h-6 w-16" />
				<Skeleton class="h-6 w-16" />
			</div>
		</div>
		<Skeleton class="h-5 w-5" />
	</div>
{:else}
	<!-- Loading spinner -->
	<div class="flex justify-center items-center p-8">
		<div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
	</div>
{/if}
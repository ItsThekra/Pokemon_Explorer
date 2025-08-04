<script lang="ts">
	import '../app.css';

	let { children } = $props();
	
	$effect(() => {
		try {
			// Force CSS to load
			document.documentElement.style.setProperty('--test', '1');
		} catch (e) {
			console.warn('CSS loading issue:', e);
		}
	});
</script>

{@render children()}

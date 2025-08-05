<script lang="ts">
	import '../app.css';

	let { children } = $props();
	
	$effect(() => {
		try {
			document.documentElement.style.setProperty('--test', '1');
		} catch (e) {
			console.warn('CSS loading issue:', e);
		}
	});
</script>

{@render children()}

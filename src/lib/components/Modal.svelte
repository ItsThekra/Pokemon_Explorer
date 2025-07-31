<script lang="ts">
  export let open = false;
  export let onClose: () => void;
</script>

{#if open}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div class="bg-white rounded p-6 shadow-lg">
      <slot />
      <button class="mt-4 p-2 bg-blue-500 rounded" on:click={onClose}>Close</button>
    </div>
  </div>
{/if}
<script>
	import { theme } from '$lib/stores/theme.js';
	import { onMount } from 'svelte';

	onMount(() => {
		theme.init();
	});

	function handleToggle() {
		theme.toggle();
	}
</script>

<button
	on:click={handleToggle}
	class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
	aria-label="Toggle theme"
	title="Toggle theme"
>
	{#if $theme === 'light'}
		<!-- Moon icon for dark mode -->
		<svg
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			></path>
		</svg>
	{:else}
		<!-- Sun icon for light mode -->
		<svg
			class="h-5 w-5"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			></path>
		</svg>
	{/if}
</button>

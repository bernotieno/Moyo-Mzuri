<script>
	import '../app.css';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { page } from '$app/stores';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	let { children } = $props();

	const isAdminRoute = $derived($page.url.pathname.startsWith('/admin'));
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
	{#if !isAdminRoute}
		<!-- Main App Header -->
		<header class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<!-- Logo/Brand -->
					<div class="flex items-center">
						<a href="/" class="flex items-center space-x-2">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
								<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
								</svg>
							</div>
							<span class="text-xl font-bold text-gray-900 dark:text-white">
								{PUBLIC_APP_NAME || 'Moyo Mzuri'}
							</span>
						</a>
					</div>

					<!-- Navigation -->
					<nav class="hidden md:flex items-center space-x-8">
						<a
							href="/"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							class:text-blue-600={$page.url.pathname === '/'}
							class:dark:text-blue-400={$page.url.pathname === '/'}
						>
							Projects
						</a>
					</nav>

					<!-- Theme Toggle -->
					<div class="flex items-center">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</header>
	{/if}

	<!-- Main Content -->
	<main class="flex-1">
		{@render children()}
	</main>

	{#if !isAdminRoute}
		<!-- Footer -->
		<footer class="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
				<div class="text-center">
					<p class="text-gray-600 dark:text-gray-400">
						© 2024 {PUBLIC_APP_NAME || 'Moyo Mzuri'}. Supporting social projects in our community.
					</p>
				</div>
			</div>
		</footer>
	{/if}
</div>

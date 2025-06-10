<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let { children, data } = $props();

	async function handleLogout() {
		try {
			const response = await fetch('/admin/logout', {
				method: 'POST'
			});

			if (response.ok) {
				goto('/admin/login');
			}
		} catch (error) {
			console.error('Logout error:', error);
		}
	}

	const currentPath = $derived($page.url.pathname);
</script>

{#if data.isAuthenticated}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		<!-- Admin Header -->
		<header class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex h-16 items-center justify-between">
					<!-- Logo/Brand -->
					<div class="flex items-center">
						<a href="/admin" class="flex items-center space-x-2">
							<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
								<svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
								</svg>
							</div>
							<span class="text-xl font-bold text-gray-900 dark:text-white">
								Admin Dashboard
							</span>
						</a>
					</div>

					<!-- Navigation -->
					<nav class="hidden md:flex items-center space-x-8">
						<a
							href="/admin"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							class:text-red-600={currentPath === '/admin'}
							class:dark:text-red-400={currentPath === '/admin'}
						>
							Dashboard
						</a>
						<a
							href="/admin/projects"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							class:text-red-600={currentPath === '/admin/projects'}
							class:dark:text-red-400={currentPath === '/admin/projects'}
						>
							Projects
						</a>
						<a
							href="/admin/donations"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							class:text-red-600={currentPath === '/admin/donations'}
							class:dark:text-red-400={currentPath === '/admin/donations'}
						>
							Donations
						</a>
					</nav>

					<!-- Actions -->
					<div class="flex items-center space-x-4">
						<a
							href="/"
							class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
							title="View Public Site"
						>
							<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
							</svg>
						</a>
						<ThemeToggle />
						<button
							on:click={handleLogout}
							class="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
						>
							Logout
						</button>
					</div>
				</div>
			</div>
		</header>

		<!-- Mobile Navigation -->
		<nav class="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 md:hidden">
			<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div class="flex space-x-8 py-4">
					<a
						href="/admin"
						class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
						class:text-red-600={currentPath === '/admin'}
						class:dark:text-red-400={currentPath === '/admin'}
					>
						Dashboard
					</a>
					<a
						href="/admin/projects"
						class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
						class:text-red-600={currentPath === '/admin/projects'}
						class:dark:text-red-400={currentPath === '/admin/projects'}
					>
						Projects
					</a>
					<a
						href="/admin/donations"
						class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
						class:text-red-600={currentPath === '/admin/donations'}
						class:dark:text-red-400={currentPath === '/admin/donations'}
					>
						Donations
					</a>
				</div>
			</div>
		</nav>

		<!-- Main Content -->
		<main class="py-8">
			{@render children()}
		</main>
	</div>
{:else}
	<!-- Login Layout -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
		{@render children()}
	</div>
{/if}

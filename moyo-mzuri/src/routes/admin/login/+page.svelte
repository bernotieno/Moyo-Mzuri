<script>
	import { goto } from '$app/navigation';
	import { validateAdminPassword } from '$lib/utils/validation.js';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';

	let password = '';
	let isLoading = false;
	let error = '';

	async function handleSubmit() {
		error = '';
		
		const validation = validateAdminPassword(password);
		if (!validation.isValid) {
			error = validation.message;
			return;
		}

		isLoading = true;

		try {
			const response = await fetch('/admin/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ password })
			});

			const result = await response.json();

			if (result.success) {
				goto('/admin');
			} else {
				error = result.error || 'Invalid password';
			}
		} catch (err) {
			console.error('Login error:', err);
			error = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login - Moyo Mzuri</title>
</svelte:head>

<div class="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<!-- Header -->
		<div class="text-center">
			<div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
				<svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
				</svg>
			</div>
			<h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
				Admin Login
			</h2>
			<p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
				Enter your password to access the admin dashboard
			</p>
		</div>

		<!-- Login Form -->
		<form on:submit|preventDefault={handleSubmit} class="mt-8 space-y-6">
			<div>
				<label for="password" class="sr-only">Password</label>
				<input
					id="password"
					type="password"
					bind:value={password}
					placeholder="Admin password"
					required
					class="relative block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
					class:border-red-500={error}
					class:dark:border-red-500={error}
					disabled={isLoading}
				/>
			</div>

			{#if error}
				<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
					<div class="flex">
						<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
						<div class="ml-3">
							<p class="text-sm text-red-800 dark:text-red-200">{error}</p>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="group relative flex w-full justify-center rounded-lg bg-red-600 px-3 py-3 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900"
				>
					{#if isLoading}
						<LoadingSpinner size="sm" color="white" text="Signing in..." />
					{:else}
						Sign in
					{/if}
				</button>
			</div>

			<div class="flex items-center justify-between">
				<a
					href="/"
					class="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
				>
					← Back to public site
				</a>
				<ThemeToggle />
			</div>
		</form>
	</div>
</div>

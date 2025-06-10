<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import DonationModal from '$lib/components/DonationModal.svelte';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
	import { PUBLIC_APP_NAME, PUBLIC_APP_DESCRIPTION } from '$env/static/public';

	let { data } = $props();

	let selectedProject = $state(null);
	let isDonationModalOpen = $state(false);

	function handleDonate(event) {
		selectedProject = event.detail.project;
		isDonationModalOpen = true;
	}

	function handleDonationInitiated(event) {
		// Optionally refresh projects data or show success message
		console.log('Donation initiated:', event.detail);
		// You could invalidate the data here to refresh the project totals
	}
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME || 'Moyo Mzuri'} - Supporting Social Projects</title>
	<meta name="description" content={PUBLIC_APP_DESCRIPTION || 'Supporting social projects in our community'} />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
				Support Social Projects
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
				{PUBLIC_APP_DESCRIPTION || 'Make a difference in your community by supporting meaningful social projects. Every donation counts.'}
			</p>
		</div>
	</div>
</section>

<!-- Projects Section -->
<section class="py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		{#if data.error}
			<!-- Error State -->
			<div class="text-center py-12">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
					<svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Projects</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-4">{data.error}</p>
				<button
					onclick={() => window.location.reload()}
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Try Again
				</button>
			</div>
		{:else if data.projects.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Projects Available</h3>
				<p class="text-gray-600 dark:text-gray-400">
					There are currently no active projects seeking donations. Check back soon!
				</p>
			</div>
		{:else}
			<!-- Projects Grid -->
			<div class="mb-8">
				<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Active Projects</h2>
				<p class="text-gray-600 dark:text-gray-400">
					Choose a project to support and make a difference in your community.
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.projects as project (project.id)}
					<ProjectCard {project} on:donate={handleDonate} />
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Donation Modal -->
<DonationModal
	project={selectedProject}
	bind:isOpen={isDonationModalOpen}
	on:donation-initiated={handleDonationInitiated}
/>

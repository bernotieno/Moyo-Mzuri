<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import DonationModal from '$lib/components/DonationModal.svelte';
	import { PUBLIC_APP_NAME } from '$env/static/public';

	let { data } = $props();

	let selectedProject = $state(null);
	let isDonationModalOpen = $state(false);
	let searchQuery = $state('');
	let sortBy = $state('newest'); // newest, oldest, target-high, target-low, progress-high, progress-low

	// Filter and sort projects
	const filteredProjects = $derived(data.projects
		.filter(project =>
			project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.description.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			switch (sortBy) {
				case 'oldest':
					return new Date(a.createdAt) - new Date(b.createdAt);
				case 'target-high':
					return b.targetAmount - a.targetAmount;
				case 'target-low':
					return a.targetAmount - b.targetAmount;
				case 'progress-high':
					return (b.totalRaised / b.targetAmount) - (a.totalRaised / a.targetAmount);
				case 'progress-low':
					return (a.totalRaised / a.targetAmount) - (b.totalRaised / b.targetAmount);
				case 'newest':
				default:
					return new Date(b.createdAt) - new Date(a.createdAt);
			}
		}));

	function handleDonate(event) {
		selectedProject = event.detail.project;
		isDonationModalOpen = true;
	}

	function handleDonationInitiated(event) {
		console.log('Donation initiated:', event.detail);
	}

	function clearSearch() {
		searchQuery = '';
	}
</script>

<svelte:head>
	<title>Projects - {PUBLIC_APP_NAME || 'Moyo Mzuri'}</title>
	<meta name="description" content="Browse all active social projects seeking donations. Find a cause you care about and make a difference." />
</svelte:head>

<!-- Page Header -->
<section class="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 py-16">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-6">
				All Projects
			</h1>
			<p class="mx-auto max-w-3xl text-xl text-gray-600 dark:text-gray-300">
				Discover all the amazing social projects that are making a difference in communities across Kenya. 
				Choose a project that resonates with you and help them reach their goals.
			</p>
		</div>
	</div>
</section>

<!-- Search and Filter Section -->
<section class="py-8 bg-white dark:bg-blue-950 border-b border-blue-200 dark:border-blue-700">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col md:flex-row gap-4 items-center justify-between">
			<!-- Search Bar -->
			<div class="relative flex-1 max-w-md">
				<div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search projects..."
					class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white dark:bg-gray-800 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
				{#if searchQuery}
					<button
						onclick={clearSearch}
						class="absolute inset-y-0 right-0 pr-3 flex items-center"
					>
						<svg class="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				{/if}
			</div>

			<!-- Sort Dropdown -->
			<div class="flex items-center space-x-4">
				<label for="sort" class="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
				<select
					id="sort"
					bind:value={sortBy}
					class="block w-48 px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="target-high">Highest Target</option>
					<option value="target-low">Lowest Target</option>
					<option value="progress-high">Most Progress</option>
					<option value="progress-low">Least Progress</option>
				</select>
			</div>
		</div>

		<!-- Results Count -->
		<div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
			{#if searchQuery}
				Showing {filteredProjects.length} of {data.projects.length} projects for "{searchQuery}"
			{:else}
				Showing all {filteredProjects.length} projects
			{/if}
		</div>
	</div>
</section>

<!-- Projects Section -->
<section class="py-16 bg-blue-50 dark:bg-blue-900">
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
		{:else if filteredProjects.length === 0 && searchQuery}
			<!-- No Search Results -->
			<div class="text-center py-12">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
					<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
					</svg>
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Projects Found</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-4">
					No projects match your search for "{searchQuery}". Try different keywords.
				</p>
				<button
					onclick={clearSearch}
					class="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Clear Search
				</button>
			</div>
		{:else if data.projects.length === 0}
			<!-- Empty State -->
			<div class="text-center py-12">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
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
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each filteredProjects as project (project.id)}
					<div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1">
						<ProjectCard {project} on:donate={handleDonate} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Call to Action Section -->
{#if filteredProjects.length > 0}
	<section class="py-16 bg-blue-600">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
			<h2 class="text-3xl font-bold text-white mb-4">Ready to Make a Difference?</h2>
			<p class="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
				Every donation, no matter the size, creates positive change in communities across Kenya.
			</p>
			<a href="/about" class="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
				Learn How It Works
			</a>
		</div>
	</section>
{/if}

<!-- Donation Modal -->
<DonationModal
	project={selectedProject}
	bind:isOpen={isDonationModalOpen}
	on:donation-initiated={handleDonationInitiated}
/>

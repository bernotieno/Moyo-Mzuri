<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import DonationModal from '$lib/components/DonationModal.svelte';
	import { PUBLIC_APP_NAME, PUBLIC_APP_DESCRIPTION } from '$env/static/public';

	let { data } = $props();

	let selectedProject = $state(null);
	let isDonationModalOpen = $state(false);

	function handleDonate(event) {
		selectedProject = event.detail.project;
		isDonationModalOpen = true;
	}

	function handleDonationInitiated(event) {
		console.log('Donation initiated:', event.detail);
		// Optionally refresh the page to show updated project totals
		// window.location.reload();
	}
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME || 'Moyo Mzuri'} - Supporting Social Projects</title>
	<meta name="description" content={PUBLIC_APP_DESCRIPTION || 'Supporting social projects in our community'} />
</svelte:head>

<!-- Hero Section -->
<section class="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
	<!-- Background Image with Overlay -->
	<div class="absolute inset-0">
		<img src="/background.jpg" alt="Hero Background" class="w-full h-full object-cover" />
		<div class="absolute inset-0 bg-black/50"></div>
	</div>

	<!-- Hero Content -->
	<div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
		<div class="max-w-4xl mx-auto">
			<h1 class="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl mb-6 animate-fade-in-up">
				<span class="block">Transform Lives</span>
				<span class="block text-yellow-300">Through Giving</span>
			</h1>
			<p class="mx-auto mt-6 max-w-3xl text-xl text-gray-100 leading-relaxed animate-fade-in-up-delay">
				{PUBLIC_APP_DESCRIPTION || 'Join our mission to support meaningful social projects in Kenya. Every donation creates ripples of positive change in communities that need it most.'}
			</p>
			<div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay">
				<a href="/projects" class="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
					Donate Now
				</a>
				<a href="/about" class="inline-flex items-center px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
					Learn More
				</a>
			</div>
		</div>
	</div>

	<!-- Scroll Indicator -->
	<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
		<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
		</svg>
	</div>
</section>

<!-- How It Works Section -->
<section class="py-20 bg-blue-50 dark:bg-blue-900">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="text-center mb-16">
			<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
			<p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
				Supporting social projects has never been easier. Follow these simple steps to make a difference.
			</p>
		</div>

		<div class="grid md:grid-cols-3 gap-12">
			<!-- Step 1 -->
			<div class="text-center">
				<div class="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-2xl font-bold text-white">1</span>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Choose a Project</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					Browse through our carefully vetted social projects and find one that resonates with your values and interests.
				</p>
			</div>

			<!-- Step 2 -->
			<div class="text-center">
				<div class="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-2xl font-bold text-white">2</span>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Make a Donation</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					Use M-Pesa to securely donate any amount. Every contribution, no matter the size, makes a meaningful impact.
				</p>
			</div>

			<!-- Step 3 -->
			<div class="text-center">
				<div class="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
					<span class="text-2xl font-bold text-white">3</span>
				</div>
				<h3 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Track Impact</h3>
				<p class="text-gray-600 dark:text-gray-300 leading-relaxed">
					See real-time updates on project progress and witness the positive change your donation is creating.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Projects Section -->
<section id="projects" class="py-20 bg-white dark:bg-blue-950">
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
			<div class="text-center mb-16">
				<h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Featured Projects</h2>
				<p class="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
					Discover impactful social projects that are making a real difference in communities across Kenya. Your support can help them reach their goals.
				</p>
			</div>

			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.projects.slice(0, 6) as project (project.id)}
					<div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-600 transition-all duration-300 transform hover:-translate-y-1">
						<ProjectCard {project} on:donate={handleDonate} />
					</div>
				{/each}
			</div>

			<!-- View More Projects Button -->
			{#if data.projects.length > 6}
				<div class="text-center mt-12">
					<a
						href="/projects"
						class="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						Browse All Projects ({data.projects.length - 6} more)
					</a>
				</div>
			{:else if data.projects.length > 0}
				<div class="text-center mt-12">
					<a
						href="/projects"
						class="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
					>
						Browse All Projects
					</a>
				</div>
			{/if}
		{/if}
	</div>
</section>

<!-- Donation Modal -->
<DonationModal
	project={selectedProject}
	bind:isOpen={isDonationModalOpen}
	on:donation-initiated={handleDonationInitiated}
/>

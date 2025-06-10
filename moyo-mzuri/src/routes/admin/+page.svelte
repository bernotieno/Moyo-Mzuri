<script>
	import { formatCurrency, formatDate, formatRelativeTime, calculateProgress } from '$lib/utils/formatters.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard - Moyo Mzuri</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">
			Overview of your donation platform performance
		</p>
	</div>

	{#if data.error}
		<!-- Error State -->
		<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
			<div class="flex">
				<svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-red-800 dark:text-red-200">Error loading dashboard</h3>
					<p class="mt-1 text-sm text-red-700 dark:text-red-300">{data.error}</p>
				</div>
			</div>
		</div>
	{:else}
		<!-- Stats Grid -->
		<div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
			<!-- Total Projects -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
							<svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.totalProjects}</p>
					</div>
				</div>
			</div>

			<!-- Active Projects -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
							<svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.activeProjects}</p>
					</div>
				</div>
			</div>

			<!-- Total Donations -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
							<svg class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Donations</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.totalDonations}</p>
					</div>
				</div>
			</div>

			<!-- Total Amount -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
							<svg class="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Raised</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(data.stats.totalAmount)}</p>
					</div>
				</div>
			</div>

			<!-- Pending Donations -->
			<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
				<div class="flex items-center">
					<div class="flex-shrink-0">
						<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
							<svg class="h-5 w-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
							</svg>
						</div>
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.pendingDonations}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Content Grid -->
		<div class="grid gap-8 lg:grid-cols-2">
			<!-- Recent Donations -->
			<div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
				<div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Donations</h3>
				</div>
				<div class="p-6">
					{#if data.recentDonations.length === 0}
						<p class="text-center text-gray-500 dark:text-gray-400">No donations yet</p>
					{:else}
						<div class="space-y-4">
							{#each data.recentDonations as donation (donation.id)}
								<div class="flex items-center justify-between">
									<div class="flex-1">
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{donation.projectTitle || 'Unknown Project'}
										</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">
											{formatRelativeTime(donation.createdAt)}
										</p>
									</div>
									<div class="text-right">
										<p class="text-sm font-semibold text-gray-900 dark:text-white">
											{formatCurrency(donation.amount)}
										</p>
										<span class="inline-flex rounded-full px-2 py-1 text-xs font-medium
											{donation.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
											donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 
											'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}">
											{donation.status}
										</span>
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-4 text-center">
							<a
								href="/admin/donations"
								class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
							>
								View all donations →
							</a>
						</div>
					{/if}
				</div>
			</div>

			<!-- Top Projects -->
			<div class="rounded-lg bg-white shadow-sm dark:bg-gray-800">
				<div class="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
					<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Top Projects</h3>
				</div>
				<div class="p-6">
					{#if data.projectStats.length === 0}
						<p class="text-center text-gray-500 dark:text-gray-400">No projects yet</p>
					{:else}
						<div class="space-y-4">
							{#each data.projectStats as project (project.id)}
								{@const progress = calculateProgress(project.totalRaised, project.targetAmount)}
								<div>
									<div class="flex items-center justify-between mb-2">
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{project.title}
										</p>
										<span class="text-xs text-gray-500 dark:text-gray-400">
											{project.donationCount} donations
										</span>
									</div>
									<div class="flex items-center justify-between mb-1">
										<span class="text-xs text-gray-600 dark:text-gray-400">
											{formatCurrency(project.totalRaised)} / {formatCurrency(project.targetAmount)}
										</span>
										<span class="text-xs text-gray-600 dark:text-gray-400">
											{Math.round(progress)}%
										</span>
									</div>
									<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
										<div
											class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
											style="width: {Math.min(progress, 100)}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
						<div class="mt-4 text-center">
							<a
								href="/admin/projects"
								class="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
							>
								Manage projects →
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

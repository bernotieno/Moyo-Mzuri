<script>
	import { formatCurrency, formatDate, formatRelativeTime, formatPhoneNumber } from '$lib/utils/formatters.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { data } = $props();

	function updateFilters(newFilters) {
		const url = new URL($page.url);
		
		// Update search params
		Object.entries(newFilters).forEach(([key, value]) => {
			if (value && value !== 'all') {
				url.searchParams.set(key, value.toString());
			} else {
				url.searchParams.delete(key);
			}
		});
		
		// Reset to page 1 when filters change
		url.searchParams.delete('page');
		
		goto(url.toString());
	}

	function goToPage(pageNum) {
		const url = new URL($page.url);
		if (pageNum > 1) {
			url.searchParams.set('page', pageNum.toString());
		} else {
			url.searchParams.delete('page');
		}
		goto(url.toString());
	}

	function getStatusColor(status) {
		switch (status) {
			case 'completed':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
			case 'pending':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
			case 'failed':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
		}
	}
</script>

<svelte:head>
	<title>Donations - Admin Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Donations</h1>
		<p class="mt-2 text-gray-600 dark:text-gray-400">
			Monitor and manage all donation transactions
		</p>
	</div>

	<!-- Statistics Cards -->
	<div class="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
						<svg class="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.total}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
						<svg class="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.completed}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900">
						<svg class="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.pending}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
						<svg class="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white">{data.stats.failed}</p>
				</div>
			</div>
		</div>

		<div class="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
			<div class="flex items-center">
				<div class="flex-shrink-0">
					<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
						<svg class="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
						</svg>
					</div>
				</div>
				<div class="ml-4">
					<p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
					<p class="text-2xl font-semibold text-gray-900 dark:text-white">{formatCurrency(data.stats.totalAmount)}</p>
				</div>
			</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
		<div class="grid gap-4 sm:grid-cols-3">
			<div>
				<label for="status-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Status
				</label>
				<select
					id="status-filter"
					value={data.filters.status}
					on:change={(e) => updateFilters({ status: e.target.value, project: data.filters.projectId })}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<option value="all">All Statuses</option>
					<option value="completed">Completed</option>
					<option value="pending">Pending</option>
					<option value="failed">Failed</option>
				</select>
			</div>

			<div>
				<label for="project-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					Project
				</label>
				<select
					id="project-filter"
					value={data.filters.projectId || ''}
					on:change={(e) => updateFilters({ status: data.filters.status, project: e.target.value })}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<option value="">All Projects</option>
					{#each data.projects as project (project.id)}
						<option value={project.id}>{project.title}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-end">
				<button
					on:click={() => updateFilters({ status: 'all', project: '' })}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
				>
					Clear Filters
				</button>
			</div>
		</div>
	</div>

	<!-- Donations Table -->
	{#if data.error}
		<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
			<p class="text-red-800 dark:text-red-200">Error loading donations: {data.error}</p>
		</div>
	{:else if data.donations.length === 0}
		<div class="text-center py-12">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
				<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Donations Found</h3>
			<p class="text-gray-600 dark:text-gray-400">
				{data.filters.status !== 'all' || data.filters.projectId ? 'No donations match your current filters.' : 'No donations have been made yet.'}
			</p>
		</div>
	{:else}
		<div class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
					<thead class="bg-gray-50 dark:bg-gray-700">
						<tr>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Donation
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Project
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Amount
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Status
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Date
							</th>
							<th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
								Receipt
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
						{#each data.donations as donation (donation.id)}
							<tr>
								<td class="px-6 py-4">
									<div>
										<p class="text-sm font-medium text-gray-900 dark:text-white">
											{formatPhoneNumber(donation.phoneNumber)}
										</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											ID: {donation.id}
										</p>
									</div>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm text-gray-900 dark:text-white">
										{donation.projectTitle || 'Unknown Project'}
									</p>
								</td>
								<td class="px-6 py-4">
									<p class="text-sm font-semibold text-gray-900 dark:text-white">
										{formatCurrency(donation.amount)}
									</p>
								</td>
								<td class="px-6 py-4">
									<span class="inline-flex rounded-full px-2 py-1 text-xs font-medium {getStatusColor(donation.status)}">
										{donation.status}
									</span>
								</td>
								<td class="px-6 py-4">
									<div>
										<p class="text-sm text-gray-900 dark:text-white">
											{formatDate(donation.createdAt, true)}
										</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">
											{formatRelativeTime(donation.createdAt)}
										</p>
									</div>
								</td>
								<td class="px-6 py-4">
									{#if donation.mpesaReceiptNumber}
										<p class="text-sm font-mono text-gray-900 dark:text-white">
											{donation.mpesaReceiptNumber}
										</p>
									{:else}
										<span class="text-sm text-gray-400 dark:text-gray-500">
											No receipt
										</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>

		<!-- Pagination -->
		{#if data.pagination.total > data.pagination.limit}
			<div class="mt-6 flex items-center justify-between">
				<div class="text-sm text-gray-700 dark:text-gray-300">
					Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total} donations
				</div>
				<div class="flex space-x-2">
					<button
						on:click={() => goToPage(data.pagination.page - 1)}
						disabled={!data.pagination.hasPrev}
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Previous
					</button>
					<span class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
						Page {data.pagination.page}
					</span>
					<button
						on:click={() => goToPage(data.pagination.page + 1)}
						disabled={!data.pagination.hasNext}
						class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Next
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

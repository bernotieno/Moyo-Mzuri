<script>
	import { formatCurrency, calculateProgress, truncateText } from '$lib/utils/formatters.js';
	import { createEventDispatcher } from 'svelte';

	export let project;

	const dispatch = createEventDispatcher();

	$: progress = calculateProgress(project.totalRaised, project.targetAmount);
	$: remaining = Math.max(0, project.targetAmount - project.totalRaised);

	function handleDonate() {
		dispatch('donate', { project });
	}
</script>

<div class="group relative overflow-hidden rounded-xl bg-transparent transition-all duration-200">
	<!-- Project Image -->
	<div class="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
		{#if project.imageUrl}
			<img
				src={project.imageUrl}
				alt={project.title}
				class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
				loading="lazy"
			/>
		{:else}
			<!-- Default placeholder -->
			<div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-600">
				<div class="text-center">
					<div class="text-gray-500 dark:text-gray-400 font-medium">No Image</div>
				</div>
			</div>
		{/if}
	</div>

	<!-- Project Content -->
	<div class="p-6">
		<!-- Title -->
		<h3 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
			{project.title}
		</h3>

		<!-- Description -->
		<p class="mb-4 text-gray-600 dark:text-gray-300">
			{truncateText(project.description, 120)}
		</p>

		<!-- Progress Bar -->
		<div class="mb-4">
			<div class="mb-2 flex items-center justify-between text-sm">
				<span class="font-medium text-gray-700 dark:text-gray-300">Progress</span>
				<span class="text-gray-600 dark:text-gray-400">{Math.round(progress)}%</span>
			</div>
			<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
				<div
					class="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
					style="width: {Math.min(progress, 100)}%"
				></div>
			</div>
		</div>

		<!-- Funding Information -->
		<div class="mb-6 grid grid-cols-2 gap-4 text-sm">
			<div>
				<p class="text-gray-600 dark:text-gray-400">Raised</p>
				<p class="font-semibold text-gray-900 dark:text-white">
					{formatCurrency(project.totalRaised)}
				</p>
			</div>
			<div>
				<p class="text-gray-600 dark:text-gray-400">Target</p>
				<p class="font-semibold text-gray-900 dark:text-white">
					{formatCurrency(project.targetAmount)}
				</p>
			</div>
		</div>

		<!-- Donate Button -->
		<button
			on:click={handleDonate}
			class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
			disabled={!project.isActive}
		>
			{#if !project.isActive}
				Campaign Ended
			{:else if progress >= 100}
				Goal Reached - Donate More
			{:else}
				Donate Now
			{/if}
		</button>

		<!-- Remaining Amount (if not fully funded) -->
		{#if progress < 100 && project.isActive}
			<p class="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
				{formatCurrency(remaining)} remaining to reach goal
			</p>
		{/if}
	</div>
</div>

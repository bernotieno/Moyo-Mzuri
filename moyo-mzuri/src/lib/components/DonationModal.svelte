<script>
	import { createEventDispatcher } from 'svelte';
	import { validatePhoneNumber, validateAmount } from '$lib/utils/validation.js';
	import { formatCurrency } from '$lib/utils/formatters.js';
	import LoadingSpinner from './LoadingSpinner.svelte';

	export let project = null;
	export let isOpen = false;

	const dispatch = createEventDispatcher();

	let amount = '';
	let phoneNumber = '';
	let isLoading = false;
	let errors = {};
	let step = 'form'; // 'form', 'processing', 'success', 'error'
	let message = '';

	// Predefined amounts
	const quickAmounts = [50, 100, 250, 500, 1000, 2500];

	function closeModal() {
		if (!isLoading) {
			isOpen = false;
			resetForm();
		}
	}

	function resetForm() {
		amount = '';
		phoneNumber = '';
		errors = {};
		step = 'form';
		message = '';
		isLoading = false;
	}

	function selectAmount(value) {
		amount = value.toString();
		errors.amount = '';
	}

	function validateForm() {
		errors = {};

		const amountValidation = validateAmount(amount);
		if (!amountValidation.isValid) {
			errors.amount = amountValidation.message;
		}

		const phoneValidation = validatePhoneNumber(phoneNumber);
		if (!phoneValidation.isValid) {
			errors.phoneNumber = phoneValidation.message;
		}

		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		if (!validateForm()) return;

		isLoading = true;
		step = 'processing';

		try {
			const response = await fetch('/api/mpesa/stk-push', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					projectId: project.id,
					amount: parseFloat(amount),
					phoneNumber: phoneNumber.trim()
				})
			});

			const result = await response.json();

			if (result.success) {
				step = 'success';
				message = result.message;
				dispatch('donation-initiated', {
					project,
					amount: parseFloat(amount),
					phoneNumber: phoneNumber.trim()
				});
			} else {
				step = 'error';
				message = result.error || 'Failed to initiate payment';
			}
		} catch (error) {
			console.error('Donation error:', error);
			step = 'error';
			message = 'Network error. Please try again.';
		} finally {
			isLoading = false;
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Escape' && !isLoading) {
			closeModal();
		}
	}

	// Close modal when clicking outside
	function handleBackdropClick(event) {
		if (event.target === event.currentTarget && !isLoading) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen && project}
	<!-- Modal Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
		on:click={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<!-- Modal Content -->
		<div class="w-full max-w-md rounded-xl bg-white shadow-xl dark:bg-gray-800">
			<!-- Modal Header -->
			<div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
				<h2 id="modal-title" class="text-xl font-semibold text-gray-900 dark:text-white">
					Donate to {project.title}
				</h2>
				<button
					on:click={closeModal}
					class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
					disabled={isLoading}
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<!-- Modal Body -->
			<div class="p-6">
				{#if step === 'form'}
					<form on:submit|preventDefault={handleSubmit} class="space-y-6">
						<!-- Amount Selection -->
						<div>
							<label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								Donation Amount (KES)
							</label>
							
							<!-- Quick Amount Buttons -->
							<div class="grid grid-cols-3 gap-2 mb-3">
								{#each quickAmounts as quickAmount}
									<button
										type="button"
										on:click={() => selectAmount(quickAmount)}
										class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:hover:bg-gray-700 {amount === quickAmount.toString() ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'}"
									>
										{formatCurrency(quickAmount, false)}
									</button>
								{/each}
							</div>

							<!-- Custom Amount Input -->
							<input
								id="amount"
								type="number"
								bind:value={amount}
								placeholder="Enter custom amount"
								min="1"
								step="0.01"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
								class:border-red-500={errors.amount}
								class:dark:border-red-500={errors.amount}
							/>
							{#if errors.amount}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
							{/if}
						</div>

						<!-- Phone Number -->
						<div>
							<label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
								M-Pesa Phone Number
							</label>
							<input
								id="phone"
								type="tel"
								bind:value={phoneNumber}
								placeholder="0712345678 or 254712345678"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
								class:border-red-500={errors.phoneNumber}
								class:dark:border-red-500={errors.phoneNumber}
							/>
							{#if errors.phoneNumber}
								<p class="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
							{/if}
						</div>

						<!-- Submit Button -->
						<button
							type="submit"
							disabled={isLoading}
							class="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-800"
						>
							{#if isLoading}
								<LoadingSpinner size="sm" color="white" text="Processing..." />
							{:else}
								Donate {amount ? formatCurrency(parseFloat(amount)) : ''}
							{/if}
						</button>
					</form>

				{:else if step === 'processing'}
					<div class="text-center py-8">
						<LoadingSpinner size="lg" color="blue" />
						<p class="mt-4 text-gray-600 dark:text-gray-400">Initiating payment...</p>
					</div>

				{:else if step === 'success'}
					<div class="text-center py-8">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
							<svg class="h-8 w-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Payment Initiated!</h3>
						<p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
						<button
							on:click={closeModal}
							class="rounded-lg bg-green-600 px-6 py-2 font-medium text-white transition-colors hover:bg-green-700"
						>
							Done
						</button>
					</div>

				{:else if step === 'error'}
					<div class="text-center py-8">
						<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
							<svg class="h-8 w-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
							</svg>
						</div>
						<h3 class="mb-2 text-lg font-semibold text-gray-900 dark:text-white">Payment Failed</h3>
						<p class="text-gray-600 dark:text-gray-400 mb-6">{message}</p>
						<div class="flex space-x-3">
							<button
								on:click={() => { step = 'form'; message = ''; }}
								class="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								Try Again
							</button>
							<button
								on:click={closeModal}
								class="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
							>
								Close
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

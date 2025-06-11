<script>
	import { formatCurrency, formatDate, calculateProgress, truncateText } from '$lib/utils/formatters.js';
	import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

	let { data } = $props();

	let showCreateModal = $state(false);
	let editingProject = $state(null);
	let isLoading = $state(false);
	let message = $state('');
	let messageType = $state(''); // 'success' or 'error'

	// Form data
	let formData = $state({
		title: '',
		description: '',
		targetAmount: '',
		imageUrl: ''
	});

	// Image upload state
	let imageFile = $state(null);
	let imagePreview = $state('');
	let isUploadingImage = $state(false);

	function resetForm() {
		formData = {
			title: '',
			description: '',
			targetAmount: '',
			imageUrl: ''
		};
		imageFile = null;
		imagePreview = '';
		isUploadingImage = false;
		editingProject = null;
		showCreateModal = false;
	}

	function openCreateModal() {
		resetForm();
		showCreateModal = true;
	}

	function openEditModal(project) {
		formData = {
			title: project.title,
			description: project.description,
			targetAmount: project.targetAmount.toString(),
			imageUrl: project.imageUrl || ''
		};
		imageFile = null;
		imagePreview = project.imageUrl || '';
		isUploadingImage = false;
		editingProject = project;
		showCreateModal = true;
	}

	function handleImageSelect(event) {
		const file = event.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith('image/')) {
			message = 'Please select a valid image file';
			messageType = 'error';
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			message = 'Image file size must be less than 5MB';
			messageType = 'error';
			return;
		}

		imageFile = file;

		// Create preview
		const reader = new FileReader();
		reader.onload = (e) => {
			imagePreview = e.target.result;
		};
		reader.readAsDataURL(file);
	}

	function removeImage() {
		imageFile = null;
		imagePreview = '';
		formData.imageUrl = '';
	}

	async function uploadImage() {
		if (!imageFile) return null;

		isUploadingImage = true;
		try {
			// Create FormData for file upload
			const uploadFormData = new FormData();
			uploadFormData.append('image', imageFile);

			// You would implement your image upload endpoint here
			// For now, we'll use a placeholder URL
			// const response = await fetch('/api/upload-image', {
			//     method: 'POST',
			//     body: uploadFormData
			// });
			// const result = await response.json();
			// return result.imageUrl;

			// Placeholder: In a real app, you'd upload to a service like Cloudinary, AWS S3, etc.
			// For demo purposes, we'll use the preview URL
			return imagePreview;
		} catch (error) {
			console.error('Image upload error:', error);
			throw new Error('Failed to upload image');
		} finally {
			isUploadingImage = false;
		}
	}

	async function handleSubmit() {
		isLoading = true;
		message = '';

		try {
			// Upload image if a new one was selected
			let finalImageUrl = formData.imageUrl;
			if (imageFile) {
				finalImageUrl = await uploadImage();
			}

			const url = editingProject ? '/api/projects' : '/api/projects';
			const method = editingProject ? 'PUT' : 'POST';

			const payload = {
				title: formData.title,
				description: formData.description,
				targetAmount: parseFloat(formData.targetAmount),
				imageUrl: finalImageUrl || null
			};

			if (editingProject) {
				payload.id = editingProject.id;
			}

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (result.success) {
				message = editingProject ? 'Project updated successfully!' : 'Project created successfully!';
				messageType = 'success';
				resetForm();
				// Refresh the page to show updated data
				goto('/admin/projects', { replaceState: true });
			} else {
				message = result.error || 'Failed to save project';
				messageType = 'error';
			}
		} catch (error) {
			console.error('Error saving project:', error);
			message = 'Network error. Please try again.';
			messageType = 'error';
		} finally {
			isLoading = false;
		}
	}

	async function toggleProjectStatus(project) {
		isLoading = true;
		message = '';

		try {
			const response = await fetch('/api/projects', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: project.id,
					isActive: !project.isActive
				})
			});

			const result = await response.json();

			if (result.success) {
				message = `Project ${project.isActive ? 'deactivated' : 'activated'} successfully!`;
				messageType = 'success';
				// Refresh the page
				goto('/admin/projects', { replaceState: true });
			} else {
				message = result.error || 'Failed to update project status';
				messageType = 'error';
			}
		} catch (error) {
			console.error('Error updating project status:', error);
			message = 'Network error. Please try again.';
			messageType = 'error';
		} finally {
			isLoading = false;
		}
	}

	async function deleteProject(project) {
		if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
			return;
		}

		isLoading = true;
		message = '';

		try {
			const response = await fetch('/api/projects', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ id: project.id })
			});

			const result = await response.json();

			if (result.success) {
				message = 'Project deleted successfully!';
				messageType = 'success';
				// Refresh the page
				goto('/admin/projects', { replaceState: true });
			} else {
				message = result.error || 'Failed to delete project';
				messageType = 'error';
			}
		} catch (error) {
			console.error('Error deleting project:', error);
			message = 'Network error. Please try again.';
			messageType = 'error';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Manage Projects - Admin Dashboard</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
	<!-- Page Header -->
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Projects</h1>
			<p class="mt-2 text-gray-600 dark:text-gray-400">
				Create, edit, and manage donation projects
			</p>
		</div>
		<button
			on:click={openCreateModal}
			class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
		>
			Create New Project
		</button>
	</div>

	<!-- Message Display -->
	{#if message}
		<div class="mb-6 rounded-lg p-4 {messageType === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}">
			{message}
		</div>
	{/if}

	<!-- Projects Table -->
	{#if data.error}
		<div class="rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
			<p class="text-red-800 dark:text-red-200">Error loading projects: {data.error}</p>
		</div>
	{:else if data.projects.length === 0}
		<div class="text-center py-12">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
				<svg class="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Projects Yet</h3>
			<p class="text-gray-600 dark:text-gray-400 mb-4">
				Create your first donation project to get started.
			</p>
			<button
				on:click={openCreateModal}
				class="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
			>
				Create First Project
			</button>
		</div>
	{:else}
		<!-- Projects Grid Layout -->
		<div class="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
			{#each data.projects as project (project.id)}
				{@const progress = calculateProgress(project.totalRaised, project.targetAmount)}
				<div class="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-200 hover:border-red-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 dark:hover:border-red-600">
					<!-- Project Image -->
					<div class="aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
						{#if project.imageUrl}
							<img
								src={project.imageUrl}
								alt={project.title}
								class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
								loading="lazy"
							/>
						{:else}
							<div class="flex h-full w-full items-center justify-center">
								<div class="text-center">
									<div class="text-gray-500 dark:text-gray-400 font-medium">No Image</div>
								</div>
							</div>
						{/if}

						<!-- Status Badge -->
						<div class="absolute top-3 right-3">
							<span class="inline-flex rounded-full px-3 py-1 text-xs font-semibold shadow-lg
								{project.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}">
								{project.isActive ? 'Active' : 'Inactive'}
							</span>
						</div>
					</div>

					<!-- Project Content -->
					<div class="p-6">
						<!-- Title and Description -->
						<div class="mb-4">
							<h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
								{project.title}
							</h3>
							<p class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
								{project.description}
							</p>
						</div>

						<!-- Progress Section -->
						<div class="mb-4">
							<div class="mb-2 flex items-center justify-between text-sm">
								<span class="font-medium text-gray-700 dark:text-gray-300">Progress</span>
								<span class="font-semibold text-red-600 dark:text-red-400">{Math.round(progress)}%</span>
							</div>
							<div class="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
								<div
									class="h-full rounded-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
									style="width: {Math.min(progress, 100)}%"
								></div>
							</div>
						</div>

						<!-- Funding Information -->
						<div class="mb-4 grid grid-cols-2 gap-4">
							<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
								<p class="text-xs text-gray-600 dark:text-gray-400">Raised</p>
								<p class="text-lg font-bold text-gray-900 dark:text-white">
									{formatCurrency(project.totalRaised)}
								</p>
							</div>
							<div class="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
								<p class="text-xs text-gray-600 dark:text-gray-400">Target</p>
								<p class="text-lg font-bold text-gray-900 dark:text-white">
									{formatCurrency(project.targetAmount)}
								</p>
							</div>
						</div>

						<!-- Stats -->
						<div class="mb-6 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
							<span>{project.donationCount} donations</span>
							<span>Created {formatDate(project.createdAt)}</span>
						</div>

						<!-- Action Buttons -->
						<div class="flex space-x-2">
							<button
								on:click={() => openEditModal(project)}
								class="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
								title="Edit project"
							>
								<svg class="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
								</svg>
							</button>
							<button
								on:click={() => toggleProjectStatus(project)}
								class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
								title="{project.isActive ? 'Deactivate' : 'Activate'} project"
							>
								{#if project.isActive}
									<svg class="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								{:else}
									<svg class="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
									</svg>
								{/if}
							</button>
							<button
								on:click={() => deleteProject(project)}
								class="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
								title="Delete project"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
								</svg>
							</button>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Create/Edit Modal -->
{#if showCreateModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
		<div class="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-800">
			<div class="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
				<h2 class="text-xl font-semibold text-gray-900 dark:text-white">
					{editingProject ? 'Edit Project' : 'Create New Project'}
				</h2>
				<button
					on:click={resetForm}
					class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
				>
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
			</div>

			<form on:submit|preventDefault={handleSubmit} class="p-6 space-y-6">
				<div>
					<label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Project Title *
					</label>
					<input
						id="title"
						type="text"
						bind:value={formData.title}
						required
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<div>
					<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Description *
					</label>
					<textarea
						id="description"
						bind:value={formData.description}
						required
						rows="4"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					></textarea>
				</div>

				<div>
					<label for="targetAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Target Amount (KES) *
					</label>
					<input
						id="targetAmount"
						type="number"
						bind:value={formData.targetAmount}
						required
						min="100"
						step="0.01"
						class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					/>
				</div>

				<!-- Image Upload Section -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						Project Image (optional)
					</label>

					<!-- Image Preview -->
					{#if imagePreview}
						<div class="mb-4 relative">
							<img
								src={imagePreview}
								alt="Project preview"
								class="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
							/>
							<button
								type="button"
								on:click={removeImage}
								class="absolute top-2 right-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
								title="Remove image"
							>
								<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
								</svg>
							</button>
						</div>
					{/if}

					<!-- Upload Options -->
					<div class="space-y-4">
						<!-- File Upload -->
						<div>
							<label for="imageFile" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
								Upload from device
							</label>
							<div class="flex items-center space-x-3">
								<input
									id="imageFile"
									type="file"
									accept="image/*"
									on:change={handleImageSelect}
									class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900/20 dark:file:text-red-400"
								/>
								{#if isUploadingImage}
									<LoadingSpinner size="sm" color="red" />
								{/if}
							</div>
							<p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
								PNG, JPG, GIF up to 5MB
							</p>
						</div>

						<!-- OR Divider -->
						<div class="relative">
							<div class="absolute inset-0 flex items-center">
								<div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
							</div>
							<div class="relative flex justify-center text-sm">
								<span class="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">OR</span>
							</div>
						</div>

						<!-- URL Input -->
						<div>
							<label for="imageUrl" class="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
								Image URL
							</label>
							<input
								id="imageUrl"
								type="url"
								bind:value={formData.imageUrl}
								on:input={() => { if (formData.imageUrl) imagePreview = formData.imageUrl; }}
								placeholder="https://example.com/image.jpg"
								class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
							/>
						</div>
					</div>
				</div>

				<div class="flex space-x-3 pt-4">
					<button
						type="button"
						on:click={resetForm}
						class="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isLoading}
						class="flex-1 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isLoading}
							<LoadingSpinner size="sm" color="white" text="Saving..." />
						{:else}
							{editingProject ? 'Update Project' : 'Create Project'}
						{/if}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

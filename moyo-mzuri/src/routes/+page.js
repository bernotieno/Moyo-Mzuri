/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	try {
		const response = await fetch('/api/projects');
		const data = await response.json();

		if (data.success) {
			return {
				projects: data.projects
			};
		} else {
			throw new Error(data.error || 'Failed to load projects');
		}
	} catch (error) {
		console.error('Error loading projects:', error);
		return {
			projects: [],
			error: error.message
		};
	}
}

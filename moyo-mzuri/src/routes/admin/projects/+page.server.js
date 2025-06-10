import { db } from '$lib/server/db/index.js';
import { projects, donations } from '$lib/server/db/schema.js';
import { sql, eq, desc } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		// Get all projects with donation counts
		const allProjects = await db
			.select({
				id: projects.id,
				title: projects.title,
				description: projects.description,
				targetAmount: projects.targetAmount,
				totalRaised: projects.totalRaised,
				imageUrl: projects.imageUrl,
				isActive: projects.isActive,
				createdAt: projects.createdAt,
				updatedAt: projects.updatedAt,
				donationCount: sql`count(${donations.id})`
			})
			.from(projects)
			.leftJoin(donations, eq(projects.id, donations.projectId))
			.groupBy(projects.id)
			.orderBy(desc(projects.createdAt));

		return {
			projects: allProjects
		};
	} catch (error) {
		console.error('Error loading admin projects:', error);
		return {
			projects: [],
			error: error.message
		};
	}
}

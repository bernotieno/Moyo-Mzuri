import { db } from '$lib/server/db/index.js';
import { projects, donations } from '$lib/server/db/schema.js';
import { sql, eq, desc } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	try {
		// Get total statistics
		const totalProjectsResult = await db
			.select({ count: sql`count(*)` })
			.from(projects);

		const activeProjectsResult = await db
			.select({ count: sql`count(*)` })
			.from(projects)
			.where(eq(projects.isActive, true));

		const totalDonationsResult = await db
			.select({ 
				count: sql`count(*)`,
				total: sql`sum(${donations.amount})`
			})
			.from(donations)
			.where(eq(donations.status, 'completed'));

		const pendingDonationsResult = await db
			.select({ count: sql`count(*)` })
			.from(donations)
			.where(eq(donations.status, 'pending'));

		// Get recent donations
		const recentDonations = await db
			.select({
				id: donations.id,
				amount: donations.amount,
				phoneNumber: donations.phoneNumber,
				status: donations.status,
				createdAt: donations.createdAt,
				projectTitle: projects.title
			})
			.from(donations)
			.leftJoin(projects, eq(donations.projectId, projects.id))
			.orderBy(desc(donations.createdAt))
			.limit(10);

		// Get project performance
		const projectStats = await db
			.select({
				id: projects.id,
				title: projects.title,
				targetAmount: projects.targetAmount,
				totalRaised: projects.totalRaised,
				donationCount: sql`count(${donations.id})`,
				isActive: projects.isActive
			})
			.from(projects)
			.leftJoin(donations, eq(projects.id, donations.projectId))
			.groupBy(projects.id)
			.orderBy(desc(projects.totalRaised))
			.limit(5);

		return {
			stats: {
				totalProjects: totalProjectsResult[0]?.count || 0,
				activeProjects: activeProjectsResult[0]?.count || 0,
				totalDonations: totalDonationsResult[0]?.count || 0,
				totalAmount: totalDonationsResult[0]?.total || 0,
				pendingDonations: pendingDonationsResult[0]?.count || 0
			},
			recentDonations,
			projectStats
		};
	} catch (error) {
		console.error('Error loading admin dashboard data:', error);
		return {
			stats: {
				totalProjects: 0,
				activeProjects: 0,
				totalDonations: 0,
				totalAmount: 0,
				pendingDonations: 0
			},
			recentDonations: [],
			projectStats: [],
			error: error.message
		};
	}
}

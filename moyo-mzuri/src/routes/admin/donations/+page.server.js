import { db } from '$lib/server/db/index.js';
import { donations, projects } from '$lib/server/db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = 20;
		const offset = (page - 1) * limit;
		const status = url.searchParams.get('status') || 'all';
		const projectId = url.searchParams.get('project');

		// Build query conditions
		let whereConditions = [];
		if (status !== 'all') {
			whereConditions.push(eq(donations.status, status));
		}
		if (projectId) {
			whereConditions.push(eq(donations.projectId, parseInt(projectId)));
		}

		// Get donations with project information
		let donationsQuery = db
			.select({
				id: donations.id,
				projectId: donations.projectId,
				amount: donations.amount,
				phoneNumber: donations.phoneNumber,
				mpesaReceiptNumber: donations.mpesaReceiptNumber,
				mpesaTransactionId: donations.mpesaTransactionId,
				status: donations.status,
				createdAt: donations.createdAt,
				completedAt: donations.completedAt,
				projectTitle: projects.title
			})
			.from(donations)
			.leftJoin(projects, eq(donations.projectId, projects.id))
			.orderBy(desc(donations.createdAt))
			.limit(limit)
			.offset(offset);

		// Apply where conditions if any
		if (whereConditions.length > 0) {
			for (const condition of whereConditions) {
				donationsQuery = donationsQuery.where(condition);
			}
		}

		const allDonations = await donationsQuery;

		// Get total count for pagination
		let countQuery = db.select({ count: sql`count(*)` }).from(donations);
		if (whereConditions.length > 0) {
			for (const condition of whereConditions) {
				countQuery = countQuery.where(condition);
			}
		}
		const totalCount = await countQuery;

		// Get all projects for filter dropdown
		const allProjects = await db
			.select({
				id: projects.id,
				title: projects.title
			})
			.from(projects)
			.orderBy(projects.title);

		// Get summary statistics
		const stats = await db
			.select({
				total: sql`count(*)`,
				completed: sql`sum(case when ${donations.status} = 'completed' then 1 else 0 end)`,
				pending: sql`sum(case when ${donations.status} = 'pending' then 1 else 0 end)`,
				failed: sql`sum(case when ${donations.status} = 'failed' then 1 else 0 end)`,
				totalAmount: sql`sum(case when ${donations.status} = 'completed' then ${donations.amount} else 0 end)`
			})
			.from(donations);

		return {
			donations: allDonations,
			projects: allProjects,
			pagination: {
				page,
				limit,
				total: totalCount[0]?.count || 0,
				hasNext: offset + limit < (totalCount[0]?.count || 0),
				hasPrev: page > 1
			},
			filters: {
				status,
				projectId: projectId ? parseInt(projectId) : null
			},
			stats: stats[0] || {
				total: 0,
				completed: 0,
				pending: 0,
				failed: 0,
				totalAmount: 0
			}
		};
	} catch (error) {
		console.error('Error loading admin donations:', error);
		return {
			donations: [],
			projects: [],
			pagination: {
				page: 1,
				limit: 20,
				total: 0,
				hasNext: false,
				hasPrev: false
			},
			filters: {
				status: 'all',
				projectId: null
			},
			stats: {
				total: 0,
				completed: 0,
				pending: 0,
				failed: 0,
				totalAmount: 0
			},
			error: error.message
		};
	}
}

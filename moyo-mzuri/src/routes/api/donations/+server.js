import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { donations, projects } from '$lib/server/db/schema.js';
import { eq, desc, sql } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	try {
		const projectId = url.searchParams.get('projectId');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		let query = db
			.select({
				id: donations.id,
				projectId: donations.projectId,
				amount: donations.amount,
				phoneNumber: donations.phoneNumber,
				mpesaReceiptNumber: donations.mpesaReceiptNumber,
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

		if (projectId) {
			query = query.where(eq(donations.projectId, parseInt(projectId)));
		}

		const allDonations = await query;

		// Get total count for pagination
		const totalCountQuery = projectId
			? db.select({ count: sql`count(*)` }).from(donations).where(eq(donations.projectId, parseInt(projectId)))
			: db.select({ count: sql`count(*)` }).from(donations);
		
		const totalCount = await totalCountQuery;

		return json({
			success: true,
			donations: allDonations,
			pagination: {
				total: totalCount[0].count,
				limit,
				offset,
				hasMore: offset + limit < totalCount[0].count
			}
		});
	} catch (error) {
		console.error('Error fetching donations:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch donations'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { projectId, amount, phoneNumber, mpesaTransactionId, mpesaReceiptNumber } = await request.json();

		// Validate required fields
		if (!projectId || !amount || !phoneNumber) {
			return json(
				{
					success: false,
					error: 'Project ID, amount, and phone number are required'
				},
				{ status: 400 }
			);
		}

		// Validate amount
		if (isNaN(amount) || amount <= 0) {
			return json(
				{
					success: false,
					error: 'Amount must be a positive number'
				},
				{ status: 400 }
			);
		}

		// Validate phone number format
		const phoneRegex = /^(?:254|0)[17]\d{8}$/;
		const cleanPhone = phoneNumber.replace(/\D/g, '');
		let formattedPhone = cleanPhone;
		
		if (cleanPhone.startsWith('0')) {
			formattedPhone = '254' + cleanPhone.substring(1);
		}
		
		if (!phoneRegex.test(formattedPhone)) {
			return json(
				{
					success: false,
					error: 'Invalid phone number format. Use format: 0712345678 or 254712345678'
				},
				{ status: 400 }
			);
		}

		// Check if project exists
		const project = await db
			.select()
			.from(projects)
			.where(eq(projects.id, projectId))
			.limit(1);

		if (project.length === 0) {
			return json(
				{
					success: false,
					error: 'Project not found'
				},
				{ status: 404 }
			);
		}

		// Create donation record
		const newDonation = await db
			.insert(donations)
			.values({
				projectId: parseInt(projectId),
				amount: parseFloat(amount),
				phoneNumber: formattedPhone,
				mpesaTransactionId: mpesaTransactionId || null,
				mpesaReceiptNumber: mpesaReceiptNumber || null,
				status: mpesaReceiptNumber ? 'completed' : 'pending',
				createdAt: new Date(),
				completedAt: mpesaReceiptNumber ? new Date() : null
			})
			.returning();

		// If donation is completed, update project total
		if (mpesaReceiptNumber) {
			await db
				.update(projects)
				.set({
					totalRaised: sql`${projects.totalRaised} + ${parseFloat(amount)}`,
					updatedAt: new Date()
				})
				.where(eq(projects.id, projectId));
		}

		return json({
			success: true,
			donation: newDonation[0]
		});
	} catch (error) {
		console.error('Error creating donation:', error);
		return json(
			{
				success: false,
				error: 'Failed to create donation'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
	try {
		const { id, status, mpesaReceiptNumber, mpesaTransactionId } = await request.json();

		if (!id) {
			return json(
				{
					success: false,
					error: 'Donation ID is required'
				},
				{ status: 400 }
			);
		}

		// Get current donation
		const currentDonation = await db
			.select()
			.from(donations)
			.where(eq(donations.id, id))
			.limit(1);

		if (currentDonation.length === 0) {
			return json(
				{
					success: false,
					error: 'Donation not found'
				},
				{ status: 404 }
			);
		}

		const updateData = {};
		
		if (status !== undefined) updateData.status = status;
		if (mpesaReceiptNumber !== undefined) updateData.mpesaReceiptNumber = mpesaReceiptNumber;
		if (mpesaTransactionId !== undefined) updateData.mpesaTransactionId = mpesaTransactionId;
		
		// If status is being changed to completed, set completedAt
		if (status === 'completed' && currentDonation[0].status !== 'completed') {
			updateData.completedAt = new Date();
			
			// Update project total raised
			await db
				.update(projects)
				.set({
					totalRaised: sql`${projects.totalRaised} + ${currentDonation[0].amount}`,
					updatedAt: new Date()
				})
				.where(eq(projects.id, currentDonation[0].projectId));
		}

		const updatedDonation = await db
			.update(donations)
			.set(updateData)
			.where(eq(donations.id, id))
			.returning();

		return json({
			success: true,
			donation: updatedDonation[0]
		});
	} catch (error) {
		console.error('Error updating donation:', error);
		return json(
			{
				success: false,
				error: 'Failed to update donation'
			},
			{ status: 500 }
		);
	}
}

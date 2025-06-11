import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { donations, projects } from '$lib/server/db/schema.js';
import { eq, sql } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ params, request }) {
	try {
		const { id } = params;
		const { adminPassword } = await request.json();

		// Verify admin password for security
		if (adminPassword !== env.ADMIN_PASSWORD) {
			return json(
				{
					success: false,
					error: 'Unauthorized'
				},
				{ status: 401 }
			);
		}

		// Get the donation
		const donation = await db
			.select()
			.from(donations)
			.where(eq(donations.id, parseInt(id)))
			.limit(1);

		if (donation.length === 0) {
			return json(
				{
					success: false,
					error: 'Donation not found'
				},
				{ status: 404 }
			);
		}

		const donationRecord = donation[0];

		// Check if already completed
		if (donationRecord.status === 'completed') {
			return json({
				success: true,
				message: 'Donation already completed',
				donation: donationRecord
			});
		}

		// Update donation status to completed
		const updatedDonation = await db
			.update(donations)
			.set({
				status: 'completed',
				mpesaReceiptNumber: `MANUAL-${Date.now()}`,
				completedAt: new Date()
			})
			.where(eq(donations.id, parseInt(id)))
			.returning();

		// Update project total raised
		await db
			.update(projects)
			.set({
				totalRaised: sql`${projects.totalRaised} + ${donationRecord.amount}`,
				updatedAt: new Date()
			})
			.where(eq(projects.id, donationRecord.projectId));

		return json({
			success: true,
			message: 'Donation marked as completed successfully',
			donation: updatedDonation[0]
		});
	} catch (error) {
		console.error('Error completing donation:', error);
		return json(
			{
				success: false,
				error: 'Failed to complete donation'
			},
			{ status: 500 }
		);
	}
}

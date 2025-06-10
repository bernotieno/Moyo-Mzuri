import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { donations, projects } from '$lib/server/db/schema.js';
import { eq, sql } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const callbackData = await request.json();
		console.log('Mpesa Callback received:', JSON.stringify(callbackData, null, 2));

		// Extract callback data
		const { Body } = callbackData;
		if (!Body || !Body.stkCallback) {
			console.error('Invalid callback format');
			return json({ ResultCode: 0, ResultDesc: 'Success' });
		}

		const { stkCallback } = Body;
		const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

		// Find the donation by checkout request ID
		const donation = await db
			.select()
			.from(donations)
			.where(eq(donations.mpesaTransactionId, CheckoutRequestID))
			.limit(1);

		if (donation.length === 0) {
			console.error('Donation not found for CheckoutRequestID:', CheckoutRequestID);
			return json({ ResultCode: 0, ResultDesc: 'Success' });
		}

		const donationRecord = donation[0];

		// Check if payment was successful
		if (ResultCode === 0) {
			// Payment successful - extract callback metadata
			const callbackMetadata = stkCallback.CallbackMetadata;
			let mpesaReceiptNumber = null;
			let transactionDate = null;
			let phoneNumber = null;

			if (callbackMetadata && callbackMetadata.Item) {
				for (const item of callbackMetadata.Item) {
					switch (item.Name) {
						case 'MpesaReceiptNumber':
							mpesaReceiptNumber = item.Value;
							break;
						case 'TransactionDate':
							transactionDate = item.Value;
							break;
						case 'PhoneNumber':
							phoneNumber = item.Value;
							break;
					}
				}
			}

			// Update donation status to completed
			await db
				.update(donations)
				.set({
					status: 'completed',
					mpesaReceiptNumber: mpesaReceiptNumber,
					completedAt: new Date()
				})
				.where(eq(donations.id, donationRecord.id));

			// Update project total raised
			await db
				.update(projects)
				.set({
					totalRaised: sql`${projects.totalRaised} + ${donationRecord.amount}`,
					updatedAt: new Date()
				})
				.where(eq(projects.id, donationRecord.projectId));

			console.log(`Donation ${donationRecord.id} completed successfully. Receipt: ${mpesaReceiptNumber}`);
		} else {
			// Payment failed
			await db
				.update(donations)
				.set({
					status: 'failed'
				})
				.where(eq(donations.id, donationRecord.id));

			console.log(`Donation ${donationRecord.id} failed. Reason: ${ResultDesc}`);
		}

		// Always return success to Mpesa
		return json({
			ResultCode: 0,
			ResultDesc: 'Success'
		});
	} catch (error) {
		console.error('Mpesa callback error:', error);
		
		// Still return success to prevent Mpesa from retrying
		return json({
			ResultCode: 0,
			ResultDesc: 'Success'
		});
	}
}

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	// Handle GET requests (for testing/verification)
	return json({
		message: 'Mpesa callback endpoint is active',
		timestamp: new Date().toISOString()
	});
}

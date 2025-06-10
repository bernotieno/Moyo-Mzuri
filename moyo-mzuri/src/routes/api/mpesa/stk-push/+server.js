import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { donations, projects } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { initiateSTKPush } from '$lib/server/mpesa.js';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { projectId, amount, phoneNumber } = await request.json();

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
		const donationAmount = parseFloat(amount);
		if (isNaN(donationAmount) || donationAmount <= 0) {
			return json(
				{
					success: false,
					error: 'Amount must be a positive number'
				},
				{ status: 400 }
			);
		}

		// Validate minimum amount (KES 1)
		if (donationAmount < 1) {
			return json(
				{
					success: false,
					error: 'Minimum donation amount is KES 1'
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

		// Check if project exists and is active
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

		if (!project[0].isActive) {
			return json(
				{
					success: false,
					error: 'This project is no longer accepting donations'
				},
				{ status: 400 }
			);
		}

		// Create pending donation record
		const newDonation = await db
			.insert(donations)
			.values({
				projectId: parseInt(projectId),
				amount: donationAmount,
				phoneNumber: formattedPhone,
				status: 'pending',
				createdAt: new Date()
			})
			.returning();

		const donationId = newDonation[0].id;

		// Initiate STK Push
		const stkResult = await initiateSTKPush({
			phoneNumber: formattedPhone,
			amount: donationAmount,
			accountReference: `DONATION-${donationId}`,
			transactionDesc: `Donation to ${project[0].title}`
		});

		if (!stkResult.success) {
			// Update donation status to failed
			await db
				.update(donations)
				.set({ status: 'failed' })
				.where(eq(donations.id, donationId));

			return json(
				{
					success: false,
					error: stkResult.error || 'Failed to initiate payment'
				},
				{ status: 500 }
			);
		}

		// Update donation with Mpesa transaction details
		await db
			.update(donations)
			.set({
				mpesaTransactionId: stkResult.checkoutRequestId
			})
			.where(eq(donations.id, donationId));

		return json({
			success: true,
			message: 'STK Push initiated successfully. Please check your phone for the payment prompt.',
			donation: {
				id: donationId,
				checkoutRequestId: stkResult.checkoutRequestId,
				merchantRequestId: stkResult.merchantRequestId
			}
		});
	} catch (error) {
		console.error('STK Push error:', error);
		return json(
			{
				success: false,
				error: 'Failed to process payment request'
			},
			{ status: 500 }
		);
	}
}

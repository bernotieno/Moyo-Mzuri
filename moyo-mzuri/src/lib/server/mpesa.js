import { env } from '$env/dynamic/private';

/**
 * Get Mpesa access token
 */
async function getAccessToken() {
	const auth = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64');
	
	const response = await fetch(
		env.MPESA_ENVIRONMENT === 'production'
			? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
			: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
		{
			method: 'GET',
			headers: {
				Authorization: `Basic ${auth}`
			}
		}
	);

	if (!response.ok) {
		throw new Error('Failed to get Mpesa access token');
	}

	const data = await response.json();
	return data.access_token;
}

/**
 * Generate timestamp for Mpesa API
 */
function generateTimestamp() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hour = String(now.getHours()).padStart(2, '0');
	const minute = String(now.getMinutes()).padStart(2, '0');
	const second = String(now.getSeconds()).padStart(2, '0');
	
	return `${year}${month}${day}${hour}${minute}${second}`;
}

/**
 * Generate password for Mpesa STK Push
 */
function generatePassword(timestamp) {
	const data = `${env.MPESA_BUSINESS_SHORT_CODE}${env.MPESA_PASSKEY}${timestamp}`;
	return Buffer.from(data).toString('base64');
}

/**
 * Initiate STK Push
 */
export async function initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc }) {
	try {
		const accessToken = await getAccessToken();
		const timestamp = generateTimestamp();
		const password = generatePassword(timestamp);

		// Format phone number (ensure it starts with 254)
		let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
		if (formattedPhone.startsWith('0')) {
			formattedPhone = '254' + formattedPhone.substring(1);
		} else if (!formattedPhone.startsWith('254')) {
			formattedPhone = '254' + formattedPhone;
		}

		const stkPushData = {
			BusinessShortCode: env.MPESA_BUSINESS_SHORT_CODE,
			Password: password,
			Timestamp: timestamp,
			TransactionType: 'CustomerPayBillOnline',
			Amount: Math.round(amount), // Ensure amount is integer
			PartyA: formattedPhone,
			PartyB: env.MPESA_BUSINESS_SHORT_CODE,
			PhoneNumber: formattedPhone,
			CallBackURL: env.MPESA_CALLBACK_URL,
			AccountReference: accountReference,
			TransactionDesc: transactionDesc
		};

		const response = await fetch(
			env.MPESA_ENVIRONMENT === 'production'
				? 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest'
				: 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify(stkPushData)
			}
		);

		const result = await response.json();
		
		if (!response.ok) {
			throw new Error(result.errorMessage || 'STK Push failed');
		}

		return {
			success: true,
			checkoutRequestId: result.CheckoutRequestID,
			merchantRequestId: result.MerchantRequestID,
			responseCode: result.ResponseCode,
			responseDescription: result.ResponseDescription
		};
	} catch (error) {
		console.error('STK Push error:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

/**
 * Query STK Push status
 */
export async function querySTKPushStatus(checkoutRequestId) {
	try {
		const accessToken = await getAccessToken();
		const timestamp = generateTimestamp();
		const password = generatePassword(timestamp);

		const queryData = {
			BusinessShortCode: env.MPESA_BUSINESS_SHORT_CODE,
			Password: password,
			Timestamp: timestamp,
			CheckoutRequestID: checkoutRequestId
		};

		const response = await fetch(
			env.MPESA_ENVIRONMENT === 'production'
				? 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query'
				: 'https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`
				},
				body: JSON.stringify(queryData)
			}
		);

		const result = await response.json();
		return result;
	} catch (error) {
		console.error('STK Push query error:', error);
		throw error;
	}
}

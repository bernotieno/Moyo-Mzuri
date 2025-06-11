import { env } from '$env/dynamic/private';

/**
 * Check if we're in development mode with invalid credentials
 */
function isDevelopmentMode() {
	// Check if we're using demo/placeholder credentials
	// Set to false to force real API calls (will fail with demo credentials)
	const isDemoCredentials = env.MPESA_CONSUMER_KEY === 'WI2DPxOphJoXSIPKuPqsAqon9yRAOKUSEuJkcZeA2q4ogoNu' ||
		env.MPESA_CALLBACK_URL?.includes('localhost') ||
		env.MPESA_CALLBACK_URL?.includes('placeholder-dev-url');

	// Temporarily disable development mode to test real API
	// return false; // Force real API calls (will fail with demo credentials)
	return isDemoCredentials;
}

/**
 * Get Mpesa access token
 */
async function getAccessToken() {
	// In development mode with demo credentials, skip actual API call
	if (isDevelopmentMode()) {
		console.log('Development mode: Using mock access token');
		return 'mock_access_token_for_development';
	}

	const auth = Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString('base64');

	const url = env.MPESA_ENVIRONMENT === 'production'
		? 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'
		: 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

	console.log('Requesting M-Pesa access token from:', url);
	console.log('Environment:', env.MPESA_ENVIRONMENT);
	console.log('Consumer Key:', env.MPESA_CONSUMER_KEY ? `${env.MPESA_CONSUMER_KEY.substring(0, 10)}...` : 'NOT SET');

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Basic ${auth}`
		}
	});

	if (!response.ok) {
		const errorText = await response.text();
		console.error('M-Pesa access token error:', {
			status: response.status,
			statusText: response.statusText,
			body: errorText
		});
		throw new Error(`Failed to get Mpesa access token: ${response.status} ${response.statusText} - ${errorText}`);
	}

	const data = await response.json();
	console.log('M-Pesa access token obtained successfully');
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
		// In development mode, return mock success response
		if (isDevelopmentMode()) {
			console.log('Development mode: Simulating STK Push for:', {
				phoneNumber,
				amount,
				accountReference,
				transactionDesc
			});

			return {
				success: true,
				checkoutRequestId: `DEV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
				merchantRequestId: `DEV_MERCHANT_${Date.now()}`,
				responseCode: '0',
				responseDescription: 'Development mode: STK Push simulation successful'
			};
		}

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
			console.error('STK Push API error:', result);
			throw new Error(result.errorMessage || `STK Push failed: ${response.status} ${response.statusText}`);
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
		// In development mode, return mock status
		if (isDevelopmentMode()) {
			console.log('Development mode: Simulating STK Push query for:', checkoutRequestId);

			return {
				ResponseCode: '0',
				ResponseDescription: 'Development mode: Query successful',
				MerchantRequestID: checkoutRequestId.replace('DEV_', 'DEV_MERCHANT_'),
				CheckoutRequestID: checkoutRequestId,
				ResultCode: '0',
				ResultDesc: 'Development mode: Transaction completed successfully'
			};
		}

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

		if (!response.ok) {
			console.error('STK Push query API error:', result);
		}

		return result;
	} catch (error) {
		console.error('STK Push query error:', error);
		throw error;
	}
}

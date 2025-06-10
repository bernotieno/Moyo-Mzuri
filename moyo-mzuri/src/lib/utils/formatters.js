/**
 * Format currency amount in Kenyan Shillings
 * @param {number} amount - The amount to format
 * @param {boolean} showCurrency - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, showCurrency = true) {
	if (isNaN(amount) || amount === null || amount === undefined) {
		return showCurrency ? 'KES 0' : '0';
	}

	const formatted = new Intl.NumberFormat('en-KE', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2
	}).format(amount);

	return showCurrency ? `KES ${formatted}` : formatted;
}

/**
 * Format date in a human-readable format
 * @param {Date|string} date - The date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
export function formatDate(date, includeTime = false) {
	if (!date) return '';

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	
	if (isNaN(dateObj.getTime())) {
		return '';
	}

	const options = {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	};

	if (includeTime) {
		options.hour = '2-digit';
		options.minute = '2-digit';
	}

	return new Intl.DateTimeFormat('en-KE', options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date|string} date - The date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(date) {
	if (!date) return '';

	const dateObj = typeof date === 'string' ? new Date(date) : date;
	
	if (isNaN(dateObj.getTime())) {
		return '';
	}

	const now = new Date();
	const diffInSeconds = Math.floor((now - dateObj) / 1000);

	if (diffInSeconds < 60) {
		return 'Just now';
	}

	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
	}

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
	}

	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
	}

	// For older dates, show the actual date
	return formatDate(dateObj);
}

/**
 * Calculate donation progress percentage
 * @param {number} raised - Amount raised
 * @param {number} target - Target amount
 * @returns {number} Progress percentage (0-100)
 */
export function calculateProgress(raised, target) {
	if (!target || target <= 0) return 0;
	if (!raised || raised <= 0) return 0;
	
	const percentage = (raised / target) * 100;
	return Math.min(percentage, 100); // Cap at 100%
}

/**
 * Format phone number for display
 * @param {string} phoneNumber - The phone number to format
 * @returns {string} Formatted phone number
 */
export function formatPhoneNumber(phoneNumber) {
	if (!phoneNumber) return '';

	// Remove all non-digits
	const cleaned = phoneNumber.replace(/\D/g, '');
	
	// Handle Kenyan numbers
	if (cleaned.startsWith('254')) {
		// Format as +254 7XX XXX XXX
		const formatted = cleaned.replace(/^254(\d{1})(\d{3})(\d{3})(\d{3})$/, '+254 $1$2 $3 $4');
		return formatted;
	} else if (cleaned.startsWith('0')) {
		// Format as 07XX XXX XXX
		const formatted = cleaned.replace(/^0(\d{1})(\d{3})(\d{3})(\d{3})$/, '0$1$2 $3 $4');
		return formatted;
	}

	return phoneNumber; // Return original if no pattern matches
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 100) {
	if (!text || text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
}

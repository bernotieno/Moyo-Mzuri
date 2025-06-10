/**
 * Validate phone number format (Kenyan numbers)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {object} Validation result with isValid and message
 */
export function validatePhoneNumber(phoneNumber) {
	if (!phoneNumber) {
		return { isValid: false, message: 'Phone number is required' };
	}

	// Remove all non-digits
	const cleaned = phoneNumber.replace(/\D/g, '');
	
	// Check for valid Kenyan mobile number patterns
	const patterns = [
		/^254[17]\d{8}$/, // 254 format
		/^0[17]\d{8}$/    // 0 format
	];

	const isValid = patterns.some(pattern => pattern.test(cleaned));
	
	if (!isValid) {
		return {
			isValid: false,
			message: 'Please enter a valid Kenyan mobile number (e.g., 0712345678 or 254712345678)'
		};
	}

	return { isValid: true, message: '' };
}

/**
 * Validate donation amount
 * @param {string|number} amount - Amount to validate
 * @param {number} minAmount - Minimum allowed amount
 * @param {number} maxAmount - Maximum allowed amount
 * @returns {object} Validation result with isValid and message
 */
export function validateAmount(amount, minAmount = 1, maxAmount = 1000000) {
	if (!amount && amount !== 0) {
		return { isValid: false, message: 'Amount is required' };
	}

	const numAmount = parseFloat(amount);
	
	if (isNaN(numAmount)) {
		return { isValid: false, message: 'Please enter a valid amount' };
	}

	if (numAmount < minAmount) {
		return { isValid: false, message: `Minimum amount is KES ${minAmount}` };
	}

	if (numAmount > maxAmount) {
		return { isValid: false, message: `Maximum amount is KES ${maxAmount.toLocaleString()}` };
	}

	// Check for reasonable decimal places (max 2)
	const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
	if (decimalPlaces > 2) {
		return { isValid: false, message: 'Amount cannot have more than 2 decimal places' };
	}

	return { isValid: true, message: '' };
}

/**
 * Validate project title
 * @param {string} title - Title to validate
 * @returns {object} Validation result with isValid and message
 */
export function validateProjectTitle(title) {
	if (!title || !title.trim()) {
		return { isValid: false, message: 'Project title is required' };
	}

	const trimmedTitle = title.trim();
	
	if (trimmedTitle.length < 3) {
		return { isValid: false, message: 'Project title must be at least 3 characters long' };
	}

	if (trimmedTitle.length > 100) {
		return { isValid: false, message: 'Project title cannot exceed 100 characters' };
	}

	return { isValid: true, message: '' };
}

/**
 * Validate project description
 * @param {string} description - Description to validate
 * @returns {object} Validation result with isValid and message
 */
export function validateProjectDescription(description) {
	if (!description || !description.trim()) {
		return { isValid: false, message: 'Project description is required' };
	}

	const trimmedDescription = description.trim();
	
	if (trimmedDescription.length < 10) {
		return { isValid: false, message: 'Project description must be at least 10 characters long' };
	}

	if (trimmedDescription.length > 1000) {
		return { isValid: false, message: 'Project description cannot exceed 1000 characters' };
	}

	return { isValid: true, message: '' };
}

/**
 * Validate target amount for projects
 * @param {string|number} amount - Target amount to validate
 * @returns {object} Validation result with isValid and message
 */
export function validateTargetAmount(amount) {
	if (!amount && amount !== 0) {
		return { isValid: false, message: 'Target amount is required' };
	}

	const numAmount = parseFloat(amount);
	
	if (isNaN(numAmount)) {
		return { isValid: false, message: 'Please enter a valid target amount' };
	}

	if (numAmount < 100) {
		return { isValid: false, message: 'Minimum target amount is KES 100' };
	}

	if (numAmount > 10000000) {
		return { isValid: false, message: 'Maximum target amount is KES 10,000,000' };
	}

	return { isValid: true, message: '' };
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {object} Validation result with isValid and message
 */
export function validateUrl(url, required = false) {
	if (!url || !url.trim()) {
		if (required) {
			return { isValid: false, message: 'URL is required' };
		}
		return { isValid: true, message: '' };
	}

	try {
		new URL(url.trim());
		return { isValid: true, message: '' };
	} catch {
		return { isValid: false, message: 'Please enter a valid URL' };
	}
}

/**
 * Validate admin password
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export function validateAdminPassword(password) {
	if (!password) {
		return { isValid: false, message: 'Password is required' };
	}

	if (password.length < 6) {
		return { isValid: false, message: 'Password must be at least 6 characters long' };
	}

	return { isValid: true, message: '' };
}

import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url }) {
	const adminPassword = env.ADMIN_PASSWORD || 'admin123';
	const isAuthenticated = cookies.get('admin-auth') === 'true';

	// If not authenticated and not on login page, redirect to login
	if (!isAuthenticated && url.pathname !== '/admin/login') {
		throw redirect(302, '/admin/login');
	}

	// If authenticated and on login page, redirect to dashboard
	if (isAuthenticated && url.pathname === '/admin/login') {
		throw redirect(302, '/admin');
	}

	return {
		isAuthenticated
	};
}

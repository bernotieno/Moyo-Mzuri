import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, cookies }) {
	try {
		const { password } = await request.json();
		const adminPassword = env.ADMIN_PASSWORD || 'admin123';

		if (!password) {
			return json(
				{
					success: false,
					error: 'Password is required'
				},
				{ status: 400 }
			);
		}

		if (password === adminPassword) {
			// Set authentication cookie
			cookies.set('admin-auth', 'true', {
				path: '/admin',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			return json({
				success: true,
				message: 'Login successful'
			});
		} else {
			return json(
				{
					success: false,
					error: 'Invalid password'
				},
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error('Login error:', error);
		return json(
			{
				success: false,
				error: 'Server error'
			},
			{ status: 500 }
		);
	}
}

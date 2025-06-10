import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies }) {
	try {
		// Clear authentication cookie
		cookies.delete('admin-auth', {
			path: '/admin'
		});

		return json({
			success: true,
			message: 'Logout successful'
		});
	} catch (error) {
		console.error('Logout error:', error);
		return json(
			{
				success: false,
				error: 'Server error'
			},
			{ status: 500 }
		);
	}
}

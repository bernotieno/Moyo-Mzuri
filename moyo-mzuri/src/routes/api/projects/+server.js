import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { projects } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	try {
		const allProjects = await db
			.select()
			.from(projects)
			.where(eq(projects.isActive, true))
			.orderBy(desc(projects.createdAt));

		return json({
			success: true,
			projects: allProjects
		});
	} catch (error) {
		console.error('Error fetching projects:', error);
		return json(
			{
				success: false,
				error: 'Failed to fetch projects'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	try {
		const { title, description, targetAmount, imageUrl } = await request.json();

		// Validate required fields
		if (!title || !description || !targetAmount) {
			return json(
				{
					success: false,
					error: 'Title, description, and target amount are required'
				},
				{ status: 400 }
			);
		}

		// Validate target amount
		if (isNaN(targetAmount) || targetAmount <= 0) {
			return json(
				{
					success: false,
					error: 'Target amount must be a positive number'
				},
				{ status: 400 }
			);
		}

		const newProject = await db
			.insert(projects)
			.values({
				title: title.trim(),
				description: description.trim(),
				targetAmount: parseFloat(targetAmount),
				imageUrl: imageUrl?.trim() || null,
				createdAt: new Date(),
				updatedAt: new Date()
			})
			.returning();

		return json({
			success: true,
			project: newProject[0]
		});
	} catch (error) {
		console.error('Error creating project:', error);
		return json(
			{
				success: false,
				error: 'Failed to create project'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function PUT({ request }) {
	try {
		const { id, title, description, targetAmount, imageUrl, isActive } = await request.json();

		// Validate required fields
		if (!id) {
			return json(
				{
					success: false,
					error: 'Project ID is required'
				},
				{ status: 400 }
			);
		}

		const updateData = {
			updatedAt: new Date()
		};

		if (title !== undefined) updateData.title = title.trim();
		if (description !== undefined) updateData.description = description.trim();
		if (targetAmount !== undefined) {
			if (isNaN(targetAmount) || targetAmount <= 0) {
				return json(
					{
						success: false,
						error: 'Target amount must be a positive number'
					},
					{ status: 400 }
				);
			}
			updateData.targetAmount = parseFloat(targetAmount);
		}
		if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;
		if (isActive !== undefined) updateData.isActive = Boolean(isActive);

		const updatedProject = await db
			.update(projects)
			.set(updateData)
			.where(eq(projects.id, id))
			.returning();

		if (updatedProject.length === 0) {
			return json(
				{
					success: false,
					error: 'Project not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			project: updatedProject[0]
		});
	} catch (error) {
		console.error('Error updating project:', error);
		return json(
			{
				success: false,
				error: 'Failed to update project'
			},
			{ status: 500 }
		);
	}
}

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ request }) {
	try {
		const { id } = await request.json();

		if (!id) {
			return json(
				{
					success: false,
					error: 'Project ID is required'
				},
				{ status: 400 }
			);
		}

		// Soft delete by setting isActive to false
		const deletedProject = await db
			.update(projects)
			.set({
				isActive: false,
				updatedAt: new Date()
			})
			.where(eq(projects.id, id))
			.returning();

		if (deletedProject.length === 0) {
			return json(
				{
					success: false,
					error: 'Project not found'
				},
				{ status: 404 }
			);
		}

		return json({
			success: true,
			message: 'Project deleted successfully'
		});
	} catch (error) {
		console.error('Error deleting project:', error);
		return json(
			{
				success: false,
				error: 'Failed to delete project'
			},
			{ status: 500 }
		);
	}
}

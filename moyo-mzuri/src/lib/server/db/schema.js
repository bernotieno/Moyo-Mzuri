import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

// Projects table - stores social projects that can receive donations
export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	targetAmount: real('target_amount').notNull(),
	totalRaised: real('total_raised').notNull().default(0),
	imageUrl: text('image_url'),
	isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
});

// Donations table - stores all donation transactions
export const donations = sqliteTable('donations', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id').notNull().references(() => projects.id),
	amount: real('amount').notNull(),
	phoneNumber: text('phone_number').notNull(),
	mpesaReceiptNumber: text('mpesa_receipt_number'),
	mpesaTransactionId: text('mpesa_transaction_id'),
	status: text('status').notNull().default('pending'), // pending, completed, failed
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
	completedAt: integer('completed_at', { mode: 'timestamp' })
});

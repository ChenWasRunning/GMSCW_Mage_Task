import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const progress = sqliteTable('progress', {
  identifierHash: text('identifier_hash').primaryKey(),
  completed: text('completed').notNull(),
  revision: integer('revision').notNull().default(1),
  updatedAt: text('updated_at').notNull(),
});

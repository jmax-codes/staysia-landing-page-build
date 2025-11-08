import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  city: text('city').notNull(),
  area: text('area').notNull(),
  type: text('type').notNull(),
  price: integer('price').notNull(),
  nights: integer('nights').notNull().default(2),
  rating: real('rating').notNull(),
  imageUrl: text('image_url').notNull(),
  isGuestFavorite: integer('is_guest_favorite', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
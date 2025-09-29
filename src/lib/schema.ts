import { pgTable, text, json } from 'drizzle-orm/pg-core';

export const AuthState = pgTable('auth_state', {
  key: text('key').primaryKey().unique(),
  state: json('state').notNull()
});

export const AuthSession = pgTable('auth_session', {
  key: text('key').primaryKey().unique(),
  session: json('session').notNull()
});

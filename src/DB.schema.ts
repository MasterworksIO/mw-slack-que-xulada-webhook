import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const acknowledgements = sqliteTable('acknowledgements', {
  id: integer('id').primaryKey(),

  from: text('from').notNull(),
  to: text('to').notNull(),
  channel: text('channel').notNull(),
  text: text('text').notNull(),

  apiAppId: text('api_app_id').notNull(),
  eventContext: text('event_context').notNull(),
  eventId: text('event_id').notNull(),
  eventTime: integer('event_time', { mode: 'timestamp' }).notNull(),
  teamId: text('team_id').notNull(),
})

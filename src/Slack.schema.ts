import { z } from 'zod'

export const ChallengeRequest = z.object({
  type: z.literal('url_verification'),

  token: z.string(),
  challenge: z.string(),
})

export const SubscriptionBase = z.object({
  api_app_id: z.string(),
  event_context: z.string(),
  event_id: z.string(),
  event_time: z.number(),
  team_id: z.string(),
  type: z.string(),
  token: z.string(),
})

export const MessageEventBase = z.object({
  type: z.literal('message'),

  channel: z.string(),
  hidden: z.boolean().optional(),
  ts: z.string(),
  event_ts: z.string(),
  channel_type: z.string(),
})

export const NewMessagePayload = MessageEventBase.extend({
  text: z.string(),
  user: z.string(),
})

export const MessageUpdatePayload = MessageEventBase.extend({
  subtype: z.literal('message_changed'),
})

export const BotMessagePayload = MessageEventBase.extend({
  bot_id: z.string(),
})

export const EventCallback = SubscriptionBase.extend({
  type: z.literal('event_callback'),
  event: z.union([MessageUpdatePayload, NewMessagePayload, BotMessagePayload]),
})

export const SubscriptionEvent = z.discriminatedUnion('type', [ChallengeRequest, EventCallback])

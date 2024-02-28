import { z } from 'zod'

export const ChallengeRequest = z.object({
  type: z.literal('url_verification'),

  token: z.string(),
  challenge: z.string(),
})

export const MessageEventBase = z.object({
  channel_type: z.string(),
  channel: z.string(),
  event_ts: z.string(),
  hidden: z.boolean().optional(),
  subtype: z.string().optional(),
  ts: z.string(),
  type: z.literal('message'),
})

export const NewMessagePayload = MessageEventBase.extend({
  text: z.string(),
  thread_ts: z.string().optional(),
  user: z.string(),
})

export const MessageUpdatePayload = MessageEventBase.extend({
  subtype: z.literal('message_changed'),
  hidden: z.boolean(),
  message: z.object({
    type: z.string(),
    text: z.string(),
    user: z.string().optional(),
    ts: z.string(),
    edited: z.object({
      ts: z.string(),
      user: z.string(),
    }).optional(),
    thread_ts: z.string().optional(),
  }),
  previous_message: z.object({
    type: z.string(),
    text: z.string(),
    ts: z.string(),
    user: z.string().optional(),
    edited: z.object({
      ts: z.string(),
      user: z.string(),
    }).optional(),
    thread_ts: z.string().optional(),
  }).optional(),
})

export const BotMessagePayload = MessageEventBase.extend({
  app_id: z.string(),
  bot_id: z.string(),
  subtype: z.literal('bot_message'),
  username: z.string(),
})

export const EventCallback = z.object({
  api_app_id: z.string(),
  context_enterprise_id: z.string().nullable(),
  context_team_id: z.string(),
  event_context: z.string(),
  event_id: z.string(),
  event_time: z.number(),
  event: z.union([MessageUpdatePayload, NewMessagePayload, BotMessagePayload]),
  is_ext_shared_channel: z.boolean(),
  team_id: z.string(),
  token: z.string(),
  type: z.literal('event_callback'),
})

export const SubscriptionEvent = z.discriminatedUnion('type', [ChallengeRequest, EventCallback])

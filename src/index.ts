import type { ExportedHandler } from '@cloudflare/workers-types'
import { drizzle } from 'drizzle-orm/d1'

import { SubscriptionEvent } from './Slack.schema.ts'
import { acknowledgements } from './DB.schema.ts'
import { addReaction } from './lib/addReaction.ts'
import { pickReaction } from './lib/pickReaction.ts'

type EnvironmentVariables = {
  SLACK_APP_OAUTH_TOKEN?: string
  WORKER_SLACK_LISTENER_PATHNAME?: string
  XULADA_DATABASE: D1Database
}

const KEYWORDS = [':taco:', ':burrito:'] as const

const getMentions = (text: string): string[] => {
  const matches = text.match(/<@([^>]+)>/g)
  if (!matches?.length) return []
  return matches.map((match) => match.slice(2, -1))
}

const Module: ExportedHandler<EnvironmentVariables> = {
  async fetch(request, env, ctx) {
    // We gotta respond 200 OK to Slack, even in most error cases, to avoid retries.
    // This is just to not type the same thing over and over.
    const OK = new Response('OK', { status: 200 })

    try {
      const url = new URL(request.url)

      if (url.pathname !== env.WORKER_SLACK_LISTENER_PATHNAME) {
        return new Response('Not Found', { status: 404 })
      }

      if (request.method !== 'POST' || request.headers.get('Content-Type') !== 'application/json') {
        return new Response('Bad Request', { status: 400 })
      }

      const payload = await request.json()
      const parsed = SubscriptionEvent.safeParse(payload)

      if (!parsed.success) {
        console.error('Malformed payload', payload, parsed.error)
        return OK
      }

      const { data } = parsed

      switch (data.type) {
        case 'url_verification':
          return new Response(data.challenge, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' },
          })
        case 'event_callback':
          if ('subtype' in data.event) {
            console.info('Ignoring message update', data.event_id)
            return OK
          }

          if ('bot_id' in data.event) {
            console.info('Ignoring message from bot', data.event_id)
            return OK
          }

          const { event } = data

          if (!KEYWORDS.some((keyword) => event.text.includes(keyword))) {
            console.info('Ignoring message without keywords', data.event_id)
            return OK
          }

          const receivers = getMentions(event.text)

          const values = receivers
            .map((receiver) => ({
              apiAppId: data.api_app_id,
              channel: event.channel,
              eventContext: data.event_context,
              eventId: data.event_id,
              eventTime: new Date(data.event_time * 1000),
              eventTs: event.event_ts,
              from: event.user,
              teamId: data.team_id,
              text: event.text,
              threadTs: event.thread_ts,
              to: receiver,
            }))
            .filter((value) => value.to !== value.from)

          if (!values.length) {
            console.info('Ignoring message without mentions', data.event_id)
            return OK
          }

          const result = await drizzle(env.XULADA_DATABASE)
            .insert(acknowledgements)
            .values(values)
            .returning()
            .all()

          console.info(`Inserted ${result.length} acknowledgements`)

          // We don't need to wait for this to finish to respond to Slack
          ctx.waitUntil(
            (async () => {
              try {
                await addReaction(env, {
                  channel: event.channel,
                  name: pickReaction(),
                  timestamp: event.ts,
                })
              } catch (err) {
                console.error(err)
              }
            })()
          )

          break
        default:
          console.warn('Unhandled event type', data)
      }

      return OK
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.stack : 'Internal Server Error'
      return new Response(message, { status: 500 })
    }
  },
}

export default Module

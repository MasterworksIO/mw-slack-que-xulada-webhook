import { z } from 'zod'

import ensureString from '../utils/ensureString'

const POSSIBLE_ERRORS = [
  'already_reacted',
  'bad_timestamp',
  'channel_not_found',
  'external_channel_migrating',
  'invalid_name',
  'is_archived',
  'message_not_found',
  'no_item_specified',
  'not_reactable',
  'thread_locked',
  'too_many_emoji',
  'too_many_reactions',
  'access_denied',
  'account_inactive',
  'deprecated_endpoint',
  'ekm_access_denied',
  'enterprise_is_restricted',
  'invalid_auth',
  'method_deprecated',
  'missing_scope',
  'not_allowed_token_type',
  'not_authed',
  'no_permission',
  'org_login_required',
  'token_expired',
  'token_revoked',
  'two_factor_setup_required',
  'team_access_not_granted',
  'accesslimited',
  'fatal_error',
  'internal_error',
  'invalid_arg_name',
  'invalid_arguments',
  'invalid_array_arg',
  'invalid_charset',
  'invalid_form_data',
  'invalid_post_type',
  'missing_post_type',
  'ratelimited',
  'request_timeout',
  'service_unavailable',
  'team_added_to_org',
] as const

const ResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true) }),
  z.object({ ok: z.literal(false), error: z.enum(POSSIBLE_ERRORS) }),
])

type ReactionOptions = {
  channel: string
  name: string
  timestamp: string
}

type Environment = {
  SLACK_APP_OAUTH_TOKEN?: string
}

export const addReaction = async (env: Environment, options: ReactionOptions): Promise<void> => {
  ensureString(env.SLACK_APP_OAUTH_TOKEN, 'SLACK_APP_OAUTH_TOKEN is required to add reaction')

  const response = await fetch('https://slack.com/api/reactions.add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.SLACK_APP_OAUTH_TOKEN}`,
    },
    body: JSON.stringify(options),
  })

  const data = ResponseSchema.parse(await response.json())

  if (!data.ok) {
    if (data.error === 'already_reacted') {
      return
    }

    if (data.error === 'invalid_name') {
      console.debug(`Selected reaction name is invalid: ${options.name}`)
    }

    throw new Error(`Failed to react to message: ${data.error}`)
  }
}

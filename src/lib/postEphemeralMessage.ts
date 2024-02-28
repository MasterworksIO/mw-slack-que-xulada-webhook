import { z } from 'zod'

import ensureString from '../utils/ensureString'

const POSSIBLE_ERRORS = [
  "channel_not_found",
  "invalid_blocks",
  "invalid_blocks_format",
  "is_archived",
  "message_limit_exceeded",
  "messages_tab_disabled",
  "msg_too_long",
  "no_text",
  "restricted_action",
  "too_many_attachments",
  "user_not_in_channel",
  "access_denied",
  "account_inactive",
  "deprecated_endpoint",
  "ekm_access_denied",
  "enterprise_is_restricted",
  "invalid_auth",
  "method_deprecated",
  "missing_scope",
  "not_allowed_token_type",
  "not_authed",
  "no_permission",
  "org_login_required",
  "token_expired",
  "token_revoked",
  "two_factor_setup_required",
  "team_access_not_granted",
  "accesslimited",
  "fatal_error",
  "internal_error",
  "invalid_arg_name",
  "invalid_arguments",
  "invalid_array_arg",
  "invalid_charset",
  "invalid_form_data",
  "invalid_post_type",
  "missing_post_type",
  "ratelimited",
  "request_timeout",
  "service_unavailable",
  "team_added_to_org"
] as const

const ResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), message_ts: z.string() }),
  z.object({ ok: z.literal(false), error: z.enum(POSSIBLE_ERRORS) }),
])

type Message = {
  channel: string
  text: string
  thread_ts?: string
  user: string
}

type Environment = {
  SLACK_APP_OAUTH_TOKEN?: string
}

export const postEphemeralMessage = async (env: Environment, message: Message): Promise<void> => {
  ensureString(env.SLACK_APP_OAUTH_TOKEN, 'SLACK_APP_OAUTH_TOKEN is required to add reaction')

  console.log(message)

  const response = await fetch('https://slack.com/api/chat.postEphemeral', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.SLACK_APP_OAUTH_TOKEN}`,
    },
    body: JSON.stringify(message),
  })

  const data = ResponseSchema.parse(await response.json())

  if (!data.ok) {
    throw new Error(`Failed to send ephemeral message: ${data.error}`)
  }
}

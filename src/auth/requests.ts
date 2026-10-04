import { redirectUri } from './flow'
import type { DuckerConfig, DuckerProfile } from './types'

const REQUEST_TIMEOUT_MS = 15_000

/** Exchanges the code for a token. Public client -- there is no client_secret. */
export async function exchangeCode(
  config: DuckerConfig,
  code: string,
  verifier: string,
): Promise<{ accessToken: string }> {
  const response = await fetch(new URL('/oauth/token', config.issuer), {
    method: 'POST',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      code_verifier: verifier,
      redirect_uri: redirectUri(),
      client_id: config.clientId,
    }),
  })
  if (!response.ok) throw new Error(`token_exchange_failed_${response.status}`)
  const data = (await response.json()) as { access_token?: unknown }
  if (typeof data.access_token !== 'string' || !data.access_token) throw new Error('token_missing')
  return { accessToken: data.access_token }
}

export async function fetchProfile(config: DuckerConfig, accessToken: string): Promise<DuckerProfile> {
  const response = await fetch(new URL('/oauth/userinfo', config.issuer), {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`userinfo_failed_${response.status}`)
  const data: unknown = await response.json().catch(() => null)
  if (!isProfile(data)) throw new Error('userinfo_invalid')
  return data
}

const optionalString = (v: unknown) => v === undefined || v === null || typeof v === 'string'

/** A malformed userinfo must end signed-out, never crash rendering. */
function isProfile(data: unknown): data is DuckerProfile {
  if (typeof data !== 'object' || data === null) return false
  const p = data as Record<string, unknown>
  return (
    typeof p.sub === 'string' &&
    p.sub !== '' &&
    optionalString(p.name) &&
    optionalString(p.email) &&
    optionalString(p.picture) &&
    (p.email_verified === undefined || typeof p.email_verified === 'boolean')
  )
}

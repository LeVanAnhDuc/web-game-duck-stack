// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { exchangeCode, fetchProfile } from './requests'

const config = {
  issuer: 'http://localhost:3000',
  clientId: 'game-client',
  scope: 'openid',
  profileUrl: 'http://localhost:3000/profile',
}

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

function stub(response: Response) {
  const fetchMock = vi.fn(async (..._args: [URL, RequestInit]) => response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => vi.unstubAllGlobals())

describe('exchangeCode', () => {
  it('posts the PKCE form (no client_secret) to /oauth/token with an abort signal', async () => {
    const fetchMock = stub(json({ access_token: 'at-1' }))
    await expect(exchangeCode(config, 'code-1', 'verifier-1')).resolves.toEqual({ accessToken: 'at-1' })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('http://localhost:3000/oauth/token')
    expect(init.method).toBe('POST')
    expect(init.signal).toBeInstanceOf(AbortSignal)
    const body = init.body as URLSearchParams
    expect(body.get('grant_type')).toBe('authorization_code')
    expect(body.get('code')).toBe('code-1')
    expect(body.get('code_verifier')).toBe('verifier-1')
    expect(body.get('redirect_uri')).toMatch(/^http:\/\/localhost(:\d+)?\//)
    expect(body.get('client_id')).toBe('game-client')
    expect(body.has('client_secret')).toBe(false)
  })

  it('throws on a non-ok response', async () => {
    stub(json({}, 400))
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow('token_exchange_failed_400')
  })

  it.each([{}, { access_token: 123 }, { access_token: '' }])('throws when access_token is not a string (%o)', async (body) => {
    stub(json(body))
    await expect(exchangeCode(config, 'c', 'v')).rejects.toThrow('token_missing')
  })
})

describe('fetchProfile', () => {
  it('sends the bearer token with an abort signal and returns the profile', async () => {
    const fetchMock = stub(json({ sub: 'u1', name: 'Duc' }))
    await expect(fetchProfile(config, 'at-1')).resolves.toEqual({ sub: 'u1', name: 'Duc' })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('http://localhost:3000/oauth/userinfo')
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer at-1')
    expect(init.signal).toBeInstanceOf(AbortSignal)
  })

  it('accepts a minimal { sub } profile', async () => {
    stub(json({ sub: 'u1' }))
    await expect(fetchProfile(config, 't')).resolves.toEqual({ sub: 'u1' })
  })

  it.each([null, { sub: '' }, { sub: 'u1', name: 5 }, { sub: 'u1', email: {} }, { sub: 'u1', picture: 1 }, { sub: 'u1', email_verified: 'yes' }, 'text'])(
    'throws userinfo_invalid for %o',
    async (body) => {
      stub(json(body))
      await expect(fetchProfile(config, 't')).rejects.toThrow('userinfo_invalid')
    },
  )

  it('throws on a non-ok response', async () => {
    stub(json({}, 401))
    await expect(fetchProfile(config, 't')).rejects.toThrow('userinfo_failed_401')
  })
})

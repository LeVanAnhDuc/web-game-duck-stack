import { afterEach, describe, expect, it, vi } from 'vitest'
import { exchangeCode, fetchProfile } from './requests'

const config = {
  issuer: 'http://localhost:3000',
  clientId: 'c',
  scope: 'openid',
  profileUrl: 'http://localhost:3000/profile',
}

describe('requests', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('passes an abort signal (timeout) to both fetches', async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ access_token: 't', sub: 'u' })))
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('window', { location: { origin: 'http://localhost:5173' } })
    await exchangeCode(config, 'c', 'v')
    await fetchProfile(config, 't')
    for (const call of fetchMock.mock.calls) {
      expect((call as unknown as [unknown, RequestInit])[1].signal).toBeInstanceOf(AbortSignal)
    }
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})

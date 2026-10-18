/**
 * PKCE (RFC 7636) -- what replaces a client_secret in an app that runs entirely in
 * the browser. The verifier is minted per sign-in, lives for seconds and is used
 * once, so leaking one spoils that attempt only.
 */

const VERIFIER_BYTES = 32

function toBase64Url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes))
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Random base64url string -- used for the code_verifier and for state. */
export function randomUrlSafeToken(): string {
  return toBase64Url(crypto.getRandomValues(new Uint8Array(VERIFIER_BYTES)).buffer)
}

/** challenge = BASE64URL(SHA256(ASCII(verifier))) -- method S256. */
export async function challengeOf(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return toBase64Url(digest)
}

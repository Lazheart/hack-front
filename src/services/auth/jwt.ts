export type JwtPayload = Record<string, unknown>

function base64UrlDecode(input: string): string {
  // convert from base64url to base64
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  // pad with '='
  const pad = base64.length % 4
  if (pad) base64 += '='.repeat(4 - pad)
  try {
    return atob(base64)
  } catch {
    throw new Error('Failed to decode base64url string')
  }
}

export function decodeJwt<T extends JwtPayload = JwtPayload>(token: string): T | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length < 2) return null
  const payload = parts[1]
  try {
    const json = base64UrlDecode(payload)
    return JSON.parse(json) as T
  } catch {
    return null
  }
}

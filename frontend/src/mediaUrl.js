import { apiBaseUrl } from './api.js'

export function mediaUrl(value) {
  const source = String(value ?? '').trim()
  if (!source || source.includes('\\')) return ''
  if (source.startsWith('/') && !source.startsWith('//')) return source

  try {
    const url = new URL(source)
    if (!['http:', 'https:'].includes(url.protocol)) return ''

    if (
      url.pathname.startsWith('/storage/')
      && ['localhost', '127.0.0.1'].includes(url.hostname)
    ) {
      return `${apiBaseUrl}${url.pathname}${url.search}${url.hash}`
    }

    return url.href
  } catch {
    return ''
  }
}

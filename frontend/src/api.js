export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  const token = sessionStorage.getItem('admin-token')
  if (token && path !== '/admin/login') {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(new Error('The server took too long to respond.')), 20000)
  const onAbort = () => controller.abort(options.signal.reason)
  options.signal?.addEventListener('abort', onAbort, { once: true })

  try {
    if (options.signal?.aborted) onAbort()
    const response = await fetch(`${apiBaseUrl}/api${path}`, {
      ...options,
      signal: controller.signal,
      headers,
    })
    const payload = response.status === 204 ? {} : await response.json()

    if (!response.ok) {
      throw new ApiError(payload.message ?? 'The request could not be completed.', response.status, payload)
    }

    return payload
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted) {
      throw new Error('The server took too long to respond. Check your connection and try again.')
    }
    throw error
  } finally {
    clearTimeout(timeout)
    options.signal?.removeEventListener('abort', onAbort)
  }
}

export function jsonBody(value) {
  return JSON.stringify(value)
}

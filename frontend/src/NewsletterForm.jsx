import { useState } from 'react'
import { api, jsonBody } from './api.js'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ loading: false, error: '', message: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '', message: '' })

    try {
      const response = await api('/subscribers', {
        method: 'POST',
        body: jsonBody({ email }),
      })
      setEmail('')
      setStatus({ loading: false, error: '', message: response.message })
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label className="sr-only" htmlFor="newsletter-email">Email address</label>
      <div className="newsletter-input-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email address"
          maxLength={255}
          required
        />
        <button type="submit" disabled={status.loading}>
          {status.loading ? 'Subscribing…' : 'Subscribe'}
        </button>
      </div>
      {status.error && <p className="newsletter-error" role="alert">{status.error}</p>}
      {status.message && <p className="newsletter-success" role="status">{status.message}</p>}
    </form>
  )
}

import { useState } from 'react'
import { api, jsonBody } from './api.js'

export default function LeadForm({
  initialType = 'contact',
  eyebrow,
  title,
  intro,
  submitLabel,
}) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState({ loading: false, error: '', success: '' })

  async function submit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '', success: '' })

    try {
      const result = await api('/leads', {
        method: 'POST',
        body: jsonBody({ ...values, type: initialType }),
      })
      setValues((current) => ({ ...current, name: '', email: '', phone: '', message: '' }))
      setStatus({ loading: false, error: '', success: result.message })
    } catch (error) {
      setStatus({ loading: false, error: error.message, success: '' })
    }
  }

  function update(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <section className="lead-form-section" id="appointment">
      <div className="lead-form-card">
        <div className="eyebrow">{eyebrow || (initialType === 'appointment' ? 'Start your journey' : 'We are here to help')}</div>
        <h2 className="section-title">{title || (initialType === 'appointment' ? 'Request an appointment' : 'Talk to our care team')}</h2>
        {intro && <p>{intro}</p>}
        <form className="lead-form" onSubmit={submit}>
          <input type="hidden" name="type" value={initialType} />
          <label>
            Your name
            <input name="name" autoComplete="name" value={values.name} onChange={update} required maxLength={120} />
          </label>
          <div className="lead-form-row">
            <label>
              Email
              <input name="email" type="email" autoComplete="email" value={values.email} onChange={update} maxLength={255} />
            </label>
            <label>
              Phone
              <input name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={update} maxLength={40} />
            </label>
          </div>
          <label>
            How can we help?
            <textarea name="message" value={values.message} onChange={update} rows="4" maxLength={5000} />
          </label>
          <p className="lead-form-note">Please provide an email address or phone number so our team can reach you.</p>
          {status.error && <p className="form-message form-error" role="alert">{status.error}</p>}
          {status.success && <p className="form-message form-success" role="status">{status.success}</p>}
          <button className="button button-primary" type="submit" disabled={status.loading}>
            {status.loading ? 'Sending…' : (submitLabel || 'Send request')}
          </button>
        </form>
      </div>
    </section>
  )
}

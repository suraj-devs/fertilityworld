import { useState } from 'react'

function Contact() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    setIsSending(true)
    setStatus({ type: '', message: '' })

    const form = new FormData(formElement)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          message: form.get('message'),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to send your message.')
      setStatus({ type: 'success', message: result.message })
      formElement.reset()
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="container py-5">
      <div className="row g-4 align-items-start">
        <div className="col-lg-5">
          <p className="text-uppercase fw-semibold mb-2">Get in touch</p>
          <h1 className="display-5 fw-semibold mb-3">Contact Fertility World</h1>
          <p className="lead">
            Our care team is here to answer your questions and help you take the
            next step with confidence.
          </p>
          <div className="mt-4">
            <p><strong>Phone:</strong> <a href="tel:+918743987787">+91 874 398 7787</a></p>
            <p><strong>Email:</strong> <a href="mailto:surajsh64@gmail.com">surajsh64@gmail.com</a></p>
            <p><strong>Address:</strong> Fertility World, Sector 44, Gurugram, Haryana, India</p>
          </div>
        </div>
        <div className="col-lg-6 offset-lg-1">
          <form className="p-4 border rounded-3" onSubmit={handleSubmit}>
            <h2 className="h3 mb-4">Send us a message</h2>
            <div className="mb-3">
              <label className="form-label" htmlFor="contact-name">Name</label>
              <input className="form-control" id="contact-name" name="name" type="text" required />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="contact-email">Email</label>
              <input className="form-control" id="contact-email" name="email" type="email" required />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="contact-message">Message</label>
              <textarea className="form-control" id="contact-message" name="message" rows="5" required />
            </div>
            <button className="callaction px-4 py-2 rounded-3 border-0" type="submit" disabled={isSending}>
              {isSending ? 'Sending...' : 'Send message'}
            </button>
            {status.message ? <p className={`mt-3 mb-0 ${status.type === 'success' ? 'text-success' : 'text-danger'}`} role="status">{status.message}</p> : null}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
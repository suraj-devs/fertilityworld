function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } })
}

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character])
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname !== '/api/contact') {
      return new Response(null, { status: 404 })
    }

    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, 405)
    }

    let body
    try {
      body = await request.json()
    } catch {
      return json({ success: false, error: 'Please submit a valid form.' }, 400)
    }

    const name = clean(body.name, 100)
    const email = clean(body.email, 160)
    const message = clean(body.message, 2000)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!name || !emailPattern.test(email) || !message) {
      return json({ success: false, error: 'Please provide a valid name, email and message.' }, 400)
    }

    if (!env.CONTACT_TO || !env.CONTACT_FROM) {
      return json({ success: false, error: 'Email delivery is not configured yet.' }, 503)
    }

    try {
      await env.EMAIL.send({
        to: env.CONTACT_TO,
        from: env.CONTACT_FROM,
        replyTo: email,
        subject: `New Fertility World enquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `<h2>New Fertility World enquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Message:</strong></p><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
      })
    } catch (error) {
      console.error('Contact email failed', error?.code, error?.message)
      return json({ success: false, error: 'We could not send your message. Please try again or call us.' }, 502)
    }

    return json({ success: true, message: 'Thank you. Our care team will contact you soon.' })
  },
}
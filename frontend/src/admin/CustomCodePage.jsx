import { useEffect, useState } from 'react'
import { api, jsonBody } from '../api.js'
import CustomCodeFields from './CustomCodeFields.jsx'

const emptyCode = {
  global_head_code: '',
  global_footer_code: '',
  global_custom_css: '',
}

function ErrorMessage({ children }) {
  return children ? <p className="admin-error" role="alert">{children}</p> : null
}

export default function CustomCodePage() {
  const [values, setValues] = useState(emptyCode)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    api('/admin/custom-code')
      .then((response) => setValues((current) => ({ ...current, ...response.custom_code })))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  function updateValue(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function saveCode(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api('/admin/custom-code', {
        method: 'PUT',
        body: jsonBody(values),
      })
      setMessage(response.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading custom code…</p>

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Advanced settings</p><h1>Custom code</h1></div>
      </div>
      <p>Manage scripts, tags, schema, and styles that are shared across the public site.</p>
      <p className="admin-warning">Only add code from sources you trust. Custom scripts run for every public visitor.</p>
      <ErrorMessage>{error}</ErrorMessage>
      {message && <p className="admin-success" role="status">{message}</p>}
      <form className="admin-form" onSubmit={saveCode}>
        <CustomCodeFields values={values} onChange={updateValue} global />
        <div className="admin-save-row">
          <button className="button button-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save custom code'}
          </button>
        </div>
      </form>
    </section>
  )
}

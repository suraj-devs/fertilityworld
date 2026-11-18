import { useState } from 'react'
import { api } from '../api.js'
import { mediaUrl } from '../mediaUrl.js'

export default function ImageUploadField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const previewUrl = mediaUrl(value)

  async function upload(event) {
    const image = event.target.files?.[0]
    if (!image) return

    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('image', image)
      const response = await api('/admin/uploads/content-image', { method: 'POST', body })
      onChange(response.url)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="admin-image-field">
      <label>{label}<input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder="Paste an image URL or upload a file" maxLength={2048} /></label>
      <label className="button button-outline blog-upload-button">
        {uploading ? 'Uploading…' : 'Upload image'}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={uploading} />
      </label>
      <span className="admin-field-help">JPG, PNG, or WebP; maximum 5 MB.</span>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {previewUrl && <img className="admin-image-preview" src={previewUrl} alt="" />}
    </div>
  )
}

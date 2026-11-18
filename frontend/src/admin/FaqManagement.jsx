import { useEffect, useState } from 'react'
import { api, jsonBody } from '../api.js'

function ErrorMessage({ children }) {
  return children ? <p className="admin-error" role="alert">{children}</p> : null
}

function emptyCollection() {
  return {
    title: '',
    intro: '',
    items: [{ question: '', answer: '' }],
    is_published: true,
  }
}

export default function FaqManagement() {
  const [collections, setCollections] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [form, setForm] = useState(emptyCollection)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let active = true
    api('/admin/faq-collections')
      .then((response) => {
        if (active) setCollections(response.collections)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  function startNew() {
    setSelectedId(null)
    setForm(emptyCollection())
    setError('')
    setMessage('')
  }

  function editCollection(collection) {
    setSelectedId(collection.id)
    setForm({
      title: collection.title,
      intro: collection.intro ?? '',
      items: collection.items,
      is_published: Boolean(collection.is_published),
    })
    setError('')
    setMessage('')
  }

  function updateItem(index, field, value) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }))
  }

  function moveItem(index, offset) {
    setForm((current) => {
      const destination = index + offset
      if (destination < 0 || destination >= current.items.length) return current
      const items = [...current.items]
      ;[items[index], items[destination]] = [items[destination], items[index]]
      return { ...current, items }
    })
  }

  async function saveCollection(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api(selectedId
        ? `/admin/faq-collections/${selectedId}`
        : '/admin/faq-collections', {
        method: selectedId ? 'PUT' : 'POST',
        body: jsonBody(form),
      })
      const saved = response.collection
      setCollections((current) => {
        const existing = current.find((item) => item.id === saved.id)
        const collection = {
          ...saved,
          page_sections_count: saved.page_sections_count ?? existing?.page_sections_count ?? 0,
        }
        return existing
          ? current.map((item) => item.id === saved.id ? collection : item)
          : [...current, collection].sort((a, b) => a.title.localeCompare(b.title))
      })
      setSelectedId(saved.id)
      setForm({
        title: saved.title,
        intro: saved.intro ?? '',
        items: saved.items,
        is_published: Boolean(saved.is_published),
      })
      setMessage('FAQ module saved.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteCollection(collection) {
    if (!window.confirm(`Delete "${collection.title}"? It must be removed from its pages first.`)) return

    setError('')
    setMessage('')
    try {
      await api(`/admin/faq-collections/${collection.id}`, { method: 'DELETE' })
      setCollections((current) => current.filter((item) => item.id !== collection.id))
      if (selectedId === collection.id) startNew()
      setMessage('FAQ module deleted.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Reusable content</p><h1>FAQ library</h1></div>
        <button className="button button-primary" type="button" onClick={startNew}>Create FAQ module</button>
      </div>
      <p>Create question-and-answer groups once, then add the same module to any page.</p>
      <ErrorMessage>{error}</ErrorMessage>
      {message && <p className="admin-success" role="status">{message}</p>}

      <div className="faq-manager-layout">
        <aside className="admin-card faq-manager-list" aria-label="Saved FAQ modules">
          <h2>Saved modules</h2>
          {loading && <p>Loading FAQ modules…</p>}
          {!loading && collections.length === 0 && <p>No FAQ modules yet. Create one to get started.</p>}
          {collections.map((collection) => (
            <article className={`faq-manager-item${selectedId === collection.id ? ' selected' : ''}`} key={collection.id}>
              <button type="button" className="faq-manager-select" onClick={() => editCollection(collection)}>
                <strong>{collection.title}</strong>
                <span>{collection.is_published ? 'Published' : 'Draft'} · {collection.items.length} questions</span>
                <span>Used in {collection.page_sections_count} page section{collection.page_sections_count === 1 ? '' : 's'}</span>
              </button>
              <button type="button" className="text-button danger-text" onClick={() => deleteCollection(collection)}>Delete</button>
            </article>
          ))}
        </aside>

        <form className="admin-form admin-card faq-manager-editor" onSubmit={saveCollection}>
          <div className="admin-heading-row">
            <div>
              <p className="eyebrow">{selectedId ? 'Edit saved content' : 'New reusable content'}</p>
              <h2>{selectedId ? 'Edit FAQ module' : 'Create FAQ module'}</h2>
            </div>
            <label className="admin-checkbox">
              <input type="checkbox" checked={Boolean(form.is_published)} onChange={(event) => setForm((current) => ({ ...current, is_published: event.target.checked }))} />
              Published
            </label>
          </div>
          <label>
            Module name
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} maxLength={180} required placeholder="For example, IVF treatment FAQs" />
          </label>
          <label>
            Introduction (optional)
            <textarea value={form.intro} onChange={(event) => setForm((current) => ({ ...current, intro: event.target.value }))} maxLength={2000} rows="3" placeholder="A short introduction shown above the questions" />
          </label>

          <div className="faq-manager-questions">
            <div className="admin-heading-row">
              <h3>Questions and answers</h3>
              <button type="button" className="button button-outline" onClick={() => setForm((current) => ({ ...current, items: [...current.items, { question: '', answer: '' }] }))}>Add question</button>
            </div>
            {form.items.map((item, index) => (
              <article className="block-list-item" key={index}>
                <div className="admin-heading-row">
                  <strong>Question {index + 1}</strong>
                  <div className="admin-inline-actions">
                    <button type="button" className="text-button" aria-label={`Move question ${index + 1} up`} disabled={index === 0} onClick={() => moveItem(index, -1)}>↑</button>
                    <button type="button" className="text-button" aria-label={`Move question ${index + 1} down`} disabled={index === form.items.length - 1} onClick={() => moveItem(index, 1)}>↓</button>
                    <button type="button" className="text-button danger-text" disabled={form.items.length === 1} onClick={() => setForm((current) => ({ ...current, items: current.items.filter((_, itemIndex) => itemIndex !== index) }))}>Remove</button>
                  </div>
                </div>
                <label>
                  Question
                  <input value={item.question} onChange={(event) => updateItem(index, 'question', event.target.value)} maxLength={255} required />
                </label>
                <label>
                  Answer
                  <textarea value={item.answer} onChange={(event) => updateItem(index, 'answer', event.target.value)} maxLength={5000} rows="4" required />
                </label>
              </article>
            ))}
          </div>

          <div className="admin-save-row">
            <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save FAQ module'}</button>
            <p>Published modules are available to add to any page. Updates appear everywhere the module is used.</p>
          </div>
        </form>
      </div>
    </section>
  )
}

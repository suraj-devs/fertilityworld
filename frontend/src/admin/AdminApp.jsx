import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Outlet, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { api, jsonBody } from '../api.js'
import SectionFields from './SectionFields.jsx'
import { VisualContentEditor } from '../RichContent.jsx'
import { createSection, sectionTypes } from '../sectionBlocks.js'
import { BlogEditor, BlogList } from './BlogManagement.jsx'
import FaqManagement from './FaqManagement.jsx'
import CustomCodeFields from './CustomCodeFields.jsx'
import CustomCodePage from './CustomCodePage.jsx'

function ErrorMessage({ children }) {
  return children ? <p className="admin-error" role="alert">{children}</p> : null
}

function AdminLogin({ onLogin }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await api('/admin/login', { method: 'POST', body: jsonBody(values) })
      sessionStorage.setItem('admin-token', result.token)
      onLogin()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-login-page">
      <form className="admin-card admin-login-card" onSubmit={submit}>
        <p className="eyebrow">We Care Fertility</p>
        <h1>Admin sign in</h1>
        <label>Email<input type="email" autoComplete="username" value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} required /></label>
        <ErrorMessage>{error}</ErrorMessage>
        <button className="button button-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </main>
  )
}

function AdminLayout({ onLogout }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  async function logout() {
    setError('')
    try {
      await api('/admin/logout', { method: 'POST' })
      sessionStorage.removeItem('admin-token')
      onLogout()
      navigate('/admin/login', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">We Care <span>CMS</span></a>
        <nav aria-label="Admin navigation">
          <NavLink to="/admin/pages">Pages &amp; sections</NavLink>
          <NavLink to="/admin/faqs">FAQ library</NavLink>
          <NavLink to="/admin/blog">Blog posts</NavLink>
          <NavLink to="/admin/menu">Navigation menus</NavLink>
          <NavLink to="/admin/settings">Shared sections</NavLink>
          <NavLink to="/admin/custom-code">Custom code</NavLink>
          <NavLink to="/admin/leads">Contact requests</NavLink>
          <NavLink to="/admin/subscribers">Newsletter subscribers</NavLink>
        </nav>
        <button className="admin-logout" type="button" onClick={logout}>Sign out</button>
      </aside>
      <main className="admin-main">
        <ErrorMessage>{error}</ErrorMessage>
        <Outlet />
      </main>
    </div>
  )
}

function PageList() {
  const [pages, setPages] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api('/admin/pages')
      .then((response) => setPages(response.pages))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  async function removePage(page) {
    if (!window.confirm(`Delete "${page.title}" and its sections?`)) return

    try {
      await api(`/admin/pages/${page.id}`, { method: 'DELETE' })
      setPages((current) => current.filter((item) => item.id !== page.id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Content</p><h1>Pages &amp; sections</h1></div>
        <Link className="button button-primary" to="/admin/pages/new">Create page</Link>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? <p>Loading pages…</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Page</th><th>URL</th><th>Sections</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td>{page.title}</td>
                  <td>/{page.slug === 'home' ? '' : page.slug}</td>
                  <td>{page.sections.length}</td>
                  <td><span className={page.is_published ? 'status-pill published' : 'status-pill'}>{page.is_published ? 'Published' : 'Draft'}</span></td>
                  <td className="admin-actions">
                    <Link to={`/admin/pages/${page.id}`}>Edit</Link>
                    <button type="button" className="text-button danger-text" onClick={() => removePage(page)}>Delete</button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && <tr><td colSpan="5">No pages yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function emptyPage() {
  return {
    title: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    custom_head_code: '',
    custom_footer_code: '',
    custom_css: '',
    is_published: false,
    sections: [],
  }
}

function PageEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'
  const [page, setPage] = useState(emptyPage)
  const [loadedFor, setLoadedFor] = useState(isNew ? 'new' : null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [sectionTemplate, setSectionTemplate] = useState('text')
  const [faqCollections, setFaqCollections] = useState([])
  const [faqError, setFaqError] = useState('')

  useEffect(() => {
    let active = true
    api('/admin/faq-collections')
      .then((response) => {
        if (active) setFaqCollections(response.collections)
      })
      .catch((requestError) => {
        if (active) setFaqError(requestError.message)
      })

    if (isNew) return () => { active = false }

    api(`/admin/pages/${id}`)
      .then((response) => {
        if (active) {
          setPage(response.page)
          setError('')
          setLoadedFor(id)
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError.message)
          setLoadedFor(id)
        }
      })

    return () => { active = false }
  }, [id, isNew])

  function updatePage(field, value) {
    setPage((current) => ({ ...current, [field]: value }))
  }

  function updateSection(index, field, value) {
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, [field]: value } : section
      )),
    }))
  }

  function moveSection(index, offset) {
    setPage((current) => {
      const sections = [...current.sections]
      const destination = index + offset
      if (destination < 0 || destination >= sections.length) return current
      ;[sections[index], sections[destination]] = [sections[destination], sections[index]]
      return { ...current, sections }
    })
  }

  function changeSectionType(index, type) {
    const section = page.sections[index]
    if (section.type !== type && !window.confirm('Changing the section type replaces its current content. Continue?')) return

    const replacement = createSection(type)
    setPage((current) => ({
      ...current,
      sections: current.sections.map((item, sectionIndex) => (
        sectionIndex === index
          ? { ...replacement, id: item.id, is_visible: Boolean(item.is_visible) }
          : item
      )),
    }))
  }

  async function savePage(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const body = {
      ...page,
      sections: page.sections.map((section) => ({
        id: section.id,
        heading: section.heading,
        type: section.type,
        content: section.content,
        faq_collection_id: section.faq_collection_id ?? null,
        is_visible: Boolean(section.is_visible),
      })),
    }

    try {
      const response = await api(isNew ? '/admin/pages' : `/admin/pages/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        body: jsonBody(body),
      })
      navigate(`/admin/pages/${response.page.id}`, { replace: true })
      setPage(response.page)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && loadedFor !== id) return <p>Loading page…</p>

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Content editor</p><h1>{isNew ? 'Create page' : 'Edit page'}</h1></div>
        <Link to="/admin/pages">Back to pages</Link>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      <form className="admin-form" onSubmit={savePage}>
        <div className="admin-card admin-field-grid">
          <label>Page title<input value={page.title} onChange={(event) => updatePage('title', event.target.value)} required maxLength={180} /></label>
          <label>URL slug<input value={page.slug} onChange={(event) => updatePage('slug', event.target.value.toLowerCase().replace(/\s+/g, '-'))} required maxLength={160} placeholder="services/new-treatment" /></label>
          <label>SEO title<input value={page.seo_title ?? ''} onChange={(event) => updatePage('seo_title', event.target.value)} maxLength={255} /></label>
          <label>SEO description<textarea value={page.seo_description ?? ''} onChange={(event) => updatePage('seo_description', event.target.value)} maxLength={500} rows="3" /></label>
          <label className="admin-checkbox"><input type="checkbox" checked={Boolean(page.is_published)} onChange={(event) => updatePage('is_published', event.target.checked)} /> Published</label>
        </div>

        <CustomCodeFields values={page} onChange={updatePage} />

        <div className="admin-heading-row section-editor-heading">
          <h2>Page sections ({page.sections.length})</h2>
          <div className="section-add-controls">
            <label>
              New section type
              <select value={sectionTemplate} onChange={(event) => setSectionTemplate(event.target.value)}>
                {sectionTypes.filter((type) => type.value !== 'html').map((type) => (
                  <option value={type.value} key={type.value}>{type.label}</option>
                ))}
              </select>
            </label>
          <button
            type="button"
            className="button button-outline"
            onClick={() => updatePage('sections', [...page.sections, createSection(sectionTemplate)])}
          >
            Add section
          </button>
          </div>
        </div>

        {page.sections.map((section, index) => (
          <article className="admin-card section-editor-card" key={section.id ?? `new-${index}`}>
            <div className="section-editor-toolbar">
              <div className="section-fields-heading">
                <label>Section heading<input value={section.heading ?? ''} onChange={(event) => updateSection(index, 'heading', event.target.value)} maxLength={180} /></label>
                <label>
                  Section type
                  <select value={section.type} onChange={(event) => changeSectionType(index, event.target.value)}>
                    {sectionTypes.map((type) => <option value={type.value} key={type.value}>{type.label}</option>)}
                  </select>
                </label>
              </div>
              <div className="section-order-buttons">
                <button type="button" className="button button-outline" aria-label="Move section up" disabled={index === 0} onClick={() => moveSection(index, -1)}>↑</button>
                <button type="button" className="button button-outline" aria-label="Move section down" disabled={index === page.sections.length - 1} onClick={() => moveSection(index, 1)}>↓</button>
                <button type="button" className="text-button danger-text" onClick={() => updatePage('sections', page.sections.filter((_, sectionIndex) => sectionIndex !== index))}>Remove</button>
              </div>
            </div>
            {section.type === 'html'
              ? (
                <div className="visual-editor-field">
                  <span className="visual-editor-label">Edit section content</span>
                  <VisualContentEditor
                    label={`Section ${index + 1} content`}
                    html={section.content}
                    onChange={(value) => updateSection(index, 'content', value)}
                  />
                </div>
              )
              : (
                <>
                  <SectionFields
                    section={section}
                    faqCollections={faqCollections}
                    onChange={(value) => updateSection(index, 'content', value)}
                    onChangeField={(field, value) => updateSection(index, field, value)}
                  />
                  {section.type === 'faq_collection' && faqError && <ErrorMessage>{faqError}</ErrorMessage>}
                </>
              )}
            <label className="admin-checkbox"><input type="checkbox" checked={Boolean(section.is_visible)} onChange={(event) => updateSection(index, 'is_visible', event.target.checked)} /> Visible on site</label>
            <details className="section-preview advanced-html">
              <summary>Advanced: edit HTML source</summary>
              <label>Section HTML<textarea className="code-input" value={section.content} onChange={(event) => updateSection(index, 'content', event.target.value)} rows="10" /></label>
            </details>
          </article>
        ))}

        <div className="admin-save-row">
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save page'}</button>
          <p>Use structured section types for easy editing, or keep complex legacy sections in HTML mode.</p>
        </div>
      </form>
    </section>
  )
}

function MenuEditor() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function reload() {
    const response = await api('/admin/menu-items')
    setItems(response.items.map((item) => ({ ...item, _key: String(item.id), parent_id: item.parent_id == null ? '' : String(item.parent_id) })))
  }

  useEffect(() => {
    let active = true
    api('/admin/menu-items')
      .then((response) => {
        if (active) {
          setItems(response.items.map((item) => ({ ...item, _key: String(item.id), parent_id: item.parent_id == null ? '' : String(item.parent_id) })))
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  function updateItem(key, field, value) {
    setItems((current) => current.map((item) => (
      item._key === key ? { ...item, [field]: value } : item
    )))
  }

  function addItem(location) {
    setItems((current) => [...current, {
      _key: `new-${crypto.randomUUID()}`,
      label: '',
      url: '/',
      location,
      parent_id: '',
      position: current.filter((item) => item.location === location).length,
      is_visible: true,
    }])
  }

  async function removeItem(item) {
    setError('')
    try {
      if (item.id) await api(`/admin/menu-items/${item.id}`, { method: 'DELETE' })
      setItems((current) => current
        .filter((entry) => entry._key !== item._key)
        .map((entry) => entry.parent_id === item._key ? { ...entry, parent_id: '' } : entry))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function saveItems(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const idByKey = new Map()
      const parentItems = items.filter((item) => !item.parent_id)
      const childItems = items.filter((item) => item.parent_id)

      for (const item of parentItems) {
        const body = {
          label: item.label,
          url: item.url,
          location: item.location,
          parent_id: null,
          position: Number(item.position),
          is_visible: Boolean(item.is_visible),
        }
        const result = await api(item.id ? `/admin/menu-items/${item.id}` : '/admin/menu-items', {
          method: item.id ? 'PUT' : 'POST',
          body: jsonBody(body),
        })
        idByKey.set(item._key, result.item.id)
      }

      for (const item of childItems) {
        const body = {
          label: item.label,
          url: item.url,
          location: item.location,
          parent_id: idByKey.get(item.parent_id) ?? Number(item.parent_id),
          position: Number(item.position),
          is_visible: Boolean(item.is_visible),
        }
        const result = await api(item.id ? `/admin/menu-items/${item.id}` : '/admin/menu-items', {
          method: item.id ? 'PUT' : 'POST',
          body: jsonBody(body),
        })
        idByKey.set(item._key, result.item.id)
      }

      await reload()
      setMessage('Navigation menus saved.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading navigation…</p>

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Site navigation</p><h1>Navigation menus</h1></div>
        <div className="admin-inline-actions">
          <button type="button" className="button button-outline" onClick={() => addItem('header')}>Add header item</button>
          <button type="button" className="button button-outline" onClick={() => addItem('footer')}>Add footer group</button>
        </div>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {message && <p className="admin-success" role="status">{message}</p>}
      <form onSubmit={saveItems}>
        <div className="admin-table-wrap">
          <table className="admin-table menu-table">
            <thead><tr><th>Label</th><th>URL</th><th>Menu</th><th>Parent</th><th>Order</th><th>Visible</th><th /></tr></thead>
            <tbody>
              {items.map((item) => {
                const parents = items.filter((parent) => parent.location === item.location && !parent.parent_id && parent._key !== item._key)
                return (
                  <tr key={item._key}>
                    <td><input aria-label="Menu label" value={item.label} onChange={(event) => updateItem(item._key, 'label', event.target.value)} required maxLength={120} /></td>
                    <td><input aria-label="Menu URL" value={item.url} onChange={(event) => updateItem(item._key, 'url', event.target.value)} required maxLength={2048} /></td>
                    <td>
                      <select value={item.location} onChange={(event) => {
                        updateItem(item._key, 'location', event.target.value)
                        updateItem(item._key, 'parent_id', '')
                      }}>
                        <option value="header">Header</option><option value="footer">Footer</option>
                      </select>
                    </td>
                    <td>
                      <select aria-label="Parent menu item" value={item.parent_id} onChange={(event) => updateItem(item._key, 'parent_id', event.target.value)}>
                        <option value="">Top level</option>
                        {parents.map((parent) => <option key={parent._key} value={parent._key}>{parent.label}</option>)}
                      </select>
                    </td>
                    <td><input aria-label="Display order" type="number" min="0" value={item.position} onChange={(event) => updateItem(item._key, 'position', event.target.value)} /></td>
                    <td><input aria-label="Visible" type="checkbox" checked={Boolean(item.is_visible)} onChange={(event) => updateItem(item._key, 'is_visible', event.target.checked)} /></td>
                    <td><button type="button" className="text-button danger-text" onClick={() => removeItem(item)}>Remove</button></td>
                  </tr>
                )
              })}
              {items.length === 0 && <tr><td colSpan="7">No menu items yet.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="admin-save-row"><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save menus'}</button></div>
      </form>
    </section>
  )
}

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api('/admin/leads')
      .then((response) => setLeads(response.leads.data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(lead, status) {
    setError('')
    try {
      const response = await api(`/admin/leads/${lead.id}`, {
        method: 'PATCH',
        body: jsonBody({ status }),
      })
      setLeads((current) => current.map((item) => item.id === lead.id ? response.lead : item))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="admin-heading-row"><div><p className="eyebrow">Inbox</p><h1>Contact requests</h1></div></div>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? <p>Loading requests…</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Received</th><th>Request</th><th>Name</th><th>Contact</th><th>Message</th><th>Status</th></tr></thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td>{lead.type}</td>
                  <td>{lead.name}</td>
                  <td>{lead.email || lead.phone}</td>
                  <td className="lead-message">{lead.message || '—'}</td>
                  <td>
                    <select aria-label={`Status for ${lead.name}`} value={lead.status} onChange={(event) => updateStatus(lead, event.target.value)}>
                      <option value="new">New</option><option value="in_progress">In progress</option><option value="contacted">Contacted</option><option value="archived">Archived</option>
                    </select>
                  </td>
                </tr>
              ))}
              {leads.length === 0 && <tr><td colSpan="6">No contact requests yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })

  useEffect(() => {
    let active = true
    api(`/admin/subscribers?page=${page}`)
      .then((response) => {
        if (active) {
          setSubscribers(response.subscribers.data)
          setPagination({
            current_page: response.subscribers.current_page,
            last_page: response.subscribers.last_page,
            total: response.subscribers.total,
          })
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [page])

  function navigateToPage(nextPage) {
    setError('')
    setLoading(true)
    setPage(nextPage)
  }

  async function removeSubscriber(subscriber) {
    if (!window.confirm(`Remove ${subscriber.email} from the subscriber list?`)) return

    try {
      await api(`/admin/subscribers/${subscriber.id}`, { method: 'DELETE' })
      setSubscribers((current) => current.filter((item) => item.id !== subscriber.id))
      setPagination((current) => ({ ...current, total: Math.max(0, current.total - 1) }))
      if (subscribers.length === 1 && page > 1) navigateToPage(page - 1)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Newsletter</p><h1>Subscribers</h1></div>
        <span>{pagination.total} total</span>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? <p>Loading subscribers…</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Subscribed</th><th>Email</th><th>Action</th></tr></thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>{new Date(subscriber.created_at).toLocaleDateString()}</td>
                  <td>{subscriber.email}</td>
                  <td><button type="button" className="text-button danger-text" onClick={() => removeSubscriber(subscriber)}>Remove</button></td>
                </tr>
              ))}
              {subscribers.length === 0 && <tr><td colSpan="3">No newsletter subscribers yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {!loading && pagination.last_page > 1 && (
        <div className="admin-pagination">
          <button type="button" className="button button-outline" disabled={page <= 1} onClick={() => navigateToPage(page - 1)}>Previous</button>
          <span>Page {pagination.current_page} of {pagination.last_page}</span>
          <button type="button" className="button button-outline" disabled={page >= pagination.last_page} onClick={() => navigateToPage(page + 1)}>Next</button>
        </div>
      )}
    </section>
  )
}

function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    site_name: '',
    logo_url: '',
    topbar_text: '',
    phone_number: '',
    phone_link: '',
    appointment_label: '',
    appointment_url: '',
    footer_description: '',
    contact_email: '',
    clinic_address: '',
    working_hours: '',
    directions_url: '',
    whatsapp_number: '',
    newsletter_eyebrow: 'Stay connected',
    newsletter_title: 'Subscribe for updates',
    newsletter_description: 'Get helpful news and updates from our clinic.',
    global_cta: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [logoUploading, setLogoUploading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [logoUploadError, setLogoUploadError] = useState('')

  useEffect(() => {
    api('/settings')
      .then((response) => setSettings((current) => ({ ...current, ...response.settings })))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  function updateSetting(field, value) {
    setSettings((current) => ({ ...current, [field]: value }))
  }

  async function uploadLogo(event) {
    const image = event.target.files?.[0]
    if (!image) return

    setLogoUploading(true)
    setLogoUploadError('')
    try {
      const body = new FormData()
      body.append('image', image)
      const response = await api('/admin/uploads/logo', { method: 'POST', body })
      updateSetting('logo_url', response.url)
    } catch (requestError) {
      setLogoUploadError(requestError.message)
    } finally {
      setLogoUploading(false)
      event.target.value = ''
    }
  }

  async function saveSettings(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    try {
      const response = await api('/admin/settings', {
        method: 'PUT',
        body: jsonBody(settings),
      })
      setMessage(response.message)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Loading site settings…</p>

  return (
    <section>
      <div className="admin-heading-row"><div><p className="eyebrow">Site-wide content</p><h1>Site settings</h1></div></div>
      <p>Update shared branding and contact details once; they are used across every page.</p>
      <ErrorMessage>{error}</ErrorMessage>
      {message && <p className="admin-success" role="status">{message}</p>}
      <form className="admin-form" onSubmit={saveSettings}>
        <div className="admin-card admin-field-grid">
          <label>Site name<input value={settings.site_name} onChange={(event) => updateSetting('site_name', event.target.value)} required maxLength={120} /></label>
          <label>Logo image URL<input value={settings.logo_url} onChange={(event) => updateSetting('logo_url', event.target.value)} placeholder="/legacy/media/logo.png" /></label>
          <div className="logo-upload-field">
            <label className="button button-outline blog-upload-button">
              {logoUploading ? 'Uploading…' : 'Upload logo image'}
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadLogo} disabled={logoUploading} />
            </label>
            <span className="admin-field-help">JPG, PNG, or WebP; maximum 5 MB.</span>
            <ErrorMessage>{logoUploadError}</ErrorMessage>
            {settings.logo_url && <img className="logo-upload-preview" src={settings.logo_url} alt="Logo preview" />}
          </div>
          <label>Top bar message<input value={settings.topbar_text} onChange={(event) => updateSetting('topbar_text', event.target.value)} maxLength={255} /></label>
          <label>Phone number<input value={settings.phone_number} onChange={(event) => updateSetting('phone_number', event.target.value)} maxLength={80} /></label>
          <label>Phone link<input value={settings.phone_link} onChange={(event) => updateSetting('phone_link', event.target.value)} placeholder="tel:+911234567890" /></label>
          <label>Appointment button text<input value={settings.appointment_label} onChange={(event) => updateSetting('appointment_label', event.target.value)} required maxLength={80} /></label>
          <label>Appointment button link<input value={settings.appointment_url} onChange={(event) => updateSetting('appointment_url', event.target.value)} required placeholder="/contact-us?type=appointment" /></label>
          <label className="admin-field-wide">Footer description<textarea value={settings.footer_description} onChange={(event) => updateSetting('footer_description', event.target.value)} maxLength={1000} rows="3" /></label>
        </div>

        <div className="admin-card admin-field-grid profile-settings-card">
          <div className="admin-field-wide">
            <p className="eyebrow">Clinic profile</p>
            <h2>Contact details</h2>
            <p>These details appear automatically in the site footer and on the contact page.</p>
          </div>
          <label>Contact email<input type="email" value={settings.contact_email} onChange={(event) => updateSetting('contact_email', event.target.value)} maxLength={255} /></label>
          <label>WhatsApp number<input type="tel" value={settings.whatsapp_number} onChange={(event) => updateSetting('whatsapp_number', event.target.value)} placeholder="+91 91234 12345" /></label>
          <label className="admin-field-wide">Clinic address<textarea value={settings.clinic_address} onChange={(event) => updateSetting('clinic_address', event.target.value)} maxLength={1000} rows="3" /></label>
          <label className="admin-field-wide">Clinic hours<textarea value={settings.working_hours} onChange={(event) => updateSetting('working_hours', event.target.value)} maxLength={1000} rows="3" placeholder="Monday to Saturday: 9 AM–6 PM" /></label>
          <label className="admin-field-wide">Directions link<input type="url" value={settings.directions_url} onChange={(event) => updateSetting('directions_url', event.target.value)} placeholder="https://maps.google.com/..." /></label>
        </div>

        <div className="admin-card admin-field-grid profile-settings-card">
          <div className="admin-field-wide">
            <p className="eyebrow">Footer</p>
            <h2>Newsletter signup</h2>
            <p>This signup appears in the footer column beside the treatment links.</p>
          </div>
          <label>Small intro<input value={settings.newsletter_eyebrow} onChange={(event) => updateSetting('newsletter_eyebrow', event.target.value)} maxLength={180} /></label>
          <label>Heading<input value={settings.newsletter_title} onChange={(event) => updateSetting('newsletter_title', event.target.value)} required maxLength={180} /></label>
          <label className="admin-field-wide">Description<textarea value={settings.newsletter_description} onChange={(event) => updateSetting('newsletter_description', event.target.value)} maxLength={1000} rows="2" /></label>
        </div>

        <article className="admin-card section-editor-card">
          <h2>Shared call-to-action</h2>
          <p>One shared section appears on all pages. Edit its text visually or leave it empty to hide it.</p>
          <VisualContentEditor
            label="Shared call-to-action content"
            html={settings.global_cta}
            onChange={(value) => updateSetting('global_cta', value)}
          />
          <details className="section-preview advanced-html">
            <summary>Advanced: edit HTML source</summary>
            <label>Call-to-action HTML<textarea className="code-input" value={settings.global_cta} onChange={(event) => updateSetting('global_cta', event.target.value)} rows="10" /></label>
          </details>
        </article>
        <div className="admin-save-row"><button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save site settings'}</button></div>
      </form>
    </section>
  )
}

function AdminProtected({ onLogout }) {
  return sessionStorage.getItem('admin-token')
    ? <AdminLayout onLogout={onLogout} />
    : <Navigate to="/admin/login" replace />
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(Boolean(sessionStorage.getItem('admin-token')))

  return (
    <Routes>
      <Route path="login" element={authenticated ? <Navigate to="/admin/pages" replace /> : <AdminLogin onLogin={() => setAuthenticated(true)} />} />
      <Route element={<AdminProtected onLogout={() => setAuthenticated(false)} />}>
        <Route index element={<Navigate to="/admin/pages" replace />} />
        <Route path="pages" element={<PageList />} />
        <Route path="pages/new" element={<PageEditor />} />
        <Route path="pages/:id" element={<PageEditor />} />
        <Route path="blog" element={<BlogList />} />
        <Route path="blog/new" element={<BlogEditor />} />
        <Route path="blog/:id" element={<BlogEditor />} />
        <Route path="faqs" element={<FaqManagement />} />
        <Route path="menu" element={<MenuEditor />} />
        <Route path="settings" element={<SiteSettingsPage />} />
        <Route path="custom-code" element={<CustomCodePage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="subscribers" element={<SubscribersPage />} />
        <Route path="*" element={<Navigate to="/admin/pages" replace />} />
      </Route>
    </Routes>
  )
}

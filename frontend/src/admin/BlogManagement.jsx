import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, jsonBody } from '../api.js'
import { PostContent } from '../BlogPages.jsx'
import { mediaUrl } from '../mediaUrl.js'

function ErrorMessage({ children }) {
  return children ? <p className="admin-error" role="alert">{children}</p> : null
}

function BlogList() {
  const [result, setResult] = useState({ data: [], current_page: 1, last_page: 1 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api(`/admin/blog-posts?page=${page}`)
      .then((response) => {
        if (active) setResult(response.posts)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [page])

  async function removePost(post) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return

    try {
      await api(`/admin/blog-posts/${post.id}`, { method: 'DELETE' })
      setResult((current) => ({ ...current, data: current.data.filter((item) => item.id !== post.id) }))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Content</p><h1>Blog posts</h1></div>
        <Link className="button button-primary" to="/admin/blog/new">Create a post</Link>
      </div>
      <p>Write helpful articles with guided fields and simple content blocks. No HTML or coding required.</p>
      <ErrorMessage>{error}</ErrorMessage>
      {loading ? <p>Loading blog posts…</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Title</th><th>Category</th><th>Updated</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {result.data.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.category || '—'}</td>
                  <td>{new Date(post.updated_at).toLocaleDateString()}</td>
                  <td><span className={post.is_published ? 'status-pill published' : 'status-pill'}>{post.is_published ? 'Published' : 'Draft'}</span></td>
                  <td className="admin-actions">
                    <Link to={`/admin/blog/${post.id}`}>Edit</Link>
                    <button type="button" className="text-button danger-text" onClick={() => removePost(post)}>Delete</button>
                  </td>
                </tr>
              ))}
              {result.data.length === 0 && <tr><td colSpan="5">No blog posts yet. Create your first post to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
      {!loading && result.last_page > 1 && (
        <div className="blog-pagination">
          <button className="button button-outline" type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</button>
          <span>Page {result.current_page} of {result.last_page}</span>
          <button className="button button-outline" type="button" disabled={page >= result.last_page} onClick={() => setPage((current) => current + 1)}>Next</button>
        </div>
      )}
    </section>
  )
}

function emptyPost() {
  return {
    title: '',
    slug: '',
    category: '',
    excerpt: '',
    cover_image: '',
    cover_image_alt: '',
    author: 'Nius We Care',
    seo_title: '',
    seo_description: '',
    content: [{ type: 'paragraph', text: '' }],
    is_published: false,
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ImageField({ label, value, onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function upload(event) {
    const image = event.target.files?.[0]
    if (!image) return

    setUploading(true)
    setError('')
    try {
      const body = new FormData()
      body.append('image', image)
      const response = await api('/admin/uploads/blog-image', { method: 'POST', body })
      onChange(response.url)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="blog-image-field">
      <label>{label}<input type="text" value={value ?? ''} onChange={(event) => onChange(event.target.value)} placeholder="Paste an image link or upload a file" /></label>
      <label className="button button-outline blog-upload-button">
        {uploading ? 'Uploading…' : 'Choose image'}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={uploading} />
      </label>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {mediaUrl(value) && <img className="blog-upload-preview" src={mediaUrl(value)} alt="" />}
    </div>
  )
}

function createBlock(type) {
  if (type === 'image') return { type, url: '', alt: '', caption: '' }
  if (type === 'list') return { type, items: [''] }
  if (type === 'faq') return { type, title: 'Frequently asked questions', faqs: [{ question: '', answer: '' }] }
  return { type, text: '' }
}

function BlogEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = !id || id === 'new'
  const [post, setPost] = useState(emptyPost)
  const [loadedFor, setLoadedFor] = useState(isNew ? 'new' : null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const slugEdited = useRef(false)

  useEffect(() => {
    if (isNew) return
    api(`/admin/blog-posts/${id}`)
      .then((response) => {
        setPost(response.post)
        slugEdited.current = true
        setLoadedFor(id)
      })
      .catch((requestError) => {
        setError(requestError.message)
        setLoadedFor(id)
      })
  }, [id, isNew])

  function updatePost(field, value) {
    setPost((current) => {
      const next = { ...current, [field]: value }
      if (field === 'title' && !slugEdited.current) next.slug = slugify(value)
      return next
    })
  }

  function updateBlock(index, field, value) {
    setPost((current) => ({
      ...current,
      content: current.content.map((block, blockIndex) => (
        blockIndex === index ? { ...block, [field]: value } : block
      )),
    }))
  }

  function moveBlock(index, offset) {
    setPost((current) => {
      const content = [...current.content]
      const destination = index + offset
      if (destination < 0 || destination >= content.length) return current
      ;[content[index], content[destination]] = [content[destination], content[index]]
      return { ...current, content }
    })
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const response = await api(isNew ? '/admin/blog-posts' : `/admin/blog-posts/${id}`, {
        method: isNew ? 'POST' : 'PUT',
        body: jsonBody(post),
      })
      setPost(response.post)
      navigate(`/admin/blog/${response.post.id}`, { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  if (!isNew && loadedFor !== id) return <p>Loading blog post…</p>

  return (
    <section>
      <div className="admin-heading-row">
        <div><p className="eyebrow">Blog editor</p><h1>{isNew ? 'Create a post' : 'Edit post'}</h1></div>
        <Link to="/admin/blog">Back to blog posts</Link>
      </div>
      <p>Fill in the fields, add content blocks, and preview your article before publishing.</p>
      <ErrorMessage>{error}</ErrorMessage>
      <form className="admin-form blog-editor" onSubmit={save}>
        <div className="admin-card admin-field-grid">
          <label className="admin-field-wide">Post title<input value={post.title} onChange={(event) => updatePost('title', event.target.value)} required maxLength={180} placeholder="Example: Understanding your first IVF consultation" /></label>
          <label className="admin-field-wide">Web address<input value={post.slug} onChange={(event) => {
            slugEdited.current = true
            updatePost('slug', slugify(event.target.value))
          }} required maxLength={180} pattern="[a-z0-9]+(-[a-z0-9]+)*" /><span className="field-help">Your article will be at /blog/{post.slug || 'your-post-title'}</span></label>
          <label>Category<input value={post.category ?? ''} onChange={(event) => updatePost('category', event.target.value)} maxLength={120} placeholder="Fertility guidance" /></label>
          <label>Author<input value={post.author} onChange={(event) => updatePost('author', event.target.value)} required maxLength={120} /></label>
          <label className="admin-field-wide">Short summary<textarea value={post.excerpt ?? ''} onChange={(event) => updatePost('excerpt', event.target.value)} maxLength={1000} rows="3" placeholder="A short introduction readers will see before opening the article." /></label>
          <div className="admin-field-wide">
            <ImageField label="Cover image" value={post.cover_image} onChange={(value) => updatePost('cover_image', value)} />
          </div>
          <label className="admin-field-wide">Cover image description<input value={post.cover_image_alt ?? ''} onChange={(event) => updatePost('cover_image_alt', event.target.value)} maxLength={255} placeholder="Describe the image for accessibility" /></label>
        </div>

        <section className="admin-card blog-content-builder">
          <div>
            <p className="eyebrow">Article content</p>
            <h2>Build your article</h2>
            <p>Add text, headings, lists, quotes, and images. Arrange blocks using the arrows.</p>
          </div>
          <div className="blog-add-blocks" aria-label="Add content block">
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('paragraph')])}>+ Paragraph</button>
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('heading')])}>+ Heading</button>
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('list')])}>+ Bullet list</button>
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('quote')])}>+ Quote</button>
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('image')])}>+ Image</button>
            <button type="button" className="button button-outline" onClick={() => updatePost('content', [...post.content, createBlock('faq')])}>+ FAQ</button>
          </div>
          {post.content.map((block, index) => (
            <article className="blog-content-block" key={`${index}-${block.type}`}>
              <div className="blog-content-block-heading">
                <strong>{block.type === 'list' ? 'Bullet list' : block.type[0].toUpperCase() + block.type.slice(1)} {index + 1}</strong>
                <div className="section-order-buttons">
                  <button type="button" className="button button-outline" aria-label="Move block up" disabled={index === 0} onClick={() => moveBlock(index, -1)}>↑</button>
                  <button type="button" className="button button-outline" aria-label="Move block down" disabled={index === post.content.length - 1} onClick={() => moveBlock(index, 1)}>↓</button>
                  <button type="button" className="text-button danger-text" disabled={post.content.length === 1} onClick={() => updatePost('content', post.content.filter((_, blockIndex) => blockIndex !== index))}>Remove</button>
                </div>
              </div>
              {block.type === 'image'
                ? (
                  <>
                    <ImageField label="Article image" value={block.url} onChange={(value) => updateBlock(index, 'url', value)} />
                    <div className="admin-field-grid">
                      <label>Image description<input value={block.alt ?? ''} onChange={(event) => updateBlock(index, 'alt', event.target.value)} maxLength={255} /></label>
                      <label>Caption (optional)<input value={block.caption ?? ''} onChange={(event) => updateBlock(index, 'caption', event.target.value)} maxLength={500} /></label>
                    </div>
                  </>
                )
                : block.type === 'faq'
                  ? (
                    <div className="blog-faq-editor">
                      <label>FAQ section heading<input value={block.title ?? ''} onChange={(event) => updateBlock(index, 'title', event.target.value)} maxLength={180} /></label>
                      {(Array.isArray(block.faqs) ? block.faqs : []).map((faq, faqIndex) => (
                        <div className="admin-card blog-faq-item" key={faqIndex}>
                          <div className="blog-content-block-heading">
                            <strong>Question {faqIndex + 1}</strong>
                            <button
                              type="button"
                              className="text-button danger-text"
                              disabled={block.faqs.length <= 1}
                              onClick={() => updateBlock(index, 'faqs', block.faqs.filter((_, itemIndex) => itemIndex !== faqIndex))}
                            >Remove</button>
                          </div>
                          <label>Question<input value={faq.question ?? ''} onChange={(event) => updateBlock(index, 'faqs', block.faqs.map((item, itemIndex) => itemIndex === faqIndex ? { ...item, question: event.target.value } : item))} maxLength={255} required /></label>
                          <label>Answer<textarea value={faq.answer ?? ''} onChange={(event) => updateBlock(index, 'faqs', block.faqs.map((item, itemIndex) => itemIndex === faqIndex ? { ...item, answer: event.target.value } : item))} rows="4" maxLength={3000} required /></label>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="button button-outline"
                        onClick={() => updateBlock(index, 'faqs', [...(Array.isArray(block.faqs) ? block.faqs : []), { question: '', answer: '' }])}
                      >+ Add question</button>
                    </div>
                  )
                : block.type === 'list'
                  ? <label>One list item per line<textarea value={(block.items ?? []).join('\n')} onChange={(event) => updateBlock(index, 'items', event.target.value.split('\n'))} rows="5" placeholder={'First helpful point\nSecond helpful point'} /></label>
                  : <label>{block.type === 'heading' ? 'Heading text' : block.type === 'quote' ? 'Quote text' : 'Paragraph text'}<textarea value={block.text ?? ''} onChange={(event) => updateBlock(index, 'text', event.target.value)} rows={block.type === 'heading' ? 2 : 5} placeholder={block.type === 'paragraph' ? 'Write your article content here…' : 'Add text…'} /></label>}
            </article>
          ))}
        </section>

        <div className="admin-card admin-field-grid">
          <div className="admin-field-wide"><p className="eyebrow">Search appearance</p><h2>Optional SEO details</h2></div>
          <label>Search result title<input value={post.seo_title ?? ''} onChange={(event) => updatePost('seo_title', event.target.value)} maxLength={255} /></label>
          <label>Search result description<textarea value={post.seo_description ?? ''} onChange={(event) => updatePost('seo_description', event.target.value)} maxLength={500} rows="3" /></label>
        </div>

        <div className="admin-card blog-preview">
          <p className="eyebrow">Preview</p>
          <h2>{post.title || 'Your article title'}</h2>
          {post.excerpt && <p>{post.excerpt}</p>}
          {mediaUrl(post.cover_image) && <img src={mediaUrl(post.cover_image)} alt={post.cover_image_alt || ''} />}
          <div className="blog-article-content"><PostContent blocks={post.content} /></div>
        </div>

        <div className="admin-card blog-publish-row">
          <label className="admin-checkbox"><input type="checkbox" checked={Boolean(post.is_published)} onChange={(event) => updatePost('is_published', event.target.checked)} /> Publish this post</label>
          <p>{post.is_published ? 'Readers can see this post on the website.' : 'This post is saved as a draft and only visible in admin.'}</p>
        </div>
        <div className="admin-save-row">
          <button className="button button-primary" type="submit" disabled={saving}>{saving ? 'Saving…' : post.is_published ? 'Save and publish' : 'Save draft'}</button>
          <Link to="/admin/blog">Cancel</Link>
        </div>
      </form>
    </section>
  )
}

export { BlogList, BlogEditor }

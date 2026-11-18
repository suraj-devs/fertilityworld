import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { api } from './api.js'
import { mediaUrl } from './mediaUrl.js'

function normalizeInternalLinks(html) {
  const document = new DOMParser().parseFromString(html, 'text/html')

  document.querySelectorAll('a[href]').forEach((link) => {
    const href = link.getAttribute('href') ?? ''
    if (!href || href.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return

    const url = new URL(href, window.location.origin)
    if (url.pathname === '/index.htm' || url.pathname === '/index.html') {
      url.pathname = '/'
    } else {
      url.pathname = url.pathname.replace(/\.html?$/i, '')
    }

    link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`)
  })

  document.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.setAttribute('rel', 'noopener noreferrer')
  })

  document.querySelectorAll('img[src]').forEach((image) => {
    const source = image.getAttribute('src') ?? ''
    if (/^(assets|media)\//.test(source)) {
      image.setAttribute('src', `/legacy/${source}`)
    } else {
      const localMedia = mediaUrl(source)
      if (localMedia) image.setAttribute('src', localMedia)
    }
  })

  document.querySelectorAll('#faqs').forEach((section, sectionIndex) => {
    section.querySelectorAll('details').forEach((item) => {
      item.setAttribute('name', `legacy-faq-${sectionIndex}`)
    })
  })

  return document.body.innerHTML
}

export default function RichContent({ html, appointmentUrl = '/' }) {
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const safeHtml = useMemo(
    () => normalizeInternalLinks(DOMPurify.sanitize(html ?? '')),
    [html],
  )

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const handleImageError = (event) => {
      if (event.target instanceof HTMLImageElement) {
        const image = event.target
        const placeholder = image.closest('figure') ?? image.parentElement
        if (placeholder) {
          placeholder.classList.add('content-image-placeholder')
          placeholder.dataset.placeholder = image.alt || 'Clinic image'
        }
        image.remove()
      }
    }
    const handleCtaClick = (event) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null
      if (button && /(appointment|fertility specialist|your journey|let['’]s talk)/i.test(button.textContent ?? '')) {
        navigate(appointmentUrl)
      }
    }
    const handleInternalLinkClick = (event) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null
      const href = link?.getAttribute('href') ?? ''
      if (
        !link
        || !href.startsWith('/')
        || href.startsWith('//')
        || link.target === '_blank'
        || event.defaultPrevented
        || event.button !== 0
        || event.metaKey
        || event.ctrlKey
        || event.shiftKey
        || event.altKey
      ) {
        return
      }

      event.preventDefault()
      navigate(href)
    }

    container.addEventListener('error', handleImageError, true)
    container.addEventListener('click', handleCtaClick)
    container.addEventListener('click', handleInternalLinkClick)
    container.querySelectorAll('img').forEach((image) => {
      if (image.complete && image.naturalWidth === 0) {
        handleImageError({ target: image })
      }
    })
    return () => {
      container.removeEventListener('error', handleImageError, true)
      container.removeEventListener('click', handleCtaClick)
      container.removeEventListener('click', handleInternalLinkClick)
    }
  }, [appointmentUrl, navigate, safeHtml])

  return <div ref={containerRef} className="rich-content" dangerouslySetInnerHTML={{ __html: safeHtml }} />
}

export function VisualContentEditor({ html, onChange, label }) {
  const editorRef = useRef(null)
  const lastValueRef = useRef(null)
  const savedSelectionRef = useRef(null)
  const imageInputRef = useRef(null)
  const [uploadError, setUploadError] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const safeHtml = useMemo(
    () => normalizeInternalLinks(DOMPurify.sanitize(html ?? '')),
    [html],
  )

  useEffect(() => {
    if (editorRef.current && lastValueRef.current !== html) {
      editorRef.current.innerHTML = safeHtml
      lastValueRef.current = html
    }
  }, [html, safeHtml])

  function updateContent() {
    const editor = editorRef.current
    if (!editor) return

    const sanitizedHtml = normalizeInternalLinks(DOMPurify.sanitize(editor.innerHTML))
    if (editor.innerHTML !== sanitizedHtml) editor.innerHTML = sanitizedHtml
    lastValueRef.current = sanitizedHtml
    onChange(sanitizedHtml)
  }

  function format(command, value = null) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    updateContent()
  }

  function insertLink() {
    const url = window.prompt('Enter a website URL or page path')
    if (url) format('createLink', url)
  }

  function rememberSelection() {
    const selection = window.getSelection()
    if (selection?.rangeCount && editorRef.current?.contains(selection.anchorNode)) {
      savedSelectionRef.current = selection.getRangeAt(0).cloneRange()
    }
  }

  async function uploadImage(event) {
    const image = event.target.files?.[0]
    if (!image) return

    setUploadingImage(true)
    setUploadError('')
    try {
      const body = new FormData()
      body.append('image', image)
      const response = await api('/admin/uploads/content-image', { method: 'POST', body })
      const editor = editorRef.current
      if (!editor) return

      editor.focus()
      const selection = window.getSelection()
      const range = savedSelectionRef.current
      if (range && editor.contains(range.startContainer)) {
        selection?.removeAllRanges()
        selection?.addRange(range)
      } else {
        const endRange = document.createRange()
        endRange.selectNodeContents(editor)
        endRange.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(endRange)
      }

      const uploadedImage = document.createElement('img')
      uploadedImage.src = response.url
      uploadedImage.alt = image.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
      uploadedImage.loading = 'lazy'
      document.execCommand('insertHTML', false, uploadedImage.outerHTML)
      updateContent()
    } catch (error) {
      setUploadError(error.message)
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  return (
    <div className="visual-editor">
      <div className="visual-editor-toolbar" role="toolbar" aria-label={`${label} formatting`}>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => format('bold')} aria-label="Bold">B</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => format('italic')} aria-label="Italic"><em>I</em></button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => format('formatBlock', '<h2>')} aria-label="Heading">Heading</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => format('insertUnorderedList')} aria-label="Bulleted list">List</button>
        <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={insertLink} aria-label="Insert link">Link</button>
        <button type="button" onMouseDown={rememberSelection} onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}>
          {uploadingImage ? 'Uploading image…' : 'Upload image'}
        </button>
        <input ref={imageInputRef} className="visual-editor-image-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} />
      </div>
      <div
        ref={editorRef}
        className="visual-editor-canvas rich-content"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        onInput={updateContent}
        onBlur={updateContent}
      />
      {uploadError && <p className="admin-error" role="alert">{uploadError}</p>}
      <p className="visual-editor-help">Click text to edit it. Use the toolbar to format text; the preview reflects the site layout.</p>
    </div>
  )
}

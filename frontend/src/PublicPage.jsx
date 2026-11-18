import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from './api.js'
import AppLink from './AppLink.jsx'
import DynamicSection from './DynamicSection.jsx'
import LeadForm from './LeadForm.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import { SiteFooter, SiteHeader } from './SiteShell.jsx'
import { PageCustomCode } from './CustomCode.jsx'

export default function PublicPage() {
  const location = useLocation()
  const slug = location.pathname.replace(/^\/+|\/+$/g, '') || 'home'
  const [chrome, setChrome] = useState({ header: [], footer: [], settings: {}, loading: true, error: '' })
  const [content, setContent] = useState({ slug: null, page: null, error: '' })
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      api('/menu?location=header', { signal: controller.signal }),
      api('/menu?location=footer', { signal: controller.signal }),
      api('/settings', { signal: controller.signal }),
    ])
      .then(([headerResponse, footerResponse, settingsResponse]) => {
        setChrome({
          header: headerResponse.items,
          footer: footerResponse.items,
          settings: settingsResponse.settings ?? {},
          loading: false,
          error: '',
        })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setChrome((current) => ({ ...current, loading: false, error: error.message }))
        }
      })

    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    api(`/page?slug=${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then((response) => setContent({ slug, page: response.page, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setContent({ slug, page: null, error: error.message })
      })

    return () => controller.abort()
  }, [slug, retry])

  useEffect(() => {
    if (content.page) {
      document.title = content.page.seo_title || content.page.title
      const description = document.querySelector('meta[name="description"]')
      if (description && content.page.seo_description) {
        description.setAttribute('content', content.page.seo_description)
      }
    }
  }, [content.page])

  if (chrome.loading) {
    return <LoadingScreen message="Preparing your care experience" />
  }

  const siteHeader = <SiteHeader items={chrome.header} settings={chrome.settings} />
  const siteFooter = <SiteFooter items={chrome.footer} settings={chrome.settings} />

  if (content.slug !== slug) {
    return (
      <>
        {siteHeader}
        <main><LoadingScreen compact message="Loading this page" /></main>
        {siteFooter}
      </>
    )
  }

  if (chrome.error || content.error || !content.page) {
    return (
      <>
        {siteHeader}
        <main>
          <div className="page-status page-error" role="alert">
            <p className="eyebrow">We Care Fertility</p>
            <h1>{chrome.error ? 'Some site details could not load' : 'Page unavailable'}</h1>
            <p>{chrome.error || content.error || 'This page could not be found.'}</p>
            {content.error && <button className="button button-outline" type="button" onClick={() => setRetry((current) => current + 1)}>Try again</button>}
            <AppLink className="button button-primary" href="/">Return home</AppLink>
          </div>
        </main>
        {siteFooter}
      </>
    )
  }

  const hasExistingForm = content.page.sections.some((section) => (
    section.type === 'lead_form' || (section.type === 'html' && /<form\b/i.test(section.content))
  ))

  return (
    <>
      {siteHeader}
      <PageCustomCode page={content.page} />
      {chrome.error && <p className="blog-message" role="alert">Site navigation could not be loaded: {chrome.error}</p>}
      <main>
        {content.page.sections.map((section) => (
          <DynamicSection key={section.id} section={section} settings={chrome.settings} />
        ))}
        {content.page.slug === 'contact-us' && !hasExistingForm && (
          <LeadForm initialType={new URLSearchParams(location.search).get('type') === 'appointment' ? 'appointment' : 'contact'} />
        )}
      </main>
      {siteFooter}
    </>
  )
}

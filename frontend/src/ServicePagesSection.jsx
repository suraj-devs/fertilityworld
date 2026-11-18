import { useEffect, useState } from 'react'
import AppLink from './AppLink.jsx'
import { api } from './api.js'

function safeImageUrl(value) {
  const image = String(value ?? '').trim()
  if (image.startsWith('/') && !image.startsWith('//')) return image

  try {
    const url = new URL(image)
    return ['http:', 'https:'].includes(url.protocol) ? image : ''
  } catch {
    return ''
  }
}

export default function ServicePagesSection({ data = {} }) {
  const [result, setResult] = useState({ status: 'loading', services: [], error: '' })

  useEffect(() => {
    const controller = new AbortController()
    api('/services', { signal: controller.signal })
      .then((response) => setResult({ status: 'ready', services: response.services, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setResult({ status: 'error', services: [], error: error.message })
        }
      })

    return () => controller.abort()
  }, [])

  if (result.status === 'ready' && result.services.length === 0) return null

  return (
    <section className="section-space service-pages-section">
      <div className="site-width">
        <div className="section-top">
          <div>
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <h2 className="section-title">{data.title || 'Explore our treatments'}</h2>
            {data.intro && <p className="section-copy mb-0">{data.intro}</p>}
          </div>
          {data.button_label && <AppLink className="text-link shrink-0" href={data.button_url || '/treatments'}>{data.button_label}</AppLink>}
        </div>

        {result.status === 'error'
          ? <p className="blog-message" role="alert">Treatment pages could not be loaded: {result.error}</p>
          : (
            <div className="service-page-grid" aria-busy={result.status === 'loading'}>
              {result.status === 'loading'
                ? [0, 1, 2].map((item) => <div className="service-page-card service-page-card-skeleton" key={item} aria-hidden="true" />)
                : result.services.map((service) => {
                  const image = safeImageUrl(service.image_url)
                  return (
                    <AppLink className="service-page-card" href={`/${service.slug}`} key={service.id}>
                      <div className="service-page-card-image">
                        {image
                          ? <img src={image} alt={service.image_alt || ''} loading="lazy" />
                          : <span aria-hidden="true">Nius We Care · {service.title}</span>}
                      </div>
                      <div className="service-page-card-body">
                        <h3>{service.title}</h3>
                        {service.description && <p>{service.description}</p>}
                        <span className="text-link">Explore treatment <span aria-hidden="true">→</span></span>
                      </div>
                    </AppLink>
                  )
                })}
            </div>
          )}
      </div>
    </section>
  )
}

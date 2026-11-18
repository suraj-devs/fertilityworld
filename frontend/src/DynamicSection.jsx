import LeadForm from './LeadForm.jsx'
import BlogHighlights from './BlogHighlights.jsx'
import AppLink from './AppLink.jsx'
import RichContent from './RichContent.jsx'
import FaqAccordion from './FaqAccordion.jsx'
import ServicePagesSection from './ServicePagesSection.jsx'
import { parseSectionData } from './sectionBlocks.js'
import { mediaUrl } from './mediaUrl.js'

function safeHref(value) {
  const href = String(value ?? '').trim()
  if (!href || href.includes('\\')) return ''
  if ((href.startsWith('/') && !href.startsWith('//')) || href.startsWith('#') || href.startsWith('?')) {
    return href
  }

  try {
    const url = new URL(href)
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? href : ''
  } catch {
    return ''
  }
}

function safeImageUrl(value) {
  const href = safeHref(mediaUrl(value))
  return /^(https?:\/\/|\/)/i.test(href) && !href.startsWith('//') ? href : ''
}

function OptionalLink({ href, children, className = 'button button-primary' }) {
  const safeUrl = safeHref(href)
  return safeUrl ? <AppLink className={className} href={safeUrl}>{children}</AppLink> : null
}

function ContactProfile({ data, settings }) {
  const phone = settings.phone_number
  const phoneLink = safeHref(settings.phone_link)
  const email = settings.contact_email
  const emailLink = email ? `mailto:${email}` : ''
  const address = settings.clinic_address
  const hours = settings.working_hours
  const directions = safeHref(settings.directions_url)
  const whatsappDigits = String(settings.whatsapp_number ?? '').replace(/\D/g, '')

  return (
    <section className="section-space dynamic-contact-section">
      <div className="site-width dynamic-contact-grid">
        <div>
          <h2 className="section-title">{data.title}</h2>
          {data.intro && <p className="section-copy">{data.intro}</p>}
          <div className="dynamic-contact-list">
            {address && (
              <div className="dynamic-contact-item">
                <strong>Address</strong>
                <p>{address}</p>
                {directions && <a className="text-link" href={directions} target="_blank" rel="noopener noreferrer">Get directions</a>}
              </div>
            )}
            {hours && <div className="dynamic-contact-item"><strong>Clinic hours</strong><p>{hours}</p></div>}
            {phone && <div className="dynamic-contact-item"><strong>Phone</strong><p>{phoneLink ? <a href={phoneLink}>{phone}</a> : phone}</p></div>}
            {email && <div className="dynamic-contact-item"><strong>Email</strong><p><a href={emailLink}>{email}</a></p></div>}
            {whatsappDigits && (
              <div className="dynamic-contact-item">
                <strong>WhatsApp</strong>
                <p><a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener noreferrer">Chat with our team</a></p>
              </div>
            )}
          </div>
        </div>
        <aside className="content-aside">
          <div className="eyebrow">Contact us</div>
          <h2>We are here to help</h2>
          <p>Send a request and our team will contact you about the next steps.</p>
          {data.privacy_note && <p className="privacy-note">{data.privacy_note}</p>}
          <OptionalLink href={settings.appointment_url}>{settings.appointment_label || 'Request an appointment'}</OptionalLink>
        </aside>
      </div>
    </section>
  )
}

export default function DynamicSection({ section, settings = {} }) {
  if (section.type === 'html') {
    return <RichContent html={section.content} appointmentUrl={settings.appointment_url} />
  }

  const data = parseSectionData(section.content)

  if (section.type === 'hero') {
    const image = safeImageUrl(data.image_url)
    if (data.layout === 'cover') {
      return (
        <section className="dynamic-hero-cover">
          {image && <img className="dynamic-hero-cover-image" src={image} alt={data.image_alt || ''} fetchPriority="high" />}
          <div className="dynamic-hero-cover-overlay" />
          <div className="site-width dynamic-hero-cover-content">
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <h1 className="display-title">{data.title}{data.highlight && <><br /><em>{data.highlight}</em></>}</h1>
            {data.body && <p className="section-copy">{data.body}</p>}
            <div className="dynamic-hero-actions">
              <OptionalLink href={data.button_url}>{data.button_label}</OptionalLink>
              <OptionalLink className="button button-outline" href={data.secondary_button_url}>{data.secondary_button_label}</OptionalLink>
            </div>
          </div>
        </section>
      )
    }

    return (
      <section className="section-space dynamic-hero">
        <div className={`site-width dynamic-split${image ? '' : ' dynamic-split-no-image'}`}>
          <div>
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <h1 className="display-title">{data.title}{data.highlight && <> <em>{data.highlight}</em></>}</h1>
            {data.body && <p className="section-copy">{data.body}</p>}
            <div className="dynamic-hero-actions">
              <OptionalLink href={data.button_url}>{data.button_label}</OptionalLink>
              <OptionalLink className="button button-outline" href={data.secondary_button_url}>{data.secondary_button_label}</OptionalLink>
            </div>
          </div>
          {image && <img src={image} alt={data.image_alt || ''} loading="lazy" />}
        </div>
      </section>
    )
  }

  if (section.type === 'service_pages') {
    return <ServicePagesSection data={data} />
  }

  if (section.type === 'text') {
    return (
      <section className="section-space">
        <div className="site-width dynamic-text">
          {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
          <h2 className="section-title">{data.title}</h2>
          {data.body && <p className="section-copy dynamic-copy">{data.body}</p>}
        </div>
      </section>
    )
  }

  if (section.type === 'image_text') {
    const image = safeImageUrl(data.image_url)
    return (
      <section className={`section-space${data.variant === 'doctor' ? ' bg-sage dynamic-doctor-section' : ''}`}>
        <div className={`site-width dynamic-split${image ? '' : ' dynamic-split-no-image'}${data.image_side === 'right' ? ' image-right' : ''}`}>
          {image && (
            <div className="dynamic-image-with-caption">
              <img src={image} alt={data.image_alt || ''} loading="lazy" />
              {(data.caption_title || data.caption_subtitle) && (
                <div className="dynamic-image-caption">
                  {data.caption_title && <h3>{data.caption_title}</h3>}
                  {data.caption_subtitle && <p>{data.caption_subtitle}</p>}
                </div>
              )}
            </div>
          )}
          <div>
            {data.eyebrow && <p className="eyebrow">{data.eyebrow}</p>}
            <h2 className="section-title">{data.title}</h2>
            {data.body && <p className="section-copy dynamic-copy">{data.body}</p>}
            {Array.isArray(data.features) && data.features.length > 0 && (
              <ul className="dynamic-image-features">
                {data.features.map((feature, index) => <li key={`${feature}-${index}`}>{feature}</li>)}
              </ul>
            )}
            {data.button_label && <OptionalLink href={data.button_url}>{data.button_label}</OptionalLink>}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'cards') {
    return (
      <section className="section-space">
        <div className="site-width">
          <h2 className="section-title">{data.title}</h2>
          {data.intro && <p className="section-copy">{data.intro}</p>}
          <div className="dynamic-card-grid">
            {(Array.isArray(data.items) ? data.items : []).map((item, index) => {
              const image = safeImageUrl(item.image_url)
              return (
                <article className="dynamic-card" key={`${item.title}-${index}`}>
                  {image && <img className="dynamic-card-image" src={image} alt={item.image_alt || ''} loading="lazy" />}
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  if (section.type === 'faq') {
    return <FaqAccordion title={data.title} intro={data.intro} items={data.items} appointmentUrl={settings.appointment_url} />
  }

  if (section.type === 'faq_collection') {
    return section.faq_collection
      ? <FaqAccordion {...section.faq_collection} appointmentUrl={settings.appointment_url} />
      : null
  }

  if (section.type === 'cta') {
    return (
      <section className="cta-band">
        <div className="site-width cta-inner">
          <div>
            <h2>{data.title}</h2>
            {data.body && <p>{data.body}</p>}
          </div>
          <OptionalLink href={data.button_url}>{data.button_label}</OptionalLink>
        </div>
      </section>
    )
  }

  if (section.type === 'contact_profile') {
    return <ContactProfile data={data} settings={settings} />
  }

  if (section.type === 'lead_form') {
    return (
      <LeadForm
        initialType="contact"
        eyebrow={data.eyebrow}
        title={data.title}
        intro={data.intro}
        submitLabel={data.submit_label}
      />
    )
  }

  if (section.type === 'blog_posts') {
    return <BlogHighlights data={data} />
  }

  return null
}

import { useState } from 'react'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLink from './AppLink.jsx'
import NewsletterForm from './NewsletterForm.jsx'
import RichContent from './RichContent.jsx'
import { GlobalCustomCode } from './CustomCode.jsx'

function menuTree(items) {
  return items
    .filter((item) => item.parent_id === null)
    .map((item) => ({
      ...item,
      children: items.filter((child) => child.parent_id === item.id),
    }))
}

function MenuLink({ item, onNavigate }) {
  return (
    <AppLink href={item.url || '/'} onClick={onNavigate}>
      {item.label}
    </AppLink>
  )
}

export function SiteHeader({ items = [], settings = {} }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menu = menuTree(items)
  const closeMenu = () => setMenuOpen(false)
  const siteName = settings.site_name || 'Nius We Care'
  const phoneNumber = settings.phone_number || ''
  const appointmentLabel = settings.appointment_label || 'Book Appointment'
  const appointmentUrl = settings.appointment_url || '/contact-us?type=appointment'

  return (
    <>
      <GlobalCustomCode settings={settings} />
      {(settings.topbar_text || (phoneNumber && settings.phone_link)) && (
        <div className="topbar">
          <div className="site-width topbar-inner">
            {settings.topbar_text && <span>{settings.topbar_text}</span>}
            {phoneNumber && settings.phone_link && <a href={settings.phone_link}>{phoneNumber}</a>}
          </div>
        </div>
      )}
      <header className="header">
        <div className="site-width nav-inner">
          <Link className="brand" aria-label={`${siteName} home`} to="/">
            {settings.logo_url
              ? <img className="brand-mark" src={settings.logo_url} alt={siteName} />
              : <span>{siteName}</span>}
          </Link>
          <nav className="nav-links" aria-label="Main navigation">
            {menu.map((item) => (
              item.children.length > 0 ? (
                <div className="nav-item" key={item.id}>
                  <a className="nav-trigger" href={item.url || '#'}>
                    {item.label}<ChevronDown size={14} aria-hidden="true" />
                  </a>
                  <div className="nav-dropdown">
                    {item.children.map((child) => <MenuLink key={child.id} item={child} />)}
                  </div>
                </div>
              ) : <MenuLink key={item.id} item={item} />
            ))}
          </nav>
          <AppLink className="header-cta" href={appointmentUrl}>{appointmentLabel}<ArrowUpRight size={16} /></AppLink>
          <button
            type="button"
            className="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {menu.map((item) => (
              <div className="mobile-nav-group" key={item.id}>
                <MenuLink item={item} onNavigate={closeMenu} />
                {item.children.map((child) => <MenuLink key={child.id} item={child} onNavigate={closeMenu} />)}
              </div>
            ))}
            <AppLink className="header-cta" href={appointmentUrl} onClick={closeMenu}>{appointmentLabel}</AppLink>
          </nav>
        )}
      </header>
    </>
  )
}

export function SiteFooter({ items = [], settings = {} }) {
  const groups = menuTree(items)
  const siteName = settings.site_name || 'Nius We Care'

  return (
    <>
      {settings.global_cta && <RichContent html={settings.global_cta} appointmentUrl={settings.appointment_url} />}
      <footer className="footer">
        <div className="site-width footer-grid">
          <div>
            <Link className="brand" aria-label={`${siteName} home`} to="/">
              {settings.logo_url
                ? <img className="brand-mark" src={settings.logo_url} alt={siteName} />
                : <span>{siteName}</span>}
            </Link>
            {settings.footer_description && <p className="footer-intro">{settings.footer_description}</p>}
            <div className="footer-contact">
              {settings.phone_number && <p>{settings.phone_link ? <a href={settings.phone_link}>{settings.phone_number}</a> : settings.phone_number}</p>}
              {settings.contact_email && <p><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></p>}
              {settings.clinic_address && <p>{settings.clinic_address}</p>}
            </div>
          </div>
          {groups.map((group) => (
            <div key={group.id}>
              <h3>{group.label}</h3>
              <div className="footer-links">
                {group.children.map((item) => <MenuLink key={item.id} item={item} />)}
              </div>
            </div>
          ))}
          <section className="footer-newsletter" aria-labelledby="footer-newsletter-title">
            {settings.newsletter_eyebrow && <p className="eyebrow">{settings.newsletter_eyebrow}</p>}
            <h3 id="footer-newsletter-title">{settings.newsletter_title || 'Subscribe for updates'}</h3>
            {settings.newsletter_description && <p>{settings.newsletter_description}</p>}
            <NewsletterForm />
          </section>
        </div>
      </footer>
    </>
  )
}


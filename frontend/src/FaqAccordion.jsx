import { useId } from 'react'
import { ArrowRight, ArrowUpRight, CalendarDays } from 'lucide-react'
import AppLink from './AppLink.jsx'

export default function FaqAccordion({
  title,
  intro,
  items,
  appointmentUrl = '/contact-us?type=appointment',
}) {
  const accordionName = useId()
  const questions = Array.isArray(items)
    ? items.filter((item) => item.question?.trim() && item.answer?.trim())
    : []

  if (questions.length === 0) return null

  return (
    <section className="faq-module-section">
      <div className="site-width faq-module">
        <div className="faq-module-intro">
          <p className="eyebrow">Answers that bring clarity</p>
          <h2 className="section-title">{title || 'Frequently asked questions'}</h2>
          {intro && <p className="section-copy">{intro}</p>}
          <AppLink className="button button-outline faq-contact-button" href={appointmentUrl}>
            <CalendarDays size={18} aria-hidden="true" />
            Ask Our Fertility Team
            <ArrowUpRight size={17} aria-hidden="true" />
          </AppLink>
        </div>
        <div className="faq-module-list">
          {questions.map((item, index) => (
            <details key={`${item.question}-${index}`} name={accordionName}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-module-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="faq-module-answer">{item.answer}</div>
            </details>
          ))}
          <AppLink className="text-link faq-resource-link" href="/resources">
            More answers &amp; patient resources
            <ArrowRight size={16} aria-hidden="true" />
          </AppLink>
        </div>
      </div>
    </section>
  )
}

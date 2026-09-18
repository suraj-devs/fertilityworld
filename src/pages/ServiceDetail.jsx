import { procedureDetails, treatmentDetails } from '../data/content'

function ServiceDetail({ slug, onNavigate, type = 'service' }) {
  const treatment = type === 'procedure' ? procedureDetails[slug] : treatmentDetails[slug]
  const pageData = treatment || treatmentDetails.ivf

  return (
    <section className="container py-5">
      <div className="row align-items-center g-5 mb-5">
        <div className="col-lg-6">
          <img src={pageData.image} alt={`${pageData.title} at Fertility World`} className="img-fluid rounded-4" />
        </div>
        <div className="col-lg-6">
          <p className="srv-subtitle mb-3">{pageData.eyebrow}</p>
          <h1 className="display-5 fw-semibold mb-3">{pageData.title}</h1>
          <p className="lead">{pageData.description}</p>
          <button type="button" className="callaction px-4 py-2 rounded-3 border-0 mt-3" onClick={() => onNavigate('contact')}>
            Book a consultation
          </button>
        </div>
      </div>
      <div className="text-center mb-4"><span className="srv-subtitle mb-3">Your treatment journey</span><h2 className="fw-light">A clear path, <span className="fw-bold">one step at a time</span></h2></div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-3 mb-5">
        {pageData.process.map(([number, title, description]) => <div className="col" key={number}><article className="card-box rounded-3 p-3 h-100"><span className="srv-subtitle fw-bold">{number}</span><h2 className="h5 mt-2">{title}</h2><p className="mb-0">{description}</p></article></div>)}
      </div>
      <div className="row g-5 mb-5">
        <div className="col-lg-6"><h2 className="h3 mb-4">Why this treatment may help</h2><ul className="list-group">{pageData.benefits.map((benefit) => <li className="list-group-item" key={benefit}>{benefit}</li>)}</ul></div>
        <div className="col-lg-6"><h2 className="h3 mb-4">Who may consider it?</h2><ul className="list-group">{pageData.suitableFor.map((candidate) => <li className="list-group-item" key={candidate}>{candidate}</li>)}</ul></div>
      </div>
      <div className="row justify-content-center"><div className="col-lg-9"><div className="text-center mb-4"><span className="srv-subtitle mb-3">Common questions</span><h2 className="fw-light">What patients often <span className="fw-bold">ask</span></h2></div><div className="accordion" id={`faq-${slug}`}>{pageData.faqs.map(([question, answer], index) => <div className="accordion-item" key={question}><h3 className="accordion-header"><button className={`accordion-button ${index ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#${slug}-faq-${index}`} aria-expanded={index === 0}>{question}</button></h3><div id={`${slug}-faq-${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent={`#faq-${slug}`}><div className="accordion-body">{answer}</div></div></div>)}</div></div></div>
      <div className="counterCTA_block rounded-4 px-4 py-5 text-center mt-5"><h2 className="text-white">Ready to discuss {pageData.title}?</h2><p className="text-white mb-4">Our team can explain your options and create a plan around your needs.</p><button type="button" className="callaction px-4 py-2 rounded-3 border-0" onClick={() => onNavigate('contact')}>Book a consultation</button></div>
    </section>
  )
}

export default ServiceDetail
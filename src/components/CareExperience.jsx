const processSteps = [
  ['01', 'Initial consultation', 'Discuss your history, goals and the fertility assessment that may be right for you.'],
  ['02', 'Personalized plan', 'Your care team explains treatment options, timelines and expected next steps.'],
  ['03', 'Treatment and monitoring', 'Regular guidance and monitoring help keep your treatment plan clear and supported.'],
  ['04', 'Embryology care', 'Our treatment approach prioritizes careful laboratory processes and informed decisions.'],
  ['05', 'Follow-up support', 'Stay connected with the care team after treatment with guidance for the next stage.'],
]

const reasons = [
  ['Personalized care', 'Treatment plans are shaped around your health, history and family-building goals.'],
  ['Clear communication', 'Understand your options, timelines and costs before making important decisions.'],
  ['Experienced support', 'A coordinated care team stays with you throughout the fertility journey.'],
  ['Patient-first experience', 'Comfort, privacy and emotional wellbeing matter at every appointment.'],
]

const faqs = [
  ['What is the first step in fertility treatment?', 'Start with a consultation and fertility assessment. Your specialist can then explain suitable treatment options and next steps.'],
  ['How do I know whether IVF, IUI or ICSI is right for me?', 'The right treatment depends on factors such as age, ovulation, sperm health, medical history and previous treatment. A specialist assessment helps guide that decision.'],
  ['Is fertility treatment successful for everyone?', 'Outcomes vary between individuals and treatment plans. Your care team can discuss the factors that may affect your personal chances and expectations.'],
  ['How can I book a consultation?', 'Use the consultation form or contact the Fertility World care team directly to discuss your requirements.'],
]

function CareExperience({ onNavigate }) {
  return (
    <>
      <section className="container py-5">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <img src="/media/banner-profile.png" alt="Fertility World care team" className="img-fluid rounded-4" />
          </div>
          <div className="col-lg-7">
            <span className="srv-subtitle mb-3">Care that feels personal</span>
            <h2 className="fw-light">A clearer, kinder path to <span className="fw-bold">parenthood</span></h2>
            <p className="lead">Fertility World combines modern fertility treatment with thoughtful guidance, so you can make informed decisions without feeling alone.</p>
            <div className="row row-cols-2 g-3 mt-3">
              <div className="col"><strong className="d-block fs-3">25+</strong><span>Years of experience</span></div>
              <div className="col"><strong className="d-block fs-3">20,000+</strong><span>Families supported</span></div>
            </div>
            <button type="button" className="callaction px-4 py-2 rounded-3 border-0 mt-4" onClick={() => onNavigate('about')}>Meet our approach</button>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: 'var(--color-light-bg)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="srv-subtitle mb-3">Your treatment journey</span>
            <h2 className="fw-light">Five steps, <span className="fw-bold">one supported journey</span></h2>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-5 g-3">
            {processSteps.map(([number, title, description]) => (
              <div className="col" key={number}>
                <article className="card-box h-100 rounded-3 p-3">
                  <span className="srv-subtitle fw-bold">{number}</span>
                  <h3 className="h5 mt-2">{title}</h3>
                  <p className="mb-0">{description}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="text-center mb-5">
          <span className="srv-subtitle mb-3">Why choose Fertility World</span>
          <h2 className="fw-light">Support that goes beyond <span className="fw-bold">the appointment</span></h2>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
          {reasons.map(([title, description]) => (
            <article className="col" key={title}><div className="h-100 border rounded-3 p-4"><h3 className="h5">{title}</h3><p className="mb-0">{description}</p></div></article>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <div className="row justify-content-center"><div className="col-lg-9">
          <div className="text-center mb-4"><span className="srv-subtitle mb-3">Common questions</span><h2 className="fw-light">Answers before you <span className="fw-bold">begin</span></h2></div>
          <div className="accordion" id="fertility-faq">
            {faqs.map(([question, answer], index) => (
              <div className="accordion-item" key={question}>
                <h3 className="accordion-header"><button className={`accordion-button ${index ? 'collapsed' : ''}`} type="button" data-bs-toggle="collapse" data-bs-target={`#faq-${index}`} aria-expanded={index === 0} aria-controls={`faq-${index}`}>{question}</button></h3>
                <div id={`faq-${index}`} className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} data-bs-parent="#fertility-faq"><div className="accordion-body">{answer}</div></div>
              </div>
            ))}
          </div>
        </div></div>
      </section>

      <section className="container pb-5">
        <div className="counterCTA_block rounded-4 px-4 py-5 text-center">
          <h2 className="text-white">Ready to take the next step?</h2>
          <p className="text-white mb-4">Talk with our care team about your fertility goals.</p>
          <div className="d-flex justify-content-center flex-wrap gap-3">
            <button type="button" className="callaction px-4 py-2 rounded-3 border-0" onClick={() => onNavigate('contact')}>Book consultation</button>
            <a className="callaction blankBtn px-4 py-2 rounded-3" href="https://wa.me/918743987787" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  )
}

export default CareExperience
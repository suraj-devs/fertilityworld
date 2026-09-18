function LegalPage({ type }) {
  const isPrivacy = type === 'privacy-policy'
  const title = isPrivacy ? 'Privacy Policy' : 'Terms and Conditions'
  const intro = isPrivacy ? 'We respect the privacy of people who contact Fertility World. This policy explains how information shared through our website may be used to respond to enquiries and coordinate care.' : 'These terms explain the responsible use of the Fertility World website and the limits of online medical information.'

  return (
    <article className="container py-5"><div className="row justify-content-center"><div className="col-lg-9">
      <span className="srv-subtitle mb-3">Fertility World</span><h1 className="display-6 fw-semibold mb-4">{title}</h1><p className="lead">{intro}</p>
      <h2 className="h3 mt-5">Website information</h2><p>Content on this website is for general education and does not replace a consultation, diagnosis or treatment plan from a qualified healthcare professional.</p>
      <h2 className="h3 mt-4">Information and communication</h2><p>When you contact us, we may use the details you provide to respond to your enquiry, arrange an appointment, share requested information and provide care-related follow-up. We do not sell personal information.</p>
      <h2 className="h3 mt-4">Your choices</h2><p>You may ask us to correct information you have shared or stop non-essential communication. Medical records and legally required information may need to be retained according to applicable requirements.</p>
      <h2 className="h3 mt-4">Medical and legal compliance</h2><p>Fertility treatment decisions require professional assessment and informed consent. Fertility World does not support sex selection and follows applicable Indian laws and clinical standards.</p>
      <h2 className="h3 mt-4">Contact</h2><p>For questions about this {isPrivacy ? 'policy' : 'website'}, contact <a href="mailto:surajsh64@gmail.com">surajsh64@gmail.com</a> or call <a href="tel:+918743987787">+91 874 398 7787</a>.</p>
    </div></div></article>
  )
}

export default LegalPage
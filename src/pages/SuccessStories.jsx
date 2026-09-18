const stories = [
  ['A journey with renewed hope', 'After years of uncertainty, personalized guidance helped this family understand their options and move forward with confidence.', 'IVF care and ongoing support'],
  ['Answers that changed the plan', 'A detailed fertility assessment gave this couple clearer answers and a treatment path shaped around their needs.', 'Fertility assessment and treatment planning'],
  ['Support at every appointment', 'Consistent communication and compassionate follow-up made each step of the treatment journey feel more manageable.', 'IUI care and follow-up support'],
]

function SuccessStories({ onNavigate }) {
  return (
    <section className="container py-5">
      <div className="row align-items-center g-5 mb-5"><div className="col-lg-6"><span className="srv-subtitle mb-3">Patient journeys</span><h1 className="display-5 fw-semibold mb-3">Every family has a unique story</h1><p className="lead">Our patients come to us with different experiences, questions and hopes. We focus on listening first and building care around each journey.</p><button type="button" className="callaction px-4 py-2 rounded-3 border-0 mt-3" onClick={() => onNavigate('contact')}>Start your conversation</button></div><div className="col-lg-6"><img src="/media/baby-cta-banner.jpg" alt="A new beginning with Fertility World" className="img-fluid rounded-4" /></div></div>
      <div className="row row-cols-1 row-cols-md-3 g-4"><div className="col"><div className="card-box rounded-3 p-4 h-100 text-center"><strong className="d-block fs-2">20,000+</strong><span>families supported</span></div></div><div className="col"><div className="card-box rounded-3 p-4 h-100 text-center"><strong className="d-block fs-2">25+</strong><span>years of experience</span></div></div><div className="col"><div className="card-box rounded-3 p-4 h-100 text-center"><strong className="d-block fs-2">1:1</strong><span>personalized guidance</span></div></div></div>
      <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">{stories.map(([title, quote, treatment]) => <article className="col" key={title}><div className="border rounded-3 p-4 h-100"><h2 className="h4">{title}</h2><p>“{quote}”</p><span className="srv-subtitle">{treatment}</span></div></article>)}</div>
    </section>
  )
}

export default SuccessStories
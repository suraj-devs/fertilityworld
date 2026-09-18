const packages = [
  ['Initial consultation', 'Personalized fertility assessment and treatment discussion'],
  ['Treatment planning', 'Clear plan covering tests, timeline and next steps'],
  ['Laboratory care', 'Coordinated embryology and monitoring support'],
  ['Follow-up guidance', 'Support after treatment and during the next stage'],
]

function Pricing({ onNavigate }) {
  return (
    <section className="container py-5">
      <div className="row justify-content-center text-center mb-5"><div className="col-lg-8">
        <span className="srv-subtitle mb-3">Clear fertility care</span>
        <h1 className="display-5 fw-semibold mb-3">Transparent planning for your fertility journey</h1>
        <p className="lead">Every treatment plan is different. We explain the expected tests, treatment steps and costs before you begin.</p>
      </div></div>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
        {packages.map(([title, description]) => <article className="col" key={title}><div className="card-box rounded-3 p-4 h-100"><h2 className="h5">{title}</h2><p className="mb-0">{description}</p></div></article>)}
      </div>
      <div className="table-responsive border rounded-3 mb-5">
        <table className="table align-middle mb-0"><caption className="p-3 text-start">Typical planning areas discussed during a fertility consultation</caption><thead><tr><th>Care area</th><th>What it may include</th><th>How it is confirmed</th></tr></thead><tbody>
          <tr><td>Assessment</td><td>Consultation, history and recommended investigations</td><td>After specialist review</td></tr>
          <tr><td>Medication and monitoring</td><td>Medication guidance, scans and cycle monitoring</td><td>Based on your treatment plan</td></tr>
          <tr><td>Procedure and laboratory care</td><td>Procedure, embryology and transfer-related care</td><td>Shared before treatment begins</td></tr>
          <tr><td>Storage and follow-up</td><td>Embryo or egg storage and follow-up appointments</td><td>Discussed with your care coordinator</td></tr>
        </tbody></table>
      </div>
      <div className="counterCTA_block rounded-4 px-4 py-5 text-center"><h2 className="text-white">Need a treatment estimate?</h2><p className="text-white mb-4">Talk to our team about your medical needs and a transparent care plan.</p><button type="button" className="callaction px-4 py-2 rounded-3 border-0" onClick={() => onNavigate('contact')}>Request a consultation</button></div>
    </section>
  )
}

export default Pricing
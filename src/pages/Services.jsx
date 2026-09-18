const services = [
  {
    slug: 'ivf',
    title: 'IVF Treatment',
    description: 'A carefully planned in-vitro fertilization program supported by experienced fertility specialists and modern technology.',
    image: '/media/ivf-treatment-img.png',
  },
  {
    slug: 'icsi',
    title: 'ICSI Treatment',
    description: 'A focused assisted reproduction option that helps fertilization when additional support is needed.',
    image: '/media/icsi-treatment-img.png',
  },
  {
    slug: 'iui',
    title: 'IUI Treatment',
    description: 'A minimally invasive fertility treatment designed to improve the chance of conception during ovulation.',
    image: '/media/iui-treatment-img.png',
  },
  {
    slug: 'egg-freezing',
    title: 'Egg Freezing',
    description: 'Preserve your fertility options for the future with personalized egg freezing guidance and care.',
    image: '/media/egg-treatment-img.png',
  },
  {
    slug: 'surrogacy',
    title: 'Surrogacy Programs',
    description: 'Compassionate support and coordinated care for families exploring a surrogacy journey.',
    image: '/media/surrogacy-treatment-img.png',
  },
  {
    slug: 'donor-programs',
    title: 'Donor Programs',
    description: 'Confidential donor treatment support with guidance through each step of your family-building plan.',
    image: '/media/doner-program-treatment-img.png',
  },
  {
    slug: 'male-diagnosis',
    title: 'Male Fertility Diagnosis',
    description: 'Understand sperm health, hormonal factors and useful next steps through a confidential assessment.',
    image: '/media/banner-profile.png',
  },
  {
    slug: 'genetic-testing',
    title: 'Genetic Testing',
    description: 'Get specialist guidance on selected genetic and reproductive diagnostic options.',
    image: '/media/mockup.jpeg',
  },
]

const procedures = [
  ['car-t-cell-therapy', 'CAR T-Cell Therapy', 'Advanced immune-cell treatment assessment and coordinated oncology care.', '/media/global-service-list.jpg'],
  ['bariatric-surgery', 'Bariatric Surgery', 'Structured surgical weight-management care with assessment and follow-up.', '/media/mockup.jpeg'],
  ['bone-marrow-transplant', 'Bone Marrow Transplant (BMT)', 'Specialist transplant evaluation and coordinated recovery support.', '/media/global-service-list.jpg'],
  ['brain-stroke-treatment', 'Brain Stroke Treatment', 'Urgent neurological assessment and recovery planning for stroke care.', '/media/banner-profile.png'],
  ['brain-tumour-surgery', 'Brain Tumour Surgery', 'Neurosurgical evaluation and clear treatment planning for brain tumours.', '/media/global-service-list.jpg'],
  ['breast-reduction-surgery', 'Breast Reduction Surgery', 'Personalized surgical assessment for physical discomfort and quality of life.', '/media/cta-banner.jpg'],
]

function Services({ onNavigate }) {
  return (
    <main>
      <section className="container py-5">
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <p className="srv-subtitle mb-3">Personalized fertility care</p>
            <h1 className="display-5 fw-semibold mb-3">Fertility treatments for your next chapter</h1>
            <p className="lead mb-0">
              From diagnosis to treatment and follow-up, our team helps you make
              informed decisions with expert guidance and compassionate care.
            </p>
          </div>
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {services.map((service) => (
            <div className="col" key={service.title}>
              <article className="card-box rounded-3 h-100 p-3">
                <img src={service.image} alt={`${service.title} at Fertility World`} className="img-fluid w-100 img-box mb-3" />
                <h2 className="h4"><a href={`/service/${service.slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`service-detail:${service.slug}`) }}>{service.title}</a></h2>
                <p className="mb-0">{service.description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
      <section className="container pb-5">
        <div className="text-center mb-4"><p className="srv-subtitle mb-3">Specialist procedures</p><h2 className="fw-light">More treatment pathways, <span className="fw-bold">clearer guidance</span></h2><p className="lead">Explore specialist procedure pages to understand the typical process, benefits and questions to discuss with your doctor.</p></div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {procedures.map(([slug, title, description, image]) => <div className="col" key={slug}><article className="card-box rounded-3 h-100 p-3"><img src={image} alt={`${title} at Fertility World`} className="img-fluid w-100 img-box mb-3" /><h2 className="h4"><a href={`/procedure/${slug}`} onClick={(event) => { event.preventDefault(); onNavigate(`procedure-detail:${slug}`) }}>{title}</a></h2><p className="mb-0">{description}</p></article></div>)}
        </div>
      </section>
      <section className="container pb-5">
        <div className="counterCTA_block rounded-4 px-4 py-5 text-center">
          <h2 className="text-white mb-3">Not sure which treatment is right for you?</h2>
          <p className="text-white mb-4">Speak with our care team and get a plan tailored to your fertility goals.</p>
          <button type="button" className="callaction px-4 py-2 rounded-3 border-0" onClick={() => onNavigate('contact')}>
            Book a consultation
          </button>
        </div>
      </section>
    </main>
  )
}

export default Services
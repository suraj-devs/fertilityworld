import { ArrowRightStroke } from '@boxicons/react';
const Treatment = ({ onNavigate }) => {
    return (
        <section id="specialists">
        <div className="container py-4 py-lg-5">
            <div className="d-md-flex align-items-center justify-content-between gap-4 mb-4">
                <div className="section-header">
                    <span className="srv-subtitle mb-3">Our fertility treatments</span>
                    <h2 className="mb-2 fw-light">Personalized care for your <span className="fw-bold">parenthood journey</span></h2>
                    <p>Explore evidence-informed fertility treatments designed around your health, goals and family-building plans.</p>
                </div>
                <div className="py-2">
                    <a href="/services" onClick={(event) => { event.preventDefault(); onNavigate('services') }} data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">View All Treatments <ArrowRightStroke size={24} className="ms-2" /></a>
                </div>
            </div>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-lg-3 g-3">
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/ivf-treatment-img.png" alt="IVF treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">IVF Treatment</h3>
                        <p>Personalized IVF care from assessment through embryo transfer.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/icsi-treatment-img.png" alt="ICSI treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">ICSI Treatment</h3>
                        <p>Advanced fertilization support as part of an IVF plan.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/iui-treatment-img.png" alt="IUI treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">IUI Treatment</h3>
                        <p>A minimally invasive option timed around ovulation.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/egg-treatment-img.png" alt="Egg freezing treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">EGG Treatment</h3>
                        <p>Preserve reproductive options for a future family.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/surrogacy-treatment-img.png" alt="Surrogacy treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">Surrogacy Treatment</h3>
                        <p>Coordinated support for families considering surrogacy.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="/media/doner-program-treatment-img.png" alt="Donor program treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">Doner Program Treatment</h3>
                        <p>Confidential guidance for donor-assisted treatment.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
} 
export default Treatment
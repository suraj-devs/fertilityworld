import { ArrowRightStroke } from '@boxicons/react';
const SectionBlock = () => {
    return (
        <section id="specialists">
        <div className="container py-4 py-lg-5">
            <div className="d-md-flex align-items-center justify-content-between gap-4 mb-4">
                <div className="section-header">
                    <span className="srv-subtitle mb-3">Fertility insights</span>
                    <h2 className="mb-2 fw-light">Helpful guidance for <span className="fw-bold">your next step</span></h2>
                    <p>Read practical guidance about fertility treatment, preservation and the path to parenthood.</p>
                </div>
                <div className="py-2">
                    <a href="/blog-list" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">View All Articles <ArrowRightStroke size={24} className="ms-2" /></a>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-lg-3 g-3">
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="/media/blo-img-1.jpg" alt="IVF fertility guide" className="img-fluid w-100 img-blog-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">IVF Treatment</h3>
                            <p className="mb-2">Learn about the main stages of IVF and the questions to discuss with your specialist.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="/blog/understanding-ivf-treatment" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Read more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="/media/blo-img-2.jpg" alt="IUI fertility guide" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">ICSI Treatment</h3>
                            <p className="mb-2">Discover how IUI works and which fertility factors influence treatment.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="/blog/when-to-consider-iui" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Read more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="/media/blo-img-3.jpg" alt="Egg freezing fertility guide" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">IUI Treatment</h3>
                            <p className="mb-2">Explore how egg freezing may preserve future family-building options.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="/blog/fertility-preservation-options" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Read more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="/media/blo-img-4.jpg" alt="Surrogacy fertility guide" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">EGG Treatment</h3>
                            <p className="mb-2">Medical and emotional support both matter throughout surrogacy.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="/blog/support-during-surrogacy" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Read more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
} 
export default SectionBlock
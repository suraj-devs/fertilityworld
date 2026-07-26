import { ArrowRightStroke } from '@boxicons/react';
const SectionBlock = () => {
    return (
        <section id="specialists">
        <div className="container py-4 py-lg-5">
            <div className="d-md-flex align-items-center justify-content-between gap-4 mb-4">
                <div className="section-header">
                    <span className="srv-subtitle mb-3">We Care India</span>
                    <h3 className="mb-2 fw-light">Connecting global markets, <span className="fw-bold">Delivering <span className="d-none d-lg-block"></span>Opportunities</span></h3>
                    <p>we are a dynamic and customer-centric export and import business committed to providing high-quality products and seamless trade solutions. With a passion for fostering global partnerships, we bridge the gap between India and the world, ensuring that goods flow effortlessly across borders.</p>
                </div>
                <div className="py-2">
                    <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">View All Treatments <ArrowRightStroke size={24} className="ms-2" /></a>
                </div>
            </div>
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-lg-3 g-3">
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="./media/blo-img-1.jpg" alt="Blog" className="img-fluid w-100 img-blog-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">IVF Treatment</h3>
                            <p className="mb-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Reade more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="./media/blo-img-2.jpg" alt="Blog" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">ICSI Treatment</h3>
                            <p className="mb-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Reade more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="./media/blo-img-3.jpg" alt="Blog" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">IUI Treatment</h3>
                            <p className="mb-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Reade more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 card-box blog-card-box rounded-3 overflow-hidden">
                        <img src="./media/blo-img-4.jpg" alt="Blog" className="img-fluid w-100 img-box" />
                        <div className="p-3">
                            <h3 className="fs-5 lh-sm mb-2">EGG Treatment</h3>
                            <p className="mb-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                            <span className="d-block mb-3 fs-6">July 14, 2026</span>
                            <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Reade more <ArrowRightStroke size={24} className="ms-2" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
} 
export default SectionBlock
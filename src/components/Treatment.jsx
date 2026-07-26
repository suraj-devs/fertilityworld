import { ArrowRightStroke } from '@boxicons/react';
const Treatment = () => {
    return (
        <section id="specialists">
        <div className="container py-4 py-lg-5">
            <div className="d-md-flex align-items-center justify-content-between gap-4 mb-4">
                <div className="section-header">
                    <span className="srv-subtitle  mb-3">We Care India</span>
                    <h3 className="mb-2 fw-light">Connecting global markets, <span className="fw-bold">Delivering <span className="d-none d-lg-block"></span>Opportunities</span></h3>
                    <p>we are a dynamic and customer-centric export and import business committed to providing high-quality products and seamless trade solutions. With a passion for fostering global partnerships, we bridge the gap between India and the world, ensuring that goods flow effortlessly across borders.</p>
                </div>
                <div className="py-2">
                    <a href="#" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">View All Treatments <ArrowRightStroke size={24} className="ms-2" /></a>
                </div>
            </div>
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-6 g-lg-3 g-3">
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/ivf-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">IVF Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/icsi-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">ICSI Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/iui-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">IUI Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/egg-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">EGG Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/surrogacy-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">Surrogacy Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
                <div className="col">
                    <div className="h-100 p-3 card-box rounded-3">
                        <img src="./media/doner-program-treatment-img.png" alt="ivf-treatment" className="img-fluid w-100 img-box" />
                        <h3 className="fs-5 lh-sm mb-2">Doner Program Treatment</h3>
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Error, non.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
} 
export default Treatment
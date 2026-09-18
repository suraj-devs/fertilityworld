import {ArrowRightStroke} from '@boxicons/react'
const CallToAction = () => {
    return (
        <section id="counterCTA">
            <div className="container py-4 py-lg-4">
                <div className="counterCTA_block rounded-4 px-4 py-5">
                    <div className="row g-lg-4 g-3">
                        <div className="col-md-6 col-lg-4">
                            <div className="section-header">
                                <span className="srv-subtitle text-white mb-3">Why Choose Fertility World</span>
                                <h3 className="mb-2 fw-bold text-white">Your journey, Our Commitment</h3>
                                <p className="text-white">we are a dynamic and customer-centric export and ensuring that goods flow effortlessly across borders.</p>
                                <a href="/about" data-sidebtn="true" className="callaction px-3 py-2 rounded-3 blankBtn d-inline-flex flex-nowrap">Know More About Us <ArrowRightStroke size={24} className="ms-2" /></a>
                            </div>
                        </div>
                        <div className="col-lg-8 col-md-6">
                            <div className="counterBox d-flex flex-wrap align-content-center gap-2 w-100 h-100 text-center">
                                <div className="counter_box">
                                    <h3 className="text-white fw-bolder fs-1 mb-2"><span>25</span>+</h3>
                                    <p className="fs-6 text-white lh-sm mb-0">Year<span className="d-none d-lg-block"></span> of Experience</p>
                                </div>
                                {/* <!-- Col --> */}
                                <div className="counter_box">
                                    <h3 className="text-white fw-bolder fs-1 mb-2"><span>20000</span>+</h3>
                                    <p className="fs-6 text-white lh-sm mb-0">Happy<span className="d-none d-lg-block"></span> Families</p>
                                </div>
                                {/* <!-- Col --> */}
                                <div className="counter_box">
                                    <h3 className="text-white fw-bolder fs-1 mt-3 mt-lg-0 mb-2"><span>96</span>%</h3>
                                    <p className="fs-6 text-white lh-sm mb-0">Success<span className="d-none d-lg-block"></span> Rate</p>
                                </div>
                                {/* <!-- Col --> */}
                                <div className="counter_box">
                                    <h3 className="text-white fw-bolder fs-1 mt-3 mt-lg-0 mb-2"><span>50</span>+</h3>
                                    <p className="fs-6 text-white lh-sm mb-0">Country<span className="d-none d-lg-block"></span> Saved</p>
                                </div>
                                {/* <!-- Col --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 
export default CallToAction
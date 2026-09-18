import { ArrowRightStroke } from '@boxicons/react';
const CallToActionTwo = () => {
    return (
        <section id="counterCTA">
            <div className="container-fluid">
                <div className="counterCTA_block counterCTA_block2 rounded-4 p-4">
                    <div className="d-md-flex align-items-center container justify-content-between gap-4">
                        <div className="section-header mb-3 mb-md-0 col-lg-3 col-md-6">
                            <h3 className="mb-2 fw-bold text-white">Ready to Start Your Parenthood Journey?</h3>
                            <p className="text-white mb-0">Our fertility experts are here to guide you every step of the way.</p>
                        </div>
                        <div className="py-2">
                            <a href="/contact" data-sidebtn="true" className="callaction px-4 py-3 rounded-pill blankBtn d-inline-flex flex-nowrap mb-3">Book Free Consultation <ArrowRightStroke size={24} className="ms-2" /></a><br/>
                            <a href="tel:+918743987787" data-sidebtn="true" className="callaction px-4 py-3 rounded-pill blankBtn d-inline-flex flex-nowrap w-100">+91 874 398 7787 <ArrowRightStroke size={24} className="me-md-2" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 
export default CallToActionTwo
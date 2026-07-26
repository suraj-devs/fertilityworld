import Button from "../components/Buttons"
import HomeStrip from "../components/HomeStrip"
import { LaurelWreath, TrophyStar, Group, BadgeCheck } from '@boxicons/react';

function Banner() {
    return (
    <>
    <section id="camera-section" className="main-slider position-relative py-4 py-lg-5">
        <div className="container py-4 py-lg-5">
            <div className="row row-cols-1 row-cols-md-2">
                <div className="col">
                    <div className="banner-content">
                        <div className="section-header">
                            <span className="srv-subtitle mb-3 border p-2 rounded-3 d-inline-flex bg-white gap-2"><LaurelWreath /> India's Most Trusted Fertility & Surrogacy Expert</span>
                            <h1 className="mb-2">Building Families Creating Happiness Advanced fertility</h1>
                            <p>Advanced fertility treatments, world-class technology and personalized care to help you achieve your parenthood dreams.</p>
                        </div>
                        <div className="row row-cols-1 row-cols-md-1 row-cols-lg-3 mb-3 g-3">
                            <div className="col">
                                <div className="d-flex align-items-start gap-2 bg-white border rounded-3 p-2">
                                    <div className="icon"><TrophyStar size="md" fill="rgb(var(--color-primary-green))" /></div>
                                    <div className="content">
                                        <span className="d-block fw-bold fs-5">25+</span>
                                        <span>Years of Excellence</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex align-items-start gap-2 bg-white border rounded-3 p-2">
                                    <div className="icon"><Group size="md" fill="rgb(var(--color-primary-green))" /></div>
                                    <div className="content">
                                        <span className="d-block fw-bold fs-5">20,000+</span>
                                        <span>Happy Families</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col">
                                <div className="d-flex align-items-start gap-2 bg-white border rounded-3 p-2">
                                    <div className="icon"><BadgeCheck size="md" fill="rgb(var(--color-primary-green))" /></div>
                                    <div className="content">
                                        <span className="d-block fw-bold fs-5">95%</span>
                                        <span>Success Rate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex align-items-center mt-4 flex-wrap gap-3">
                            <Button text="Explore Treatments" href="contact.html" className="callaction px-4 py-3 rounded-3" />
                            <Button text="Talk to Our Expert" href="#" className="callaction px-4 py-3 rounded-3 blankBtn" />
                        </div>
                    </div>
                </div>
                <div className="col ms-auto me-0">
                    <div className="form-block ms-md-auto me-md-0 mt-5 mt-md-0 mx-auto border rounded-4 bg-white p-4">
                        <div className="section-header text-center">
                            <h4 className="mb-2 fw-bold lh-sm fs-5">Book Free Consultation</h4>
                            <p className="fs-6 lh-sm">Take the first step towards your parenthood journey.</p>
                        </div>
                        <form action="" id="formcontainer">
                            <div className="from-group">
                                {/* <label></label> */}
                                <input type="text" name="name" placeholder="Full Name" />
                            </div>
                            <div className="from-group">
                                {/* <label></label> */}
                                <input type="tel" name="mobile" placeholder="Mobile Number" />
                            </div>
                            <div className="from-group">
                                {/* <label></label> */}
                                <input type="email" name="email" placeholder="Email Address" />
                            </div>
                            <div className="from-group">
                                {/* <label></label> */}
                                <select name="treatment" id="treatment">
                                    <option value="Select Treatment">Select Treatment</option>
                                </select>
                            </div>
                            <div className="from-group">
                                <Button text="Book Appointment" className="callaction px-3 text-center py-2 rounded-3 d-block w-100" />
                            </div>
                        </form>
                        <p className="text-center mt-2 mb-0">100% Confidential & Secure</p>
                    </div>
                </div>
            </div>
        </div>  
    </section>
    <HomeStrip />
    </>
    )
}
export default Banner
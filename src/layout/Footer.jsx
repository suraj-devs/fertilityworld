import { PhoneRing, Envelope, Location } from '@boxicons/react';
const Footer = () => {
  return (
    <footer className="my-2 my-lg-3">
        <div className="container-fluid">
            <div id="footer" className="p-4 rounded-3">
                <div className="row">
                    <div className="col-md-3">
                        <div className="footer_info footer-col h-100">
                            <img src="/media/we-care-logo.png" alt="Fertility World logo" className="img-fluid mb-3" width="180" />
                            <h5>Fertility World</h5>
                            <p>Buliding families and creating happiness through advanced fertility treatments and compassionate care.</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="footer_link row row-cols-2 row-cols-md-2 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 g-4 g-md-0">
                            <div className="col footer-col">
                                <h5>Treatments</h5>
                                <ul>
                                    <li><a href="/service/ivf">IVF Treatment</a></li>
                                    <li><a href="/service/icsi">ICSI Treatment</a></li>
                                    <li><a href="/service/iui">IUI Treatment</a></li>
                                    <li><a href="/service/egg-freezing">Egg Freezing</a></li>
                                    <li><a href="/service/donor-programs">Donor Program</a></li>
                                    <li><a href="/services">All Treatments</a></li>
                                </ul>
                            </div>
                            <div className="col footer-col">
                                <h5>Surrogacy</h5>
                                <ul>
                                    <li><a href="/service/surrogacy">Surrogacy Programs</a></li>
                                    <li><a href="/success-stories">Patient Stories</a></li>
                                </ul>
                            </div>
                            <div className="col footer-col">
                                <h5>Destinations</h5>
                                <ul>
                                    <li><a href="#">India</a></li>
                                    <li><a href="#">USA</a></li>
                                    <li><a href="#">Mexico</a></li>
                                    <li><a href="#">Colombia</a></li>
                                </ul>
                            </div>
                            <div className="col footer-col">
                                <h5>Quick Links</h5>
                                <ul>
                                    <li><a href="/contact">Contact Us</a></li>
                                    <li><a href="/about">About Us</a></li>
                                    <li><a href="/success-stories">Success Stories</a></li>
                                    <li><a href="/blog-list">Blog</a></li>
                                    <li><a href="/pricing">Pricing</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="footer_cotact footer-col h-100">
                            <h5>Contact Us</h5>
                            <ul>
                                <li><a href="tel:+918743987787"><PhoneRing size={24} className="me-2" fill='rgb(var(--color-primary-green))' /> +91 874 398 7787</a></li>
                                    <li><a href="mailto:surajsh64@gmail.com"><Envelope size={24} className="me-2" fill='rgb(var(--color-primary-green))' /> surajsh64@gmail.com</a></li>
                                <li><a href="/contact"><Location size={24} className="me-2" fill='rgb(var(--color-primary-green))' />  Fertility World, Sector 44, Gurugram, Haryana, India</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="d-block d-md-flex text-md-start text-center align-items-center justify-content-between gap-3 py-2 copyright">
                            <p className="text-white-50 mb-0">©2024 Fertility World. All Rights Reserved.</p>
                            <div className="important-link mt-2 mt-md-0">
                                <ul className="d-inline-flex position-relative mb-0">
                                    <li><a href="/privacy-policy">Privacy Policy</a></li>
                                    <li><a href="/terms">Terms & Conditions</a></li>
                                    <li><a href="#">Disclaimer</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer

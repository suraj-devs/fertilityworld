import { PhoneRing } from '@boxicons/react';
// import as * bootstrap from 'bootstrap'
const Header = ({ currentPage, onNavigate }) => {
    return (
        <>
            <header className="site-header">
                <div className="header-container">
                    <div className="header-wrapper">
                        <div className="main-logo">
                            <span className="mobile_m_bar d-block d-md-none"><i className="fa fa-bars"></i></span>
                            <a href="/" onClick={(event) => { event.preventDefault(); onNavigate('home') }}><img src="/media/we-care-logo.png" alt="Fertility World" width="" height="" /></a>
                            <div className="call-nav d-block d-md-none ">
                                <div className="d-flex align-items-center">
                                    <a href="tel:+918743987787" className="alink fw-medium"><PhoneRing size={24} className="me-md-2" /><span>+91 874 398 7787</span></a>
                                </div>
                            </div>
                        </div>
                        <div className="header-navbar">
                            <div className="menubar">
                                <ul className="navbar-block">
                                    <li className="mobile_menu_bar"><svg height="50" width="50" className="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></li>
                                    <li><a href="/" onClick={(event) => { event.preventDefault(); onNavigate('home') }}>Home</a></li>
                                    <li><a href="/about" onClick={(event) => { event.preventDefault(); onNavigate('about') }}>About Us</a></li>
                                    <li className="dropdown-list">
                                        <a href="/services" onClick={(event) => { event.preventDefault(); onNavigate('services') }}>Services</a>
                                        <i className="drop-plus" hidden>+</i>
                                        <ul className="sublist">
                                            <li><a href="/service/ivf" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:ivf') }}>IVF Treatment</a></li>
                                            <li><a href="/service/icsi" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:icsi') }}>ICSI Treatment</a></li>
                                            <li><a href="/service/iui" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:iui') }}>IUI Treatment</a></li>
                                            <li><a href="/service/egg-freezing" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:egg-freezing') }}>Egg Freezing</a></li>
                                            <li><a href="/service/male-diagnosis" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:male-diagnosis') }}>Male Fertility Diagnosis</a></li>
                                            <li><a href="/service/genetic-testing" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:genetic-testing') }}>Genetic Testing</a></li>
                                            <li><a href="/service/donor-programs" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:donor-programs') }}>Donor Programs</a></li>
                                            <li><a href="/service/surrogacy" onClick={(event) => { event.preventDefault(); onNavigate('service-detail:surrogacy') }}>Surrogacy Programs</a></li>
                                        </ul>
                                    </li>
                                    <li className="dropdown-list"><a href="/service-list" onClick={(event) => { event.preventDefault(); onNavigate('service-list') }}>All Treatments</a>
                                        <i className="drop-plus" hidden>+</i>
                                        <ul className="sublist">
                                                <li><a href="/procedure/car-t-cell-therapy" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:car-t-cell-therapy') }}>CAR T-Cell Therapy</a></li>
                                                <li><a href="/procedure/bariatric-surgery" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:bariatric-surgery') }}>Bariatric Surgery</a></li>
                                                <li><a href="/procedure/bone-marrow-transplant" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:bone-marrow-transplant') }}>Bone Marrow Transplant (BMT)</a></li>
                                                <li><a href="/procedure/brain-stroke-treatment" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:brain-stroke-treatment') }}>Brain Stroke Treatment</a></li>
                                                <li><a href="/procedure/brain-tumour-surgery" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:brain-tumour-surgery') }}>Brain Tumour Surgery</a></li>
                                                <li><a href="/procedure/breast-reduction-surgery" onClick={(event) => { event.preventDefault(); onNavigate('procedure-detail:breast-reduction-surgery') }}>Breast Reduction Surgery</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="/blog-list" onClick={(event) => { event.preventDefault(); onNavigate('blog-list') }}>Fertility Blog</a></li>
                                    <li><a href="/contact" onClick={(event) => { event.preventDefault(); onNavigate('contact') }}>Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="call-nav d-none d-md-block ">
                            <div className="d-flex align-items-center">
                                <a href="tel:+918743987787" className="alink fw-medium"><PhoneRing size={24} className="me-md-2" /><span>+91 874 398 7787</span></a>
                                <a href="/contact" className="callaction px-3 py-2 rounded-3 ms-3">Book Appointment</a>
                            </div>
                        </div>
                    </div>
                </div>
                <form action="search.html" method="" className="d-none" id="searchform">
                    <div className="container">
                        <div className="form-group d-flex align-items-center justify-content-center position-relative">
                            <input type="text" width="" height="" className="form-control" />
                            <button type="button" className="callaction px-4 py-3 rounded-3" id="searchformBtn">Search</button>
                        </div>    
                    </div>
                </form>
            </header>
            <div className="brand d-none">Fertility World</div>
            <nav className="site-nav d-none" aria-label="Main navigation">
                <button
                    type="button"
                    className={currentPage === 'home' ? 'active' : ''}
                    onClick={() => onNavigate('home')}
                >
                    Home
                </button>
                <button
                    type="button"
                    className={currentPage === 'about' ? 'active' : ''}
                    onClick={() => onNavigate('about')}
                >
                    About
                </button>
            </nav>
        </>
    )
}

export default Header

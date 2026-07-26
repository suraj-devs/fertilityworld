import { PhoneRing } from '@boxicons/react';
// import as * bootstrap from 'bootstrap'
const Header = ({ currentPage, onNavigate }) => {
    return (
        <>
            <header className="site-header">
                <div className="header-container">
                    <div className="header-wrapper">
                        <div className="main-logo">
                            <a href=""><img src="media/we-care-logo.jpg" alt="We Care" width="" height="" /></a>
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
                                    <li><a href="index.html">Home</a></li>
                                    <li><a href="about-us.html">About Us</a></li>
                                    <li className="dropdown-list">
                                        <a href="">Services</a>
                                        <i className="drop-plus" hidden>+</i>
                                        <ul className="sublist">
                                            <li className="dropdown-list"><a href="javascript:void(0)">Cancer Care</a>
                                                <i className="drop-plus" hidden>+</i>
                                                <ul className="sublist">
                                                    <li><a href="#">Breast Cancer</a></li>
                                                    <li><a href="#">Blood Cancer</a></li>
                                                    <li><a href="#">Brain Cancer</a></li>
                                                    <li><a href="#">Gastrointestinal Cancer</a></li>
                                                    <li><a href="#">Gynecologic Cancer</a></li>
                                                    <li><a href="#">Head &amp; Neck Cancer</a></li>
                                                    <li><a href="#">Musculoskeletal Cancer</a></li>
                                                    <li><a href="#">Paediatric Cancer</a></li>
                                                    <li><a href="#">Thoracic Cancer</a></li>
                                                    <li><a href="#">Uro-Oncology</a></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown-list"><a href="javascript:void(0)">Heart &amp; Vascular Sciences</a>
                                                <i className="drop-plus" hidden>+</i>
                                                <ul className="sublist">
                                                    <li><a href="#">Arrhythmia</a></li>
                                                    <li><a href="#">Cholesterol</a></li>
                                                    <li><a href="#">Heart Attack</a></li>
                                                    <li><a href="#">Heart Failure</a></li>
                                                    <li><a href="#">Hypertension</a></li>
                                                </ul>
                                            </li>
                                            <li className="dropdown-list"><a href="javascript:void(0)">Musculoskeletal Sciences</a>
                                                <i className="drop-plus" hidden>+</i>
                                                <ul className="sublist">
                                                    <li><a href="#">Arthritis</a></li>
                                                    <li><a href="#">Back Pain</a></li>
                                                    <li><a href="#">Cervical Spondylosis</a></li>
                                                    <li><a href="#">Disc Diseases</a></li>
                                                    <li><a href="#">Osteoporosis</a></li>
                                                    <li><a href="#">Spinal Fractures &amp; Paral</a></li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="dropdown-list"><a href="">Procedures</a>
                                        <i className="drop-plus" hidden>+</i>
                                        <ul className="sublist">
                                            <li><a href="#">CAR T-Cell Therapy</a></li>
                                            <li><a href="#">Bariatric Surgery</a></li>
                                            <li><a href="#">Bone Marrow Transplant (BMT)</a></li>
                                            <li><a href="#">Brain Stroke Treatment</a></li>
                                            <li><a href="#">Brain Tumour Surgery</a></li>
                                            <li><a href="#">Breast Reduction Surgery</a></li>
                                            <li><a href="#">Cardiac Valve Replacement Surgery</a></li>
                                            <li><a href="#">Cataract Surgery</a></li>
                                            <li><a href="#">Chemotherapy</a></li>
                                            <li><a href="#">Coronary Angioplasty</a></li>
                                            <li><a href="#">Coronary Artery Bypass Grafting (CABG)</a></li>
                                            <li><a href="#">Kidney Transplant</a></li>
                                            <li><a href="#">Laparoscopic Urologic Surgery</a></li>
                                            <li><a href="#">Lithotripsy</a></li>
                                            <li><a href="#">Liver Transplant</a></li>
                                            <li><a href="#">Lung Transplant</a></li>
                                            <li><a href="#">Pacemaker Implantation</a></li>
                                            <li><a href="#">Prostate Laser Surgery</a></li>
                                        </ul>
                                    </li>
                                    <li><a href="#">Contact Us</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="call-nav d-none d-md-block ">
                            <div className="d-flex align-items-center">
                                <a href="tel:+918743987787" className="alink fw-medium"><PhoneRing size={24} className="me-md-2" /><span>+91 874 398 7787</span></a>
                                <a href="#" className="callaction px-3 py-2 rounded-3 ms-3">Book Appointment</a>
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

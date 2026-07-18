function Header({ currentPage, onNavigate }) {
  return (
      <header className="site-header">
        <div className="container">
            <div className="header-wrapper">
                <div className="main-logo">
                    <a href=""><img src="media/we-care-logo.jpg" alt="We Care" width="" height="" /></a>
                </div>
                <div className="header-navbar">
                    <div className="menubar">
                        <ul className="navbar-block">
                            <li className="mobile_menu_bar"><svg height="50" width="50" className="svg-inline--fa fa-xmark" data-prefix="fas" data-icon="xmark" role="img" viewBox="0 0 384 512" aria-hidden="true" data-fa-i2svg=""><path fill="currentColor" d="M55.1 73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L147.2 256 9.9 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192.5 301.3 329.9 438.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.8 256 375.1 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192.5 210.7 55.1 73.4z"></path></svg></li>
                            <li><a href="#">Home</a></li>
                            <li><a href="#">About Us</a></li>
                            <li className="dropdown-list">
                                <a href="">Our Products</a>
                                <i className="drop-plus" hidden="">+</i>
                                <ul className="sublist">
                                    <li className="dropdown-list"><a href="">Digital Marketing</a>
                                        <i className="drop-plus" hidden="">+</i>
                                        <ul className="sublist">
                                            <li><a href="#Modular-Kitchen">SEO</a></li>
                                        </ul>
                                    </li>
                                    <li className="dropdown-list"><a href="">Web Development</a>
                                        <i className="drop-plus" hidden="">+</i>
                                        <ul className="sublist">
                                            <li><a href="#Modular-Kitchen">Custom Website Development</a></li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li className="dropdown-list"><a href="">Blog</a>
                                <i className="drop-plus" hidden="">+</i>
                                <ul className="sublist">
                                    <li><a href="">Digital Marketing</a></li>
                                </ul>
                            </li>
                            <li><a href="#" className="actionBtn">Contact Us</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    
        <div className="brand">Fertility World</div>
        <nav className="site-nav" aria-label="Main navigation">
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
      </header>
  )
}

export default Header

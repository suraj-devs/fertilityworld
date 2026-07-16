function Header({ currentPage, onNavigate }) {
  return (
    <header className="site-header">
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

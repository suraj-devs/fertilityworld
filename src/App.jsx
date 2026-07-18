import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import * as bootstrap from 'bootstrap'
// import './App.css'
import '../public/assets/css/style.css'
import '../public/assets/js/script.js'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="app-content">
        {currentPage === 'home' ? <Home /> : <About />}
      </main>

      <Footer />
    </>
  )
}

export default App

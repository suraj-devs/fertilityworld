import { useState } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Banner from './components/Banner'
import Treatment from './components/Treatment'
import CallToAction from './components/CallToAction'
import ReviewSection from './components/ReviewSection'
// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../public/assets/css/style.css'
// import '../public/assets/js/script.js'
import SectionBlock from './components/SectionBlock'
import CallToActionTwo from './components/CallToActionTwo'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  return (
    <>
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="app-content">
        {/* {currentPage === 'home' ? <Home /> : <About />} */}
        <Banner />
        <Treatment />
        <CallToAction />
        <ReviewSection />
        <SectionBlock />
        <CallToActionTwo />
      </main>

      <Footer />
    </>
  )
}

export default App

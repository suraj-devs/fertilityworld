import { useEffect, useState } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'
import About from './pages/About'
import Contact from './pages/Contact'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import SearchPage from './pages/SearchPage'
import Pricing from './pages/Pricing'
import SuccessStories from './pages/SuccessStories'
import LegalPage from './pages/LegalPage'
import { articles, procedureDetails, treatmentDetails } from './data/content'
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
import CareExperience from './components/CareExperience'

function App() {
  const getPageFromPath = () => {
    const path = window.location.pathname.replace(/\/$/, '')
    if (path === '/about' || path === '/contact' || path === '/services' || path === '/service-list' || path === '/blog-list' || path === '/search' || path === '/search-page' || path === '/pricing' || path === '/success-stories' || path === '/privacy-policy' || path === '/terms') return path === '/search-page' ? 'search' : path.slice(1)
    if (path.startsWith('/procedure/')) return `procedure-detail:${path.slice('/procedure/'.length)}`
    if (path.startsWith('/service/')) return `service-detail:${path.slice('/service/'.length)}`
    if (path.startsWith('/blog/')) return `blog-detail:${path.slice('/blog/'.length)}`
    return 'home'
  }

  const [currentPage, setCurrentPage] = useState(getPageFromPath)

  useEffect(() => {
    const pageMetadata = {
      home: {
        title: 'Fertility World | IVF and Fertility Treatment in India',
        description: 'Fertility World provides advanced IVF, surrogacy and fertility treatments in India with personalized care for your parenthood journey.',
        path: '/',
      },
      about: {
        title: 'About Fertility World | Trusted Fertility Care in India',
        description: 'Learn about Fertility World and our compassionate approach to fertility treatment, family planning and reproductive wellness.',
        path: '/about',
      },
      contact: {
        title: 'Contact Fertility World | Book a Fertility Consultation',
        description: 'Contact Fertility World to discuss IVF, surrogacy and fertility treatment options with our experienced care team.',
        path: '/contact',
      },
      services: {
        title: 'Fertility Treatments | IVF, IUI, ICSI and Surrogacy in India',
        description: 'Explore IVF, IUI, ICSI, egg freezing, surrogacy and donor fertility treatments from Fertility World in India.',
        path: '/services',
      },
      'service-list': {
        title: 'Fertility Treatments | Fertility World India',
        description: 'Browse fertility treatment options available through Fertility World, including IVF, IUI, ICSI, egg freezing and surrogacy.',
        path: '/service-list',
      },
      'blog-list': {
        title: 'Fertility Blog | IVF and Parenthood Guidance',
        description: 'Read practical fertility, IVF, IUI, egg freezing and surrogacy guidance from Fertility World.',
        path: '/blog-list',
      },
      search: {
        title: 'Search Fertility Resources | Fertility World',
        description: 'Search Fertility World resources for information about IVF, IUI, egg freezing, surrogacy and fertility care.',
        path: '/search',
      },
      pricing: {
        title: 'Fertility Treatment Pricing | Fertility World',
        description: 'Understand fertility treatment planning, expected care areas and transparent consultation guidance from Fertility World.',
        path: '/pricing',
      },
      'success-stories': {
        title: 'Patient Journeys | Fertility World',
        description: 'Read original patient journey highlights and learn how Fertility World supports families through fertility care.',
        path: '/success-stories',
      },
      'privacy-policy': { title: 'Privacy Policy | Fertility World', description: 'Read the Fertility World privacy policy and how enquiry information is handled.', path: '/privacy-policy' },
      terms: { title: 'Terms and Conditions | Fertility World', description: 'Read the terms and conditions for using the Fertility World website.', path: '/terms' },
    }[currentPage]

    const detailPage = currentPage.startsWith('service-detail:') ? 'services' : currentPage.startsWith('procedure-detail:') ? 'service-list' : currentPage.startsWith('blog-detail:') ? 'blog-list' : currentPage
    const detailSlug = currentPage.split(':')[1]
    const detailContent = currentPage.startsWith('service-detail:') ? treatmentDetails[detailSlug] : currentPage.startsWith('procedure-detail:') ? procedureDetails[detailSlug] : articles.find((article) => article.slug === detailSlug)
    const metadata = pageMetadata || {
      title: detailContent ? `${detailContent.title} | Fertility World` : detailPage === 'services' ? 'Fertility Treatment Guide | Fertility World' : 'Fertility Guide | Fertility World',
      description: detailContent?.description || 'Explore trusted fertility treatment and parenthood guidance from Fertility World.',
      path: currentPage.startsWith('service-detail:') ? `/service/${detailSlug}` : currentPage.startsWith('procedure-detail:') ? `/procedure/${detailSlug}` : `/blog/${detailSlug}`,
    }

    document.title = metadata.title
    document.querySelector('meta[name="description"]').setAttribute('content', metadata.description)
    document.querySelector('meta[property="og:title"]').setAttribute('content', metadata.title)
    document.querySelector('meta[property="og:description"]').setAttribute('content', metadata.description)
    document.querySelector('meta[name="twitter:title"]').setAttribute('content', metadata.title)
    document.querySelector('meta[name="twitter:description"]').setAttribute('content', metadata.description)
    document.querySelector('link[rel="canonical"]').setAttribute('href', `https://fertilityworld.in${metadata.path}`)
  }, [currentPage])

  const navigateTo = (page) => {
    const path = page === 'home' ? '/'
      : page.startsWith('procedure-detail:') ? `/procedure/${page.split(':')[1]}`
        : page.startsWith('service-detail:') ? `/service/${page.split(':')[1]}`
        : page.startsWith('blog-detail:') ? `/blog/${page.split(':')[1]}`
          : page === 'search' ? '/search' : `/${page}`
    window.history.pushState({}, '', path)
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    const handlePopState = () => setCurrentPage(getPageFromPath())
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  return (
    <>
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      <main className="app-content">
        {currentPage === 'about' ? <About /> : null}
        {currentPage === 'contact' ? <Contact /> : null}
        {currentPage === 'services' ? <Services onNavigate={navigateTo} /> : null}
        {currentPage === 'service-list' ? <Services onNavigate={navigateTo} /> : null}
        {currentPage === 'service-detail' ? <ServiceDetail slug="ivf" onNavigate={navigateTo} /> : null}
        {currentPage.startsWith('service-detail:') ? <ServiceDetail slug={currentPage.split(':')[1]} onNavigate={navigateTo} /> : null}
        {currentPage.startsWith('procedure-detail:') ? <ServiceDetail slug={currentPage.split(':')[1]} type="procedure" onNavigate={navigateTo} /> : null}
        {currentPage === 'blog-list' ? <BlogList onNavigate={navigateTo} /> : null}
        {currentPage.startsWith('blog-detail:') ? <BlogDetail slug={currentPage.split(':')[1]} onNavigate={navigateTo} /> : null}
        {currentPage === 'search' ? <SearchPage onNavigate={navigateTo} /> : null}
        {currentPage === 'pricing' ? <Pricing onNavigate={navigateTo} /> : null}
        {currentPage === 'success-stories' ? <SuccessStories onNavigate={navigateTo} /> : null}
        {currentPage === 'privacy-policy' ? <LegalPage type="privacy-policy" /> : null}
        {currentPage === 'terms' ? <LegalPage type="terms" /> : null}
        {currentPage === 'home' ? (
          <>
            <Banner />
            <Treatment onNavigate={navigateTo} />
            <CallToAction />
            <CareExperience onNavigate={navigateTo} />
            <ReviewSection />
            <SectionBlock />
            <CallToActionTwo />
          </>
        ) : null}
      </main>

      <Footer />
    </>
  )
}

export default App

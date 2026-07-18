import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'

import '../public/assets/css/style.css'
import '../public/assets/js/script.js'
// import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(<App />)

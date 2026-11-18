import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdminApp from './admin/AdminApp.jsx'
import BlogPages from './BlogPages.jsx'
import PublicPage from './PublicPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/blog/*" element={<BlogPages />} />
        <Route path="/success" element={<Navigate to="/blog" replace />} />
        <Route path="/success.html" element={<Navigate to="/blog" replace />} />
        <Route path="*" element={<PublicPage />} />
      </Routes>
    </BrowserRouter>
  )
}

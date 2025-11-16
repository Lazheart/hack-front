import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/auth/loginPage'
import RegisterPage from './pages/auth/registerPage'
import DashboardPage from './pages/dashboard/dashboardPage'
import PostPage from './pages/post/postPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main className="min-h-[60vh]">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/post" element={<ProtectedRoute><PostPage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  )
}

export default App

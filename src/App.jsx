import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import SplashScreen from './components/SplashScreen'
import './App.css'

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

function AppContent() {
  const location = useLocation()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [showSplash, setShowSplash] = useState(true)
  const [navbarLogo, setNavbarLogo] = useState(null)
  const isLoginPage = location.pathname === '/login'
  const isDashboardPage = location.pathname === '/dashboard'

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash')
    if (hasSeenSplash) {
      setShowSplash(false)
    }
  }, [])

  // Charger le logo de la navbar depuis l'API
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const response = await fetch('/api/logo')
        if (response.ok) {
          const data = await response.json()
          if (data.logo && data.logo.path) {
            // Construire l'URL complète
            const logoUrl = data.logo.path.startsWith('http') 
              ? data.logo.path 
              : `${window.location.origin}${data.logo.path}`
            setNavbarLogo(logoUrl)
            return
          }
        }
        // Si pas de logo sur le serveur, ne rien afficher (pas de fallback localStorage)
        setNavbarLogo(null)
      } catch (error) {
        console.error('Error loading logo from API:', error)
        // En cas d'erreur réseau, ne pas utiliser localStorage pour éviter les incohérences
        setNavbarLogo(null)
      }
    }
    
    loadLogo()
    
    // Vérifier les changements toutes les 3 secondes
    const interval = setInterval(loadLogo, 3000)
    
    return () => {
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleSplashComplete = () => {
    sessionStorage.setItem('hasSeenSplash', 'true')
    setShowSplash(false)
  }

  if (showSplash && !isLoginPage && !isDashboardPage) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <div className="app">
      {/* Navigation - cachée sur login et dashboard */}
      {!isLoginPage && !isDashboardPage && (
        <nav className="main-nav">
          <motion.div 
            className="nav-logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">
              {navbarLogo ? (
                <img 
                  src={navbarLogo} 
                  alt="Culin'Art Festival" 
                  className="navbar-logo-image"
                />
              ) : (
                <>
                  <h1>Culin'Art</h1>
                  <span>Festival</span>
                </>
              )}
            </Link>
          </motion.div>
          <div className="nav-links">
            <Link to="/">Accueil</Link>
          </div>
        </nav>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App


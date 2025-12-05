import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import '../styles/Login.css'

function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Mot de passe par défaut (à changer en production)
  const ADMIN_PASSWORD = 'culinart2025'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isAuthenticated', 'true')
      navigate('/dashboard')
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="login-card"
        >
          <div className="login-header">
            <h1>Culin'Art</h1>
            <p>Dashboard Administrateur</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="Entrez le mot de passe"
                autoFocus
              />
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="error-message"
              >
                {error}
              </motion.div>
            )}
            
            <button type="submit" className="login-btn">
              Se connecter
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Login



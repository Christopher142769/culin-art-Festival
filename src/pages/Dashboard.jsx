import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

function Dashboard() {
  const [templates, setTemplates] = useState([])
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [templateImage, setTemplateImage] = useState(null)
  const [festivalLogo, setFestivalLogo] = useState(null)
  const [activeSection, setActiveSection] = useState('templates')
  const fileInputRef = useRef(null)
  const logoInputRef = useRef(null)
  const canvasRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Charger depuis l'API
    const loadFromAPI = async () => {
      try {
        // Charger le template actif depuis l'API
        const templateResponse = await fetch('/api/template')
        if (templateResponse.ok) {
          const templateData = await templateResponse.json()
          if (templateData.template && templateData.template.path) {
            const templateUrl = templateData.template.path.startsWith('http')
              ? templateData.template.path
              : `${window.location.origin}${templateData.template.path}`
            setTemplateImage(templateUrl)
          }
        }

        // Charger le logo depuis l'API
        const logoResponse = await fetch('/api/logo')
        if (logoResponse.ok) {
          const logoData = await logoResponse.json()
          if (logoData.logo && logoData.logo.path) {
            const logoUrl = logoData.logo.path.startsWith('http')
              ? logoData.logo.path
              : `${window.location.origin}${logoData.logo.path}`
            setFestivalLogo(logoUrl)
          }
        }

        // Charger les templates sauvegardés depuis localStorage (pour l'historique local)
        const savedTemplates = localStorage.getItem('afficheTemplates')
        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates))
        }
      } catch (error) {
        console.error('Error loading from API:', error)
        // En cas d'erreur, ne pas charger depuis localStorage pour éviter les incohérences
      }
    }

    loadFromAPI()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    navigate('/login')
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Uploader vers l'API
      const formData = new FormData()
      formData.append('template', file)

      const response = await fetch('/api/template', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        // Construire l'URL complète
        const templateUrl = data.path.startsWith('http')
          ? data.path
          : `${window.location.origin}${data.path}`
        setTemplateImage(templateUrl)
        
        // Ajouter aux templates locaux (pour l'affichage dans la liste)
        const reader = new FileReader()
        reader.onload = (event) => {
          const newTemplate = {
            id: data.id || Date.now(),
            name: data.name || file.name,
            image: event.target.result, // Image en base64 pour l'affichage
            serverPath: templateUrl, // Chemin serveur pour l'utilisation
            createdAt: data.createdAt || new Date().toISOString()
          }
          
          const updatedTemplates = [...templates, newTemplate]
          setTemplates(updatedTemplates)
          // Garder localStorage uniquement pour l'historique local
          localStorage.setItem('afficheTemplates', JSON.stringify(updatedTemplates))
        }
        reader.readAsDataURL(file)
      } else {
        alert('Erreur lors de l\'upload du template. Assurez-vous que le serveur est démarré.')
      }
    } catch (error) {
      console.error('Error uploading template:', error)
      alert('Erreur lors de l\'upload du template. Assurez-vous que le serveur est démarré.')
    }
  }

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template)
    // Utiliser le chemin serveur si disponible, sinon l'image base64
    const imageUrl = template.serverPath || template.image
    setTemplateImage(imageUrl)
    // Ne pas sauvegarder dans localStorage - tout passe par l'API
  }

  const createDefaultTemplate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 1200
    canvas.height = 1600
    const ctx = canvas.getContext('2d')

    // Fond avec blocs de couleur
    const blockWidth = canvas.width / 3
    
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, blockWidth, canvas.height)
    
    ctx.fillStyle = '#f9831a'
    ctx.fillRect(blockWidth, 0, blockWidth, canvas.height)
    
    ctx.fillStyle = '#e1a122'
    ctx.fillRect(blockWidth * 2, 0, blockWidth, canvas.height)

    // Zone pour la photo
    ctx.strokeStyle = 'rgba(215, 226, 223, 0.3)'
    ctx.lineWidth = 4
    ctx.setLineDash([15, 10])
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, 225, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])

    // Texte principal
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
    ctx.shadowBlur = 10
    ctx.shadowOffsetX = 2
    ctx.shadowOffsetY = 2
    
    ctx.fillStyle = '#d7e2df'
    ctx.font = 'bold 90px Satoshi, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText("Culin'Art", canvas.width / 2, 180)
    
    ctx.font = 'bold 70px Satoshi, Inter, sans-serif'
    ctx.fillText('Festival', canvas.width / 2, 260)

    ctx.shadowBlur = 5
    ctx.font = '30px Inter, sans-serif'
    ctx.fillText('Un art à déguster', canvas.width / 2, 1450)
    
    ctx.shadowColor = 'transparent'
    ctx.shadowBlur = 0

    const imageData = canvas.toDataURL('image/png')
    setTemplateImage(imageData)
    localStorage.setItem('afficheTemplateImage', imageData)
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      // Uploader vers l'API
      const formData = new FormData()
      formData.append('logo', file)

      const response = await fetch('/api/logo', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        // Construire l'URL complète
        const logoUrl = data.path.startsWith('http') 
          ? data.path 
          : `${window.location.origin}${data.path}`
        setFestivalLogo(logoUrl)
        // Ne pas sauvegarder dans localStorage - tout passe par l'API
      } else {
        alert('Erreur lors de l\'upload du logo. Assurez-vous que le serveur est démarré.')
      }
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Erreur lors de l\'upload du logo. Assurez-vous que le serveur est démarré.')
    }
  }

  const deleteTemplate = (id) => {
    const updatedTemplates = templates.filter(t => t.id !== id)
    setTemplates(updatedTemplates)
    localStorage.setItem('afficheTemplates', JSON.stringify(updatedTemplates))
    
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null)
      setTemplateImage(null)
      localStorage.removeItem('afficheTemplateImage')
    }
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <h1 className="sidebar-logo">Culin'Art</h1>
            <span className="sidebar-subtitle">Dashboard</span>
          </div>

          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeSection === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveSection('templates')}
            >
              <span>📋</span>
              <span>Templates</span>
            </button>
            <button
              className={`nav-item ${activeSection === 'logo' ? 'active' : ''}`}
              onClick={() => setActiveSection('logo')}
            >
              <span>🎨</span>
              <span>Logo Festival</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <button onClick={handleLogout} className="logout-btn">
              <span>🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          <div className="dashboard-container">
            {activeSection === 'templates' && (
              <>
                <div className="dashboard-header">
                  <h1>Templates d'Affiches</h1>
                  <p>Gérez vos templates d'affiches personnalisées</p>
                </div>

                <div className="dashboard-grid">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="upload-card"
                  >
                    <h2>Nouveau Template</h2>
                    <div className="upload-actions">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-primary"
                      >
                        📤 Uploader une Affiche
                      </button>
                      <button
                        onClick={createDefaultTemplate}
                        className="btn btn-secondary"
                      >
                        🎨 Créer Template par Défaut
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </motion.div>

                  {templateImage && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="preview-card"
                    >
                      <h3>Template Actif</h3>
                      <div className="template-preview">
                        <img src={templateImage} alt="Template actif" />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="templates-section">
                  <h2>Mes Templates ({templates.length})</h2>
                  <div className="templates-grid">
                    {templates.map((template) => (
                      <motion.div
                        key={template.id}
                        className={`template-card ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <img src={template.image} alt={template.name} />
                        <div className="template-info">
                          <p>{template.name}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTemplate(template.id)
                            }}
                            className="btn-delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {templates.length === 0 && (
                    <p className="empty-state">Aucun template pour le moment</p>
                  )}
                </div>
              </>
            )}

            {activeSection === 'logo' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="logo-section"
              >
                <div className="dashboard-header">
                  <h1>Logo du Festival</h1>
                  <p>Le logo sera affiché dans la navbar du site (remplace le texte "Culin'Art")</p>
                </div>

                <div className="logo-upload-card">
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="btn btn-primary"
                  >
                    🎨 Uploader le Logo
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    style={{ display: 'none' }}
                  />
                  
                  {festivalLogo && (
                    <div className="logo-preview">
                      <h3>Logo Actuel</h3>
                      <img src={festivalLogo} alt="Logo du festival" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default Dashboard

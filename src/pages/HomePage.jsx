import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import PhotoUploader from '../components/PhotoUploader'
import AffichePreview from '../components/AffichePreview'
import VideoBackground from '../components/VideoBackground'
import Countdown from '../components/Countdown'
import '../styles/HomePage.css'

function HomePage() {
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [afficheTemplate, setAfficheTemplate] = useState(null)
  const [finalAffiche, setFinalAffiche] = useState(null)
  const canvasRef = useRef(null)
  const uploadSectionRef = useRef(null)

  // Charger le template d'affiche depuis localStorage
  useEffect(() => {
    const savedTemplate = localStorage.getItem('afficheTemplate')
    if (savedTemplate) {
      setAfficheTemplate(savedTemplate)
    } else {
      // Template par défaut
      setAfficheTemplate('default')
    }
  }, [])

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handlePhotoUpload = (photo) => {
    setUploadedPhoto(photo)
    generateAffiche(photo)
  }

  const generateAffiche = async (photo) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = 1200
    canvas.height = 1600

    // Charger le template d'affiche
    const template = await loadAfficheTemplate()

    // Créer une image à partir de la photo uploadée
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      // ÉTAPE 1: Dessiner la photo en arrière-plan pour remplir tout le canvas
      // Calculer les dimensions pour couvrir tout le canvas en gardant le ratio
      const canvasRatio = canvas.width / canvas.height
      const imgRatio = img.width / img.height
      
      let drawWidth, drawHeight, drawX, drawY
      
      if (imgRatio > canvasRatio) {
        // Photo plus large que le canvas - couvrir la hauteur
        drawHeight = canvas.height
        drawWidth = canvas.height * imgRatio
        drawX = (canvas.width - drawWidth) / 2
        drawY = 0
      } else {
        // Photo plus haute que le canvas - couvrir la largeur
        drawWidth = canvas.width
        drawHeight = canvas.width / imgRatio
        drawX = 0
        drawY = (canvas.height - drawHeight) / 2
      }
      
      // Dessiner la photo en arrière-plan (cover style)
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

      // ÉTAPE 2: Dessiner le template par-dessus (les zones transparentes laisseront voir la photo)
      ctx.drawImage(template, 0, 0, canvas.width, canvas.height)

      // Convertir en image haute qualité
      const finalImage = canvas.toDataURL('image/png', 1.0)
      setFinalAffiche(finalImage)
    }
    img.src = photo
  }

  const loadDefaultTemplate = (resolve) => {
    // Créer un template par défaut (ne pas utiliser localStorage)
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 1600
      const ctx = canvas.getContext('2d')
      
      // Fond avec blocs de couleur (inspiré du logo)
      const blockWidth = canvas.width / 3
      
      // Bloc noir
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, blockWidth, canvas.height)
      
      // Bloc orange
      ctx.fillStyle = '#f9831a'
      ctx.fillRect(blockWidth, 0, blockWidth, canvas.height)
      
      // Bloc jaune
      ctx.fillStyle = '#e1a122'
      ctx.fillRect(blockWidth * 2, 0, blockWidth, canvas.height)
      
      // Zone pour la photo (cercle au centre avec guide)
      ctx.strokeStyle = 'rgba(215, 226, 223, 0.3)'
      ctx.lineWidth = 3
      ctx.setLineDash([15, 10])
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 225, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Texte principal avec ombre
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
      ctx.shadowBlur = 15
      ctx.shadowOffsetX = 3
      ctx.shadowOffsetY = 3
      
      ctx.fillStyle = '#d7e2df'
      ctx.font = 'bold 90px Satoshi, Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText("Culin'Art", canvas.width / 2, 180)
      
      ctx.font = 'bold 70px Satoshi, Inter, sans-serif'
      ctx.fillText('Festival', canvas.width / 2, 260)
      
      // Réinitialiser l'ombre pour le sous-titre
      ctx.shadowBlur = 10
      
      ctx.font = '30px Inter, sans-serif'
      ctx.fillText('Un art à déguster', canvas.width / 2, 1450)
      
      // Réinitialiser l'ombre
      ctx.shadowColor = 'transparent'
      ctx.shadowBlur = 0

      const img = new Image()
      img.onload = () => resolve(img)
      img.src = canvas.toDataURL()
  }

  const loadAfficheTemplate = () => {
    return new Promise(async (resolve) => {
      // Charger depuis l'API
      try {
        const response = await fetch('/api/template')
        if (response.ok) {
          const data = await response.json()
          if (data.template && data.template.path) {
            const templateUrl = data.template.path.startsWith('http')
              ? data.template.path
              : `${window.location.origin}${data.template.path}`
            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => resolve(img)
            img.onerror = () => {
              // En cas d'erreur de chargement d'image, utiliser le template par défaut
              loadDefaultTemplate(resolve)
            }
            img.src = templateUrl
            return
          }
        }
        // Si pas de template sur le serveur, utiliser le template par défaut
        loadDefaultTemplate(resolve)
      } catch (error) {
        console.error('Error loading template from API:', error)
        // En cas d'erreur réseau, utiliser le template par défaut (pas localStorage)
        loadDefaultTemplate(resolve)
      }
    })
  }

  const handleDownload = () => {
    if (!finalAffiche) return

    const link = document.createElement('a')
    link.download = 'affiche-culinart.png'
    link.href = finalAffiche
    link.click()
  }

  return (
    <div className="home-page">
      {/* Hero Section avec Vidéo */}
      <section className="hero-section-full">
        <VideoBackground />
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-text"
          >
            <h1 className="hero-title-main">
              Culin'Art Festival
            </h1>
            <p className="hero-dates">17 - 21 Décembre 2025</p>
            <p className="hero-subtitle-main">
              Place de l'Amazone - Cotonou
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="countdown-section"
          >
            <Countdown />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-cta"
          >
            <button onClick={scrollToUpload} className="cta-button">
              Créez votre Affiche
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section Upload */}
      <div className="home-container" ref={uploadSectionRef}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <h2 className="section-title">
            Créez votre <span className="gradient-text">Affiche Personnalisée</span>
          </h2>
          <p className="section-subtitle">
            Téléchargez votre photo et découvrez votre affiche du Culin'Art Festival
          </p>
        </motion.div>

        <div className="content-grid">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="upload-section"
          >
            <PhotoUploader onPhotoUpload={handlePhotoUpload} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="preview-section"
          >
            {finalAffiche && (
              <AffichePreview 
                affiche={finalAffiche} 
                onDownload={handleDownload}
              />
            )}
            {!finalAffiche && (
              <div className="preview-placeholder">
                <p>Votre affiche personnalisée apparaîtra ici</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  )
}

export default HomePage


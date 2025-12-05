import { motion } from 'framer-motion'
import '../styles/AffichePreview.css'

function AffichePreview({ affiche, onDownload }) {
  return (
    <motion.div
      className="affiche-preview"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="preview-header">
        <h3>Votre Affiche Personnalisée</h3>
      </div>
      <div className="preview-image-container">
        <motion.img
          src={affiche}
          alt="Affiche personnalisée"
          className="preview-image"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <motion.button
        className="download-btn"
        onClick={onDownload}
        whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 107, 53, 0.4)" }}
        whileTap={{ scale: 0.95 }}
      >
        <span>⬇️</span>
        <span>Télécharger l'Affiche</span>
      </motion.button>
    </motion.div>
  )
}

export default AffichePreview


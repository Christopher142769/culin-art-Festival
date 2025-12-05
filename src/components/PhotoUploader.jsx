import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import '../styles/PhotoUploader.css'

function PhotoUploader({ onPhotoUpload }) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      processFile(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target.result
      setPreview(imageData)
      onPhotoUpload(imageData)
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className={`photo-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {preview ? (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <button
            onClick={() => {
              setPreview(null)
              fileInputRef.current.value = ''
            }}
            className="change-photo-btn"
          >
            Changer la photo
          </button>
        </div>
      ) : (
        <div className="upload-area">
          <motion.div
            className="upload-icon"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            📸
          </motion.div>
          <h3>Glissez votre photo ici</h3>
          <p>ou cliquez pour sélectionner</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="upload-btn"
          >
            Choisir un fichier
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </motion.div>
  )
}

export default PhotoUploader


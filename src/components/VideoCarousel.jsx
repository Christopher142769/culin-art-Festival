import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/VideoCarousel.css'

function VideoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Placeholder pour les vidéos - vous pouvez remplacer par de vraies vidéos
  const videos = [
    { id: 1, type: 'image', src: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=1200&h=800&fit=crop', alt: 'Grillades de viande' },
    { id: 2, type: 'image', src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&h=800&fit=crop', alt: 'Poisson grillé' },
    { id: 3, type: 'image', src: 'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&h=800&fit=crop', alt: 'Barbecue' },
    { id: 4, type: 'image', src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=800&fit=crop', alt: 'Viande grillée' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length)
    }, 4000) // Change toutes les 4 secondes

    return () => clearInterval(interval)
  }, [videos.length])

  return (
    <div className="video-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="carousel-item"
        >
          <img 
            src={videos[currentIndex].src} 
            alt={videos[currentIndex].alt}
            className="carousel-image"
          />
          <div className="carousel-overlay" />
        </motion.div>
      </AnimatePresence>
      
      {/* Indicateurs */}
      <div className="carousel-indicators">
        {videos.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default VideoCarousel


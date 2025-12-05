import { useRef, useEffect } from 'react'
import '../styles/VideoBackground.css'

function VideoBackground() {
  const videoRef = useRef(null)

  // ═══════════════════════════════════════════════════════════
  // 🎥 METTEZ VOTRE LIEN VIDÉO ICI
  // ═══════════════════════════════════════════════════════════
  // Pour une vidéo locale : placez-la dans public/videos/ et utilisez :
  // const VIDEO_URL = '/videos/votre-video.mp4'
  //
  // Pour une vidéo en ligne : utilisez l'URL complète :
  // const VIDEO_URL = 'https://votre-site.com/video.mp4'
  // ═══════════════════════════════════════════════════════════
  const VIDEO_URL = '/videos/carousel.mp4' // 👈 REMPLACEZ PAR VOTRE CHEMIN VIDÉO
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log('Auto-play prevented:', err)
      })
    }
  }, [])

  return (
    <div className="video-background">
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={VIDEO_URL} type="video/mp4" />
        {/* Fallback si la vidéo ne charge pas */}
        <div className="video-fallback">
          <p>Vidéo en cours de chargement...</p>
        </div>
      </video>
      <div className="video-overlay" />
    </div>
  )
}

export default VideoBackground


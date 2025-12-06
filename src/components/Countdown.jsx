import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import '../styles/Countdown.css'

function Countdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    // Date de début du festival : 17 décembre 2025 à 00h00
    const targetDate = new Date('2025-12-17T00:00:00').getTime()

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="countdown-container">
      <div className="countdown-grid">
        <motion.div
          className="countdown-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.days}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.days).padStart(2, '0')}
          </motion.div>
          <div className="countdown-label">Jours</div>
        </motion.div>
        
        <motion.div
          className="countdown-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.hours}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.hours).padStart(2, '0')}
          </motion.div>
          <div className="countdown-label">Heures</div>
        </motion.div>
        
        <motion.div
          className="countdown-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.minutes}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.minutes).padStart(2, '0')}
          </motion.div>
          <div className="countdown-label">Minutes</div>
        </motion.div>
        
        <motion.div
          className="countdown-item"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        >
          <motion.div 
            className="countdown-value"
            key={timeLeft.seconds}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {String(timeLeft.seconds).padStart(2, '0')}
          </motion.div>
          <div className="countdown-label">Secondes</div>
        </motion.div>
      </div>
    </div>
  )
}

export default Countdown


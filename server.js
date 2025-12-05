import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*', // En production, spécifiez l'URL exacte du frontend
  credentials: true,
  optionsSuccessStatus: 200
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static('dist'))
app.use('/uploads', express.static('uploads'))

// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configuration Multer pour les uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
})

// Routes API

// Récupérer le template actif
app.get('/api/template', (req, res) => {
  try {
    const templatePath = path.join(uploadsDir, 'active-template.json')
    if (fs.existsSync(templatePath)) {
      const data = fs.readFileSync(templatePath, 'utf8')
      const templateData = JSON.parse(data)
      res.json({ template: templateData })
    } else {
      res.json({ template: null })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Uploader un template
app.post('/api/template', upload.single('template'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const templateData = {
      id: Date.now(),
      name: req.file.originalname,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    }

    // Sauvegarder comme template actif
    const templatePath = path.join(uploadsDir, 'active-template.json')
    fs.writeFileSync(templatePath, JSON.stringify(templateData))

    res.json({ template: templateData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Récupérer le logo
app.get('/api/logo', (req, res) => {
  try {
    const logoPath = path.join(uploadsDir, 'logo.json')
    if (fs.existsSync(logoPath)) {
      const data = fs.readFileSync(logoPath, 'utf8')
      const logoData = JSON.parse(data)
      res.json({ logo: logoData })
    } else {
      res.json({ logo: null })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Uploader le logo
app.post('/api/logo', upload.single('logo'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const logoData = {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      uploadedAt: new Date().toISOString()
    }

    // Sauvegarder le logo
    const logoPath = path.join(uploadsDir, 'logo.json')
    fs.writeFileSync(logoPath, JSON.stringify(logoData))

    res.json({ logo: logoData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Route pour servir l'application React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
  console.log(`📁 Uploads directory: ${uploadsDir}`)
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use!`)
    console.error(`💡 Solution: Kill the process using port ${PORT} or change the PORT in server.js`)
    console.error(`   Run: lsof -ti:${PORT} | xargs kill -9`)
    process.exit(1)
  } else {
    console.error('❌ Server error:', err)
    process.exit(1)
  }
})


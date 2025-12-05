// Configuration de l'URL de l'API
// En production : utilise VITE_API_URL (défini dans Render)
// En développement : utilise le proxy Vite (localhost:3001)
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    // Production : URL complète du backend
    return import.meta.env.VITE_API_URL
  }
  // Développement : utilise le proxy Vite
  return '/api'
}

const API_BASE_URL = getApiBaseUrl()

// Récupérer le template actif
export const getActiveTemplate = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/template`)
    const data = await response.json()
    return data.template
  } catch (error) {
    console.error('Error fetching template:', error)
    // Fallback sur localStorage si l'API n'est pas disponible
    return localStorage.getItem('afficheTemplateImage')
  }
}

// Uploader un template
export const uploadTemplate = async (file) => {
  try {
    const formData = new FormData()
    formData.append('template', file)

    const response = await fetch(`${API_BASE_URL}/template`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading template:', error)
    // Fallback sur localStorage
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target.result
        localStorage.setItem('afficheTemplateImage', imageData)
        resolve({ path: imageData })
      }
      reader.readAsDataURL(file)
    })
  }
}

// Récupérer le logo
export const getLogo = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/logo`)
    const data = await response.json()
    return data.logo
  } catch (error) {
    console.error('Error fetching logo:', error)
    // Fallback sur localStorage
    return localStorage.getItem('festivalLogo')
  }
}

// Uploader le logo
export const uploadLogo = async (file) => {
  try {
    const formData = new FormData()
    formData.append('logo', file)

    const response = await fetch(`${API_BASE_URL}/logo`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error uploading logo:', error)
    // Fallback sur localStorage
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target.result
        localStorage.setItem('festivalLogo', imageData)
        resolve({ path: imageData })
      }
      reader.readAsDataURL(file)
    })
  }
}

// Convertir le chemin du serveur en URL complète
export const getImageUrl = (path) => {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('data:')) {
    return path
  }
  // En production, utiliser l'URL du backend
  // En développement, utiliser le proxy
  const baseUrl = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001')
  return `${baseUrl}${path}`
}


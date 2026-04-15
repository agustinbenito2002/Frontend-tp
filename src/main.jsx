import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Configurar axios para usar rutas relativas
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'

// Llamada de prueba al backend
axios
  .get('/')
  .then(response => {
    console.log("Datos recibidos del backend:", response.data)
  })
  .catch(error => {
    console.error("Error al consultar el backend:", error)
  })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'

// Llamada de prueba al backend (localhost:3001)
axios
  .get('http://localhost:3001/api/duenios/7')
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

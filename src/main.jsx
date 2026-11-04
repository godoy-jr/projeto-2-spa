import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const savedTheme = localStorage.getItem('cambio-facil:theme:v1') ?? 'system'
const initialTheme = savedTheme === 'system'
  ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  : savedTheme
document.documentElement.dataset.theme = ['light', 'dark'].includes(initialTheme) ? initialTheme : 'light'
document.documentElement.style.colorScheme = document.documentElement.dataset.theme

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

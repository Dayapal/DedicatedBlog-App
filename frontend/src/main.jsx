
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import axios from 'axios'
import { BACKEND_URL } from './config.js'

// ✅ Make axios send cookies (important for authentication)
axios.defaults.withCredentials = true;

// ✅ Set backend base URL dynamically (localhost:4001 in dev, Render in prod)
axios.defaults.baseURL = BACKEND_URL;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)

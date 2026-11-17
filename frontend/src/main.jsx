import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import axios from 'axios'
import { BACKEND_URL } from './config.js'

// Configure Axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = BACKEND_URL;

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>,
)

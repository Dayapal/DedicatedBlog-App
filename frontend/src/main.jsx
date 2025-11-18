
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import axios from 'axios'
// ✅ Make axios send cookies (important for authentication)

axios.defaults.withCredentials = true;

// ✅ Also set your backend base URL here (optional but helpful)
axios.defaults.baseURL = "https://dedicatedblog-app-1.onrender.com"
// ⬆️ Replace with your actual Render backend URL

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>,
)

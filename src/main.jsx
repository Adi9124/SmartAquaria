import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AppDemo from './AppDemo.jsx'
import './index.css'

// Check URL query param e.g. http://localhost:5173/?mode=demo
const urlParams = new URLSearchParams(window.location.search);
const isDemoMode = urlParams.get('mode') === 'demo';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isDemoMode ? <AppDemo /> : <App />}
  </React.StrictMode>,
)

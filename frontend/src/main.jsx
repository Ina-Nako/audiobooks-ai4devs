import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import { ThemeProvider } from './context/ThemeContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/variables.css'
import './styles/App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <PlayerProvider>
              <CartProvider>
                <WishlistProvider>
                  <ErrorBoundary>
                    <App />
                    <Toaster position="bottom-right" />
                  </ErrorBoundary>
                </WishlistProvider>
              </CartProvider>
            </PlayerProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)

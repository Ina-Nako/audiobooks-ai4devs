import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cartCount, setCartCount] = useState(0)

  const fetchCartCount = async () => {
    if (!user) { setCartCount(0); return }
    try {
      const res = await api.get('/cart')
      if (res.ok) {
        const data = await res.json()
        const items = data.items || []
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0))
      }
    } catch { setCartCount(0) }
  }

  useEffect(() => {
    fetchCartCount()
  }, [user])

  const incrementCart = () => setCartCount(prev => prev + 1)
  const refreshCart = () => fetchCartCount()

  return (
    <CartContext.Provider value={{ cartCount, incrementCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

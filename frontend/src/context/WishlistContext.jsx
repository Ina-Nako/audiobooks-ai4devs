import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([]) // array of audiobook IDs

  useEffect(() => {
    if (user) {
      api.get('/wishlist').then(r => r.json()).then(d => {
        setWishlist((d.items || []).map(i => i.audiobook_id))
      }).catch(() => setWishlist([]))
    } else {
      setWishlist([])
    }
  }, [user])

  const isWishlisted = (audiobookId) => wishlist.includes(audiobookId)

  const toggleWishlist = async (audiobookId) => {
    if (!user) return false
    if (isWishlisted(audiobookId)) {
      const res = await api.delete(`/wishlist/${audiobookId}`)
      if (res.ok) setWishlist(prev => prev.filter(id => id !== audiobookId))
    } else {
      const res = await api.post('/wishlist', { audiobook_id: audiobookId })
      if (res.ok) setWishlist(prev => [...prev, audiobookId])
    }
    return true
  }

  return (
    <WishlistContext.Provider value={{ wishlist, isWishlisted, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)

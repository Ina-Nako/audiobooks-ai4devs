import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

function CartPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [], subtotal: 0, shipping: 0, total: 0 })

  const fetchCart = () => {
    api.get('/cart').then(r => r.json()).then(setCart)
  }

  useEffect(() => { if (user) fetchCart() }, [user])

  const updateQty = async (itemId, qty) => {
    await api.patch(`/cart/items/${itemId}`, { quantity: qty })
    fetchCart()
  }

  const remove = async (itemId) => {
    await api.delete(`/cart/items/${itemId}`)
    fetchCart()
  }

  if (!user) return <div className="auth-page"><h1>Please log in</h1><Link to="/login" className="btn btn-primary">Log In</Link></div>

  return (
    <div>
      <div className="page-header"><h1>Shopping Cart</h1></div>

      {cart.items?.length === 0 ? (
        <div className="empty">
          <p>Your cart is empty.</p>
          <Link to="/catalog" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>Browse Catalog</Link>
        </div>
      ) : (
        <>
          {cart.items?.map(item => (
            <div key={item.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', padding: 'var(--space-md)' }}>
              <div>
                <h4>{item.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{item.author} · ${item.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                <button className="btn btn-secondary" onClick={() => updateQty(item.id, Math.max(1, item.quantity - 1))}>-</button>
                <span>{item.quantity}</span>
                <button className="btn btn-secondary" onClick={() => updateQty(item.id, item.quantity + 1)}>+</button>
                <span style={{ fontWeight: 700 }}>${item.subtotal}</span>
                <button className="btn btn-danger" onClick={() => remove(item.id)}>✕</button>
              </div>
            </div>
          ))}
          <div className="card" style={{ marginTop: 'var(--space-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <span>Subtotal</span><span>${cart.subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <span>Shipping</span><span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 'var(--font-size-lg)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-md)' }}>
              <span>Total</span><span>${cart.total}</span>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/checkout')} style={{ width: '100%', marginTop: 'var(--space-md)' }}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CartPage

import { useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

function OrderHistoryPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    if (user) api.get('/orders').then(r => r.json()).then(d => setOrders(d.orders || []))
  }, [user])

  if (!user) return <div className="empty">Please log in to view orders.</div>

  return (
    <div>
      <div className="page-header"><h1>Order History</h1></div>
      {orders.length === 0 ? (
        <p className="empty">No orders yet.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
              <strong>Order #{order.id.slice(0, 8)}</strong>
              <span style={{ color: 'var(--color-success)', textTransform: 'capitalize' }}>{order.status}</span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              {new Date(order.created_at).toLocaleDateString()} · {order.items?.length} item(s) · ${order.total_amount}
            </p>
            <div style={{ marginTop: 'var(--space-sm)' }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                  {item.title} × {item.quantity} — ${item.subtotal}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default OrderHistoryPage

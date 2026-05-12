import { useState, useEffect } from 'react'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(r => r.json()).then(d => {
        setNotifications(d.notifications || [])
        setUnreadCount(d.unread_count || 0)
      })
    }
  }, [user])

  const markAllRead = async () => {
    await api.post('/notifications/read-all')
    setNotifications(ns => ns.map(n => ({ ...n, is_read: true })))
    setUnreadCount(0)
  }

  const markRead = async (id) => {
    await api.post(`/notifications/${id}/read`)
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, is_read: true } : n))
    setUnreadCount(c => Math.max(0, c - 1))
  }

  if (!user) return <div className="empty">Please log in to view notifications.</div>

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Notifications</h1>
          <p>{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && <button className="btn btn-secondary" onClick={markAllRead}>Mark All Read</button>}
      </div>

      {notifications.length === 0 ? (
        <p className="empty">No notifications yet.</p>
      ) : (
        notifications.map(n => (
          <div key={n.id} className="card" onClick={() => !n.is_read && markRead(n.id)} style={{ marginBottom: 'var(--space-md)', cursor: 'pointer', opacity: n.is_read ? 0.7 : 1, borderLeft: n.is_read ? 'none' : '3px solid var(--color-accent)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <strong>{n.title}</strong>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                {new Date(n.created_at).toLocaleDateString()}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{n.message}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default NotificationsPage

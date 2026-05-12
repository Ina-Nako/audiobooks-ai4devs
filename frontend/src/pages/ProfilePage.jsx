import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, logout } = useAuth()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (user) api.get('/users/me').then(r => r.json()).then(setProfile)
  }, [user])

  if (!user) return <div className="auth-page"><h1>Please log in</h1><Link to="/login" className="btn btn-primary">Log In</Link></div>
  if (!profile) return <div className="loading">Loading...</div>

  return (
    <div>
      <div className="page-header">
        <h1>👤 {profile.display_name}</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{profile.email} · Member since {new Date(profile.created_at).toLocaleDateString()}</p>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{profile.stats?.books_listened || 0}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>Books Listened</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{profile.stats?.reviews_written || 0}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>Reviews Written</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{profile.stats?.forum_posts || 0}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>Forum Posts</div>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>{profile.stats?.orders_placed || 0}</div>
          <div style={{ color: 'var(--color-text-secondary)' }}>Orders Placed</div>
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-xl)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
        <Link to="/orders" className="btn btn-secondary">📦 Order History</Link>
        <Link to="/notifications" className="btn btn-secondary">🔔 Notifications</Link>
        <Link to="/catalog" className="btn btn-secondary">🎧 Browse Catalog</Link>
      </div>
    </div>
  )
}

export default ProfilePage

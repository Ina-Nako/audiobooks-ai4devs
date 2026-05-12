import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

function ForumHomePage() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    api.get('/forum/categories').then(r => r.json()).then(d => setCategories(d.categories || []))
  }, [])

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>💬 Community Forum</h1>
          <p>Discuss audiobooks, podcasts, and literature with fellow enthusiasts</p>
        </div>
        <Link to="/forum/new" className="btn btn-glow">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Thread
        </Link>
      </div>

      <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {categories.map(cat => (
          <Link key={cat.id} to={`/forum/${cat.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600 }}>{cat.name}</h3>
              <span style={{ fontSize: 'var(--font-size-xs)', padding: '4px 10px', background: 'var(--color-accent-light)', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontWeight: 600 }}>
                {cat.thread_count} thread{cat.thread_count !== 1 ? 's' : ''}
              </span>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>{cat.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ForumHomePage

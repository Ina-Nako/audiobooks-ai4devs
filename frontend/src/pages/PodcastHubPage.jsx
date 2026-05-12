import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { usePlayer } from '../context/PlayerContext'

function PodcastHubPage() {
  const [shows, setShows] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    api.get(`/podcasts?${params}`).then(r => r.json()).then(d => setShows(d.shows || []))
  }, [search, category])

  return (
    <div>
      <div className="page-header">
        <h1>🎙 Podcast Hub</h1>
        <p>Discover book-related podcasts and literary discussions</p>
      </div>

      <div className="filters-bar">
        <input type="text" placeholder="Search shows..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Author Interviews">Author Interviews</option>
          <option value="Book Clubs">Book Clubs</option>
          <option value="Literary Analysis">Literary Analysis</option>
          <option value="Behind the Scenes">Behind the Scenes</option>
        </select>
      </div>

      <div className="card-grid">
        {shows.map(show => (
          <Link key={show.id} to={`/podcasts/${show.id}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--gradient-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>🎙</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 600, marginBottom: 2 }}>{show.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Hosted by {show.host}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-secondary)', padding: '2px 8px', background: 'rgba(6, 182, 212, 0.1)', borderRadius: 'var(--radius-full)' }}>{show.category}</span>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', padding: '2px 8px', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-full)' }}>{show.episode_count} episodes</span>
            </div>
            {show.description && <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{show.description.slice(0, 120)}...</p>}
          </Link>
        ))}
      </div>

      {shows.length === 0 && <p className="empty">No podcasts found.</p>}
    </div>
  )
}

export default PodcastHubPage

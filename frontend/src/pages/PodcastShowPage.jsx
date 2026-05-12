import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'

function PodcastShowPage() {
  const { showId } = useParams()
  const { user } = useAuth()
  const { play } = usePlayer()
  const [show, setShow] = useState(null)
  const [episodes, setEpisodes] = useState([])
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    api.get(`/podcasts/${showId}`).then(r => r.json()).then(d => {
      setShow(d)
      setSubscribed(d.is_subscribed || false)
    })
    api.get(`/podcasts/${showId}/episodes`).then(r => r.json()).then(d => setEpisodes(d.episodes || []))
  }, [showId])

  const toggleSubscribe = async () => {
    if (subscribed) {
      await api.post(`/podcasts/${showId}/unsubscribe`)
      setSubscribed(false)
    } else {
      await api.post(`/podcasts/${showId}/subscribe`)
      setSubscribed(true)
    }
  }

  const playEpisode = (ep) => {
    play({ id: ep.id, title: ep.title, artist: show?.host, duration_seconds: ep.duration_seconds, audio_url: ep.audio_url })
  }

  const formatDuration = (s) => { const m = Math.floor(s / 60); return `${m} min` }

  if (!show) return <div className="loading">Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-xl)' }}>
        <div>
          <h1>{show.title}</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Hosted by {show.host} · {show.category}</p>
          {show.description && <p style={{ marginTop: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>{show.description}</p>}
        </div>
        {user && (
          <button className={`btn ${subscribed ? 'btn-secondary' : 'btn-primary'}`} onClick={toggleSubscribe}>
            {subscribed ? '✓ Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      <h2 style={{ marginBottom: 'var(--space-md)' }}>Episodes ({episodes.length})</h2>
      {episodes.map(ep => (
        <div key={ep.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', padding: 'var(--space-md)' }}>
          <div>
            <h4>{ep.episode_number ? `#${ep.episode_number} ` : ''}{ep.title}</h4>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
              {ep.publish_date} · {formatDuration(ep.duration_seconds)}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => playEpisode(ep)}>▶ Play</button>
        </div>
      ))}
    </div>
  )
}

export default PodcastShowPage

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { usePlayer } from '../context/PlayerContext'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import notify from '../utils/toast'
import { getCoverImage } from '../utils/coverImage'

function AudiobookDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { play } = usePlayer()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { incrementCart } = useCart()
  const [book, setBook] = useState(null)
  const [reviews, setReviews] = useState([])
  const [similar, setSimilar] = useState([])
  const [quickPreview, setQuickPreview] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/audiobooks/${id}`).then(r => r.json()).then(d => { setBook(d); setLoading(false) })
    api.get(`/audiobooks/${id}/reviews`).then(r => r.json()).then(d => setReviews(d.reviews || []))
    api.get(`/audiobooks/${id}/similar`).then(r => r.json()).then(d => setSimilar(d.similar || []))
  }, [id])

  const handlePlay = () => {
    if (book) play({ id: book.id, title: book.title, artist: book.author, duration_seconds: book.duration_seconds, audio_url: book.audio_url })
  }

  const submitReview = async (e) => {
    e.preventDefault()
    const res = await api.post(`/audiobooks/${id}/reviews`, { rating: reviewRating, text: reviewText })
    if (res.ok) {
      const data = await res.json()
      setReviews([data, ...reviews])
      setReviewText('')
      setReviewRating(5)
      notify.success('Review submitted!')
    } else {
      notify.error('Failed to submit review')
    }
  }

  const addToCart = async () => {
    if (book?.print_edition) {
      const res = await api.post('/cart/items', { book_id: book.print_edition.id })
      if (res.ok) {
        notify.cart('Added to cart!')
        incrementCart()
      } else {
        notify.error('Failed to add to cart')
      }
    }
  }

  const handleWishlist = async () => {
    if (!user) { notify.info('Log in to save to wishlist'); return }
    const wasWishlisted = isWishlisted(book.id)
    await toggleWishlist(book.id)
    notify.wishlist(!wasWishlisted)
  }

  const fetchQuickPreview = async () => {
    try {
      const res = await api.get(`/audiobooks/${id}/quick-listen`)
      const data = await res.json()
      setQuickPreview(data)
    } catch { notify.error('Preview not available') }
  }

  if (loading) return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-2xl)' }}>
      <div className="card" style={{ padding: 'var(--space-xl)' }}>
        <div className="skeleton" style={{ height: '280px', borderRadius: 'var(--radius-lg)' }}></div>
        <div className="skeleton" style={{ height: '44px', marginTop: 'var(--space-lg)', borderRadius: 'var(--radius-md)' }}></div>
      </div>
      <div>
        <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: 'var(--space-md)' }}></div>
        <div className="skeleton" style={{ height: '20px', width: '50%', marginBottom: 'var(--space-lg)' }}></div>
        <div className="skeleton" style={{ height: '100px', marginBottom: 'var(--space-md)' }}></div>
      </div>
    </div>
  )
  if (!book) return <div className="error">Audiobook not found</div>

  const formatDuration = (s) => { const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m` }

  return (
    <div>
      <Helmet>
        <title>{book.title} by {book.author} — AudioBooks</title>
        <meta name="description" content={book.synopsis ? book.synopsis.slice(0, 160) : `Listen to ${book.title} by ${book.author}. ${formatDuration(book.duration_seconds)} audiobook.`} />
      </Helmet>
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--space-2xl)', marginBottom: 'var(--space-2xl)' }} className="detail-grid">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-xl)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-card)', opacity: 0.5 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: 'var(--space-lg)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)' }}>
              <img
                src={book.cover_image_url || getCoverImage(book.id)}
                alt={book.title}
                loading="eager"
                srcSet={`${book.cover_image_url || getCoverImage(book.id, 300, 420)} 300w, ${book.cover_image_url || getCoverImage(book.id, 400, 560)} 400w`}
                sizes="300px"
                style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
              />
              <div style={{ display: 'none', width: '100%', height: '280px', background: 'var(--gradient-card)', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '5rem' }}>🎧</span>
              </div>
            </div>
            <button className="btn btn-glow btn-lg" onClick={handlePlay} style={{ width: '100%', marginBottom: 'var(--space-md)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Play Audiobook
            </button>
            {book.print_edition && (
              <button className="btn btn-glass" onClick={addToCart} style={{ width: '100%', marginBottom: 'var(--space-sm)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                Buy Print · ${book.print_edition.price}
              </button>
            )}
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-glass" onClick={handleWishlist} style={{ flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(book.id) ? '#ef4444' : 'none'} stroke={isWishlisted(book.id) ? '#ef4444' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {isWishlisted(book.id) ? 'Saved' : 'Wishlist'}
              </button>
              <button className="btn btn-glass" onClick={fetchQuickPreview} style={{ flex: 1 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Preview
              </button>
            </div>
          </div>
        </div>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: 'var(--space-sm)', letterSpacing: '-0.02em' }}>{book.title}</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-lg)' }}>
            by <span style={{ color: 'var(--color-text)' }}>{book.author}</span>
            {book.narrator && <> · Narrated by <span style={{ color: 'var(--color-text)' }}>{book.narrator}</span></>}
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              {formatDuration(book.duration_seconds)}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)' }}>
              🌐 {book.language?.toUpperCase()}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-secondary)' }}>
              {book.category}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)', color: 'var(--color-rating-star)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {book.average_rating?.toFixed(1) || '—'}
            </span>
          </div>
          {book.synopsis && <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, fontSize: 'var(--font-size-md)' }}>{book.synopsis}</p>}
        </div>
      </div>

      {similar.length > 0 && (
        <section style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>Similar Titles</h2>
          <div style={{ display: 'flex', gap: 'var(--space-md)', overflowX: 'auto', paddingBottom: 'var(--space-sm)' }}>
            {similar.map(s => (
              <Link key={s.id} to={`/audiobook/${s.id}`} className="card" style={{ minWidth: '220px', textDecoration: 'none', color: 'inherit', flex: '0 0 auto', overflow: 'hidden', padding: 0 }}>
                <img
                  src={s.cover_image_url || getCoverImage(s.id)}
                  alt={s.title}
                  style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div style={{ padding: 'var(--space-md)' }}>
                  <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>{s.title}</h4>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{s.author}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-accent-secondary)', marginTop: 'var(--space-sm)' }}>{s.reasons?.join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-2xl)', fontWeight: 700 }}>
          Reviews <span style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-muted)', fontWeight: 400 }}>({reviews.length})</span>
        </h2>
        {user && (
          <form onSubmit={submitReview} className="card" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="form-group">
              <label>Rating</label>
              <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n>1?'s':''}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Review (optional)</label>
              <textarea rows="3" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your thoughts about this audiobook..." />
            </div>
            <button type="submit" className="btn btn-glow">Submit Review</button>
          </form>
        )}
        {reviews.map(r => (
          <div key={r.id} className="card" style={{ marginBottom: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-secondary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: 'white' }}>{r.user_display_name?.[0]?.toUpperCase()}</span>
                <strong style={{ fontSize: 'var(--font-size-sm)' }}>{r.user_display_name}</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < r.rating ? 'var(--color-rating-star)' : 'var(--color-border)'}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                ))}
              </div>
            </div>
            {r.text && <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 'var(--font-size-sm)' }}>{r.text}</p>}
          </div>
        ))}
        {reviews.length === 0 && <p className="empty">No reviews yet. Be the first to share your thoughts!</p>}
      </section>

      {/* Quick preview modal */}
      {quickPreview && (
        <div className="quick-preview-overlay" onClick={() => setQuickPreview(null)}>
          <motion.div
            className="quick-preview-modal card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={e => e.stopPropagation()}
          >
            <button className="btn btn-ghost" onClick={() => setQuickPreview(null)} style={{ position: 'absolute', top: '12px', right: '12px' }}>✕</button>
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>Quick Preview: {quickPreview.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.7 }}>{quickPreview.summary}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <span>Preview: ~{Math.ceil(quickPreview.estimated_duration_seconds / 60)} min</span>
              <span>Full: ~{Math.ceil(quickPreview.full_duration_seconds / 3600)} hrs</span>
            </div>
            <button className="btn btn-glow" onClick={() => { handlePlay(); setQuickPreview(null) }} style={{ marginTop: 'var(--space-lg)', width: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Play Full Audiobook
            </button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AudiobookDetailPage

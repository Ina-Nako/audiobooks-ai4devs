import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import api from '../api/client'
import { usePlayer } from '../context/PlayerContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import SkeletonGrid from '../components/SkeletonLoader'
import notify from '../utils/toast'
import { getCoverImage } from '../utils/coverImage'

function CatalogPage() {
  const { play } = usePlayer()
  const { user } = useAuth()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { incrementCart } = useCart()
  const [searchParams, setSearchParams] = useSearchParams()

  const [audiobooks, setAudiobooks] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [quickPreview, setQuickPreview] = useState(null)

  // Read filters from URL
  const search = searchParams.get('search') || ''
  const language = searchParams.get('language') || ''
  const category = searchParams.get('category') || ''

  const observerRef = useRef()
  const lastBookRef = useRef()

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set(key, value)
    else params.delete(key)
    setSearchParams(params, { replace: true })
    setAudiobooks([])
    setPage(1)
    setHasMore(true)
  }

  const fetchBooks = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true)
    else setLoadingMore(true)

    const params = new URLSearchParams({ page: pageNum, limit: 12 })
    if (search) params.set('search', search)
    if (language) params.set('language', language)
    if (category) params.set('category', category)

    try {
      const res = await api.get(`/audiobooks?${params}`)
      const d = await res.json()
      const newBooks = d.audiobooks || []
      setTotal(d.total || 0)
      setHasMore(newBooks.length === 12)

      if (append) {
        setAudiobooks(prev => [...prev, ...newBooks])
      } else {
        setAudiobooks(newBooks)
      }
    } catch {
      notify.error('Failed to load audiobooks')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [search, language, category])

  // Initial load and when filters change
  useEffect(() => {
    setPage(1)
    fetchBooks(1, false)
  }, [fetchBooks])

  // Keep a ref to fetchBooks to avoid stale closures in observer
  const fetchBooksRef = useRef(fetchBooks)
  fetchBooksRef.current = fetchBooks

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect()

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
        setPage(prev => {
          const nextPage = prev + 1
          fetchBooksRef.current(nextPage, true)
          return nextPage
        })
      }
    }, { threshold: 0.1 })

    if (lastBookRef.current) observerRef.current.observe(lastBookRef.current)

    return () => observerRef.current?.disconnect()
  }, [hasMore, loadingMore, loading])

  const formatDuration = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const handlePlay = (e, book) => {
    e.preventDefault()
    e.stopPropagation()
    play({ id: book.id, title: book.title, artist: book.author, duration_seconds: book.duration_seconds, audio_url: book.audio_url })
  }

  const handleQuickPreview = async (e, book) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const res = await api.get(`/audiobooks/${book.id}/quick-listen`)
      const data = await res.json()
      setQuickPreview(data)
    } catch {
      notify.error('Preview not available')
    }
  }

  const addToCart = async (e, book) => {
    e.preventDefault()
    e.stopPropagation()
    const res = await api.post('/cart/items', { book_id: book.id })
    if (res.ok) {
      notify.cart('Added to cart!')
      incrementCart()
    } else {
      const d = await res.json()
      notify.error(d.error || 'Failed to add to cart')
    }
  }

  const handleWishlist = async (e, book) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      notify.info('Log in to save to wishlist')
      return
    }
    const wasWishlisted = isWishlisted(book.id)
    await toggleWishlist(book.id)
    notify.wishlist(!wasWishlisted)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    updateParam('search', formData.get('search'))
  }

  return (
    <div>
      <Helmet>
        <title>Audiobook Catalog — AudioBooks</title>
        <meta name="description" content="Browse, listen, and buy from our collection of premium audiobooks. Stream instantly or purchase print editions." />
      </Helmet>

      <div className="page-header">
        <h1 style={{ fontFamily: 'var(--font-display)' }}>🎧 Audiobook Catalog</h1>
        <p>Listen to audiobooks or buy the print edition — all in one place</p>
      </div>


      <form className="filters-bar" onSubmit={handleSearchSubmit}>
        <input
          type="text" name="search" placeholder="Search title, author, narrator..."
          defaultValue={search}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <select value={language} onChange={e => updateParam('language', e.target.value)}>
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="sq">Albanian</option>
        </select>
        <select value={category} onChange={e => updateParam('category', e.target.value)}>
          <option value="">All Categories</option>
          <option value="Classic Literature">Classic Literature</option>
          <option value="Science Fiction">Science Fiction</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Non-Fiction">Non-Fiction</option>
          <option value="Self-Help">Self-Help</option>
          <option value="Psychology">Psychology</option>
          <option value="Philosophy">Philosophy</option>
        </select>
        <button type="submit" className="btn btn-glow">Search</button>
      </form>

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', fontSize: 'var(--font-size-sm)' }}>
        <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{total}</span> audiobooks found
      </p>

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
            <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>{quickPreview.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.7 }}>{quickPreview.summary}</p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
              <span>Preview: ~{Math.ceil(quickPreview.estimated_duration_seconds / 60)} min</span>
              <span>Full: ~{Math.ceil(quickPreview.full_duration_seconds / 3600)} hrs</span>
            </div>
            <button className="btn btn-glow" onClick={() => { play({ id: quickPreview.audiobook_id, title: quickPreview.title, duration_seconds: quickPreview.full_duration_seconds }); setQuickPreview(null) }} style={{ marginTop: 'var(--space-lg)', width: '100%' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              Play Full Audiobook
            </button>
          </motion.div>
        </div>
      )}

      {loading ? (
        <SkeletonGrid count={12} />
      ) : (
        <>
          <div className="card-grid">
            {audiobooks.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.3 }}
                ref={index === audiobooks.length - 1 ? lastBookRef : null}
              >
                <Link to={`/audiobook/${book.id}`} className="card catalog-card" style={{ textDecoration: 'none', color: 'inherit', overflow: 'hidden', padding: 0, display: 'block', height: '100%' }}>
                  <div className="catalog-card-cover" style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={book.cover_image_url || getCoverImage(book.id)}
                      alt={book.title}
                      loading="lazy"
                      srcSet={`${book.cover_image_url || getCoverImage(book.id, 300, 420)} 300w, ${book.cover_image_url || getCoverImage(book.id, 400, 560)} 400w`}
                      sizes="(max-width: 640px) 300px, 400px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                    />
                    <div style={{ display: 'none', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: 'var(--gradient-card)', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '2.5rem', opacity: 0.6 }}>📖</span>
                    </div>
                    {/* Wishlist button */}
                    <button
                      className="wishlist-btn"
                      onClick={(e) => handleWishlist(e, book)}
                      aria-label={isWishlisted(book.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s', zIndex: 10 }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill={isWishlisted(book.id) ? '#ef4444' : 'none'} stroke={isWishlisted(book.id) ? '#ef4444' : 'white'} strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </button>
                    {/* Quick play + preview overlay */}
                    <div className="catalog-card-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-sm)', opacity: 0, transition: 'opacity 0.2s' }}>
                      <button
                        className="btn btn-glow"
                        onClick={(e) => handlePlay(e, book)}
                        style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Play"
                        aria-label={`Play ${book.title}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </button>
                      <button
                        className="btn btn-glass"
                        onClick={(e) => handleQuickPreview(e, book)}
                        style={{ borderRadius: '50%', width: '44px', height: '44px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        title="Quick Preview"
                        aria-label={`Preview ${book.title}`}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                      </button>
                    </div>
                    {/* Listening progress bar */}
                    {book.progress && !book.progress.completed && (
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.3)' }}>
                        <div style={{ height: '100%', width: `${Math.min((book.progress.position_seconds / book.duration_seconds) * 100, 100)}%`, background: 'var(--gradient-primary)', borderRadius: '0 2px 2px 0' }}></div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 'var(--space-md) var(--space-lg) var(--space-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-md)', fontWeight: 600, lineHeight: 1.3, fontFamily: 'var(--font-display)' }}>{book.title}</h3>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-sm)' }}>{book.author}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-sm)', fontSize: 'var(--font-size-xs)' }}>
                      <span style={{ padding: '3px 8px', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-muted)' }}>{formatDuration(book.duration_seconds)}</span>
                      <span style={{ padding: '3px 8px', background: 'var(--color-bg-glass)', borderRadius: 'var(--radius-full)', color: 'var(--color-text-muted)' }}>{book.language?.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'var(--space-sm)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-rating-star)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{book.average_rating?.toFixed(1) || '—'}</span>
                    </div>
                    {/* Buy print section */}
                    {book.print_available && (
                      <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-sm)', borderTop: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            ${book.print_price}
                          </span>
                          <button
                            className="btn btn-glass"
                            onClick={(e) => addToCart(e, book)}
                            style={{ fontSize: 'var(--font-size-xs)', padding: '4px 12px' }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
                            Buy Print
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {loadingMore && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-2xl)' }}>
              <div className="loading-spinner"></div>
            </div>
          )}

          {!hasMore && audiobooks.length > 0 && (
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-2xl)', fontSize: 'var(--font-size-sm)' }}>
              You've reached the end — {total} total audiobooks
            </p>
          )}

          {audiobooks.length === 0 && !loading && <p className="empty">No audiobooks found matching your criteria.</p>}
        </>
      )}
    </div>
  )
}

export default CatalogPage

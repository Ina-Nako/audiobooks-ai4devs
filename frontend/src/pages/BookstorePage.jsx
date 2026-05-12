import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

function BookstorePage() {
  const [books, setBooks] = useState([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: 12 })
    if (search) params.set('search', search)
    api.get(`/bookstore?${params}`).then(r => r.json()).then(d => {
      setBooks(d.books || [])
      setTotal(d.total || 0)
    })
  }, [page, search])

  const addToCart = async (bookId) => {
    const res = await api.post('/cart/items', { book_id: bookId })
    if (res.ok) alert('Added to cart!')
    else {
      const d = await res.json()
      alert(d.error || 'Failed to add to cart')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>📚 Bookstore</h1>
        <p>Buy printed copies of your favorite audiobooks</p>
      </div>

      <div className="filters-bar">
        <input type="text" placeholder="Search books..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} style={{ flex: 1 }} />
        <Link to="/cart" className="btn btn-glass">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          View Cart
        </Link>
        <Link to="/orders" className="btn btn-glass">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Orders
        </Link>
      </div>

      <div className="card-grid">
        {books.map(book => (
          <div key={book.id} className="card">
            <div style={{ padding: '24px 0 16px', textAlign: 'center', background: 'var(--gradient-card)', margin: '-24px -24px 16px', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
              <span style={{ fontSize: '2.5rem' }}>📖</span>
            </div>
            <h3 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--space-xs)', fontWeight: 600 }}>{book.title}</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>{book.author}</p>
            <div style={{ margin: 'var(--space-md) 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${book.price}</span>
              <span style={{ fontSize: 'var(--font-size-xs)', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: book.in_stock ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: book.in_stock ? 'var(--color-success)' : 'var(--color-error)' }}>
                {book.in_stock ? '● In Stock' : '○ Out of Stock'}
              </span>
            </div>
            <button className="btn btn-glow" onClick={() => addToCart(book.id)} disabled={!book.in_stock} style={{ width: '100%', opacity: book.in_stock ? 1 : 0.5 }}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {books.length === 0 && <p className="empty">No books found.</p>}
    </div>
  )
}

export default BookstorePage

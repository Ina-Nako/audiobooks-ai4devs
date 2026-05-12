import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/client'

function ForumCategoryPage() {
  const { categoryId } = useParams()
  const [category, setCategory] = useState(null)
  const [threads, setThreads] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  useEffect(() => {
    api.get(`/forum/categories/${categoryId}/threads?page=${page}`).then(r => r.json()).then(d => {
      setCategory(d.category)
      setThreads(d.threads || [])
      setTotal(d.total || 0)
    })
  }, [categoryId, page])

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>{category?.name || 'Forum'}</h1>
          <p>{category?.description}</p>
        </div>
        <Link to="/forum/new" className="btn btn-primary">+ New Thread</Link>
      </div>

      {threads.map(t => (
        <Link key={t.id} to={`/forum/thread/${t.id}`} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)', textDecoration: 'none', color: 'inherit', padding: 'var(--space-md)' }}>
          <div>
            <h4>{t.is_pinned && '📌 '}{t.title}</h4>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              by {t.author_name} · {new Date(t.created_at).toLocaleDateString()}
            </p>
          </div>
          <div style={{ textAlign: 'right', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            <div>↑{t.upvotes} ↓{t.downvotes}</div>
            <div>{t.reply_count} replies</div>
          </div>
        </Link>
      ))}

      {threads.length === 0 && <p className="empty">No threads yet. Start the conversation!</p>}

      {total > 20 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span style={{ padding: 'var(--space-sm)' }}>Page {page}</span>
          <button disabled={threads.length < 20} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default ForumCategoryPage

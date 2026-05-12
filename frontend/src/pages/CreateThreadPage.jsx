import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

function CreateThreadPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ category_id: '', title: '', body: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/forum/categories').then(r => r.json()).then(d => {
      setCategories(d.categories || [])
      if (d.categories?.length) setForm(f => ({ ...f, category_id: d.categories[0].id }))
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await api.post('/forum/threads', form)
    if (res.ok) {
      const data = await res.json()
      navigate(`/forum/thread/${data.id}`)
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to create thread')
    }
  }

  if (!user) return <div className="auth-page"><h1>Please log in to create a thread</h1></div>

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <div className="page-header"><h1>Create New Thread</h1></div>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category</label>
          <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} required>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Title (5–200 characters)</label>
          <input required minLength={5} maxLength={200} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Body (10–10000 characters)</label>
          <textarea required minLength={10} rows="8" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Create Thread</button>
      </form>
    </div>
  )
}

export default CreateThreadPage

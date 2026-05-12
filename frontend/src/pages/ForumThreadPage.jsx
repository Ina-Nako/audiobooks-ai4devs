import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import notify from '../utils/toast'

function ForumThreadPage() {
  const { threadId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [thread, setThread] = useState(null)
  const [replies, setReplies] = useState([])
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    api.get(`/forum/threads/${threadId}`).then(r => r.json()).then(d => {
      setThread(d)
      setReplies(d.replies || [])
    })
  }, [threadId])

  const submitReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    const res = await api.post(`/forum/threads/${threadId}/replies`, { body: replyText })
    if (res.ok) {
      const data = await res.json()
      setReplies([...replies, data])
      setReplyText('')
      setThread(t => ({ ...t, reply_count: (t.reply_count || 0) + 1 }))
    }
  }

  const deleteThread = async () => {
    if (!window.confirm('Are you sure you want to delete this thread?')) return
    const res = await api.delete(`/forum/threads/${threadId}`)
    if (res.ok) {
      notify.success('Thread deleted')
      navigate('/forum')
    } else {
      notify.error('Failed to delete thread')
    }
  }

  const deleteReply = async (replyId) => {
    if (!window.confirm('Delete this reply?')) return
    const res = await api.delete(`/forum/replies/${replyId}`)
    if (res.ok) {
      setReplies(reps => reps.filter(r => r.id !== replyId))
      setThread(t => ({ ...t, reply_count: Math.max(0, (t.reply_count || 1) - 1) }))
      notify.success('Reply deleted')
    } else {
      notify.error('Failed to delete reply')
    }
  }

  const vote = async (targetType, targetId, value) => {
    const res = await api.post('/forum/vote', { target_type: targetType, target_id: targetId, value })
    if (res.ok) {
      const data = await res.json()
      if (targetType === 'thread') {
        setThread(t => ({ ...t, upvotes: data.upvotes, downvotes: data.downvotes }))
      } else {
        setReplies(reps => reps.map(r => r.id === targetId ? { ...r, upvotes: data.upvotes, downvotes: data.downvotes } : r))
      }
    }
  }

  if (!thread) return <div className="loading">Loading...</div>

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>{thread.title}</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-md)' }}>
          by {thread.author_name} · {new Date(thread.created_at).toLocaleDateString()}
        </p>
        <p style={{ lineHeight: 1.8 }}>{thread.body}</p>
        {user && (
          <div style={{ marginTop: 'var(--space-md)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
            <button className="btn btn-secondary" onClick={() => vote('thread', thread.id, 1)}>↑ {thread.upvotes}</button>
            <button className="btn btn-secondary" onClick={() => vote('thread', thread.id, -1)}>↓ {thread.downvotes}</button>
            {user.id === thread.user_id && (
              <button className="btn btn-secondary" onClick={deleteThread} style={{ marginLeft: 'auto', color: 'var(--color-error, #ef4444)' }}>🗑 Delete Thread</button>
            )}
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: 'var(--space-md)' }}>Replies ({replies.length})</h3>

      {replies.map(reply => (
        <div key={reply.id} className="card" style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-sm)' }}>
            <strong>{reply.author_name}</strong>
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
              {new Date(reply.created_at).toLocaleDateString()}
            </span>
          </div>
          <p style={{ lineHeight: 1.7 }}>{reply.body}</p>
          {user && (
            <div style={{ marginTop: 'var(--space-sm)', display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
              <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)' }} onClick={() => vote('reply', reply.id, 1)}>↑ {reply.upvotes}</button>
              <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)' }} onClick={() => vote('reply', reply.id, -1)}>↓ {reply.downvotes}</button>
              {user.id === reply.user_id && (
                <button className="btn btn-secondary" style={{ fontSize: 'var(--font-size-xs)', marginLeft: 'auto', color: 'var(--color-error, #ef4444)' }} onClick={() => deleteReply(reply.id)}>🗑 Delete</button>
              )}
            </div>
          )}
        </div>
      ))}

      {user && !thread.is_locked ? (
        <form onSubmit={submitReply} className="card">
          <div className="form-group">
            <label>Write a reply</label>
            <textarea rows="4" value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Share your thoughts..." required />
          </div>
          <button type="submit" className="btn btn-primary">Post Reply</button>
        </form>
      ) : !user ? (
        <p className="empty">Log in to reply to this thread.</p>
      ) : (
        <p className="empty">This thread is locked.</p>
      )}
    </div>
  )
}

export default ForumThreadPage

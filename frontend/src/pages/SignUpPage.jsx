import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignUpPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, password, displayName)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>✨</div>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Create Account</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Join thousands of listeners and readers</p>
      </div>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)', textAlign: 'center', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Display Name</label>
          <input required minLength={2} maxLength={50} value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="How others will see you" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 chars, 1 uppercase, 1 number" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-glow btn-lg" style={{ width: '100%' }}>Create Account</button>
        </div>
      </form>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Log In</Link>
      </p>
    </div>
  )
}

export default SignUpPage

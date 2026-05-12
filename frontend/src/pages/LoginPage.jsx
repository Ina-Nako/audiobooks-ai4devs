import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>🎧</div>
        <h1 style={{ marginBottom: 'var(--space-sm)' }}>Welcome Back</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>Sign in to continue your listening journey</p>
      </div>
      {error && <div style={{ color: 'var(--color-error)', marginBottom: 'var(--space-md)', textAlign: 'center', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-glow btn-lg" style={{ width: '100%' }}>Log In</button>
        </div>
      </form>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-xl)', color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
        Don't have an account? <Link to="/signup" style={{ fontWeight: 600 }}>Sign Up</Link>
      </p>
    </div>
  )
}

export default LoginPage

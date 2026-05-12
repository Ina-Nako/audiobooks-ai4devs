import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-4xl) var(--space-xl)' }}>
      <Helmet>
        <title>Page Not Found — AudioBooks</title>
      </Helmet>
      <h1 style={{ fontSize: 'var(--font-size-5xl)', fontFamily: 'var(--font-display)', marginBottom: 'var(--space-md)' }}>404</h1>
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-lg)', marginBottom: 'var(--space-2xl)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-glow btn-lg">Back to Home</Link>
    </div>
  )
}

export default NotFoundPage

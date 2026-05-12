import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-2xl)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>⚠️</div>
          <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            Something went wrong
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)', maxWidth: '400px' }}>
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            className="btn btn-glow"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary

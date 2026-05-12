function SkeletonCard() {
  return (
    <div className="card skeleton-card" style={{ overflow: 'hidden', padding: 0 }}>
      <div className="skeleton skeleton-image" style={{ height: '180px', width: '100%' }}></div>
      <div style={{ padding: 'var(--space-md) var(--space-lg) var(--space-lg)' }}>
        <div className="skeleton skeleton-text" style={{ height: '18px', width: '80%', marginBottom: 'var(--space-sm)' }}></div>
        <div className="skeleton skeleton-text" style={{ height: '14px', width: '60%', marginBottom: 'var(--space-md)' }}></div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <div className="skeleton skeleton-text" style={{ height: '24px', width: '60px', borderRadius: 'var(--radius-full)' }}></div>
          <div className="skeleton skeleton-text" style={{ height: '24px', width: '40px', borderRadius: 'var(--radius-full)' }}></div>
        </div>
      </div>
    </div>
  )
}

function SkeletonGrid({ count = 12 }) {
  return (
    <div className="card-grid">
      {[...Array(count)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}

export { SkeletonCard, SkeletonGrid }
export default SkeletonGrid

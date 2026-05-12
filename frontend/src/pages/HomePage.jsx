import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'
import { getCoverImage } from '../utils/coverImage'

function HomePage() {
  const { user } = useAuth()
  const [featured, setFeatured] = useState([])
  const [episodes, setEpisodes] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [visibleSections, setVisibleSections] = useState({})
  const sectionRefs = useRef({})

  useEffect(() => {
    api.get('/home/featured').then(r => r.json()).then(d => setFeatured(d.featured || []))
    api.get('/home/latest-episodes').then(r => r.json()).then(d => setEpisodes(d.episodes || []))
    api.get('/home/active-discussions').then(r => r.json()).then(d => setDiscussions(d.discussions || []))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [featured, episodes, discussions])

  return (
    <div className="home-page">
      <Helmet>
        <title>AudioBooks — Discover Stories That Move You</title>
        <meta name="description" content="Your premium destination for audiobooks, podcasts, and literary discussions. Stream 10K+ audiobooks, explore exclusive podcasts, and join a community of passionate readers." />
      </Helmet>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}></div>
          ))}
        </div>
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            <span>New releases every week</span>
          </div>
          <h1 className="hero-title">
            Discover Stories That
            <span className="gradient-text"> Move You</span>
          </h1>
          <p className="hero-subtitle">
            Immerse yourself in a world of audiobooks, podcasts, and vibrant discussions.
            Premium listening experiences curated for passionate readers.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn btn-glow btn-lg">
              <span>Explore Library</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/podcasts" className="btn btn-glass btn-lg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              <span>Listen to Podcasts</span>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Audiobooks</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Podcasts</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Listeners</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-cards">
            <div className="float-card float-card-1">
              <div className="mini-waveform">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
                ))}
              </div>
              <span>Now Playing</span>
            </div>
            <div className="float-card float-card-2">
              <span className="float-icon">📚</span>
              <span>1,247 titles</span>
            </div>
            <div className="float-card float-card-3">
              <span className="float-icon">⭐</span>
              <span>Top Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Join CTA for non-users */}
      {!user && (
        <section className="cta-section animate-on-scroll" id="cta-join">
          <div className={`cta-card glass-card ${visibleSections['cta-join'] ? 'visible' : ''}`}>
            <div className="cta-content">
              <h2>Join Our Growing Community</h2>
              <p>Create your free account to track listening progress, write reviews, participate in discussions, and unlock personalized recommendations.</p>
              <div className="cta-features">
                <div className="cta-feature">
                  <span className="feature-icon">📊</span>
                  <span>Track Progress</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">✍️</span>
                  <span>Write Reviews</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">💬</span>
                  <span>Join Discussions</span>
                </div>
                <div className="cta-feature">
                  <span className="feature-icon">🎯</span>
                  <span>Get Recommendations</span>
                </div>
              </div>
            </div>
            <div className="cta-actions">
              <Link to="/signup" className="btn btn-glow btn-lg">Get Started Free</Link>
              <Link to="/login" className="btn btn-glass">Already have an account?</Link>
            </div>
          </div>
        </section>
      )}

      {/* Featured Audiobooks */}
      <section className="content-section animate-on-scroll" id="featured-section">
        <div className={`section-wrapper ${visibleSections['featured-section'] ? 'visible' : ''}`}>
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">🎧</span>
              <div>
                <h2>Featured Audiobooks</h2>
                <p>Handpicked selections from our curators</p>
              </div>
            </div>
            <Link to="/catalog" className="btn btn-glass">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="featured-grid">
            {featured.map((book, index) => (
              <Link 
                key={book.id} 
                to={`/audiobook/${book.id}`} 
                className="featured-card glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-cover">
                  <img
                    src={book.cover_image_url || getCoverImage(book.id)}
                    alt={book.title}
                    loading="lazy"
                    srcSet={`${book.cover_image_url || getCoverImage(book.id)} 400w`}
                    sizes="(max-width: 640px) 280px, 320px"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                  />
                  <div className="cover-placeholder" style={{ display: 'none' }}>
                    <span className="cover-icon">📖</span>
                  </div>
                  <div className="card-overlay">
                    <button className="play-btn">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{book.title}</h3>
                  <p className="card-author">{book.author}</p>
                  <div className="card-meta">
                    <span className="card-category">{book.category}</span>
                    <div className="card-rating">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--color-rating-star)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span>{book.average_rating?.toFixed(1) || '—'}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Podcast Episodes */}
      <section className="content-section animate-on-scroll" id="podcasts-section">
        <div className={`section-wrapper ${visibleSections['podcasts-section'] ? 'visible' : ''}`}>
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">🎙</span>
              <div>
                <h2>Latest Podcast Episodes</h2>
                <p>Fresh conversations and insights</p>
              </div>
            </div>
            <Link to="/podcasts" className="btn btn-glass">
              All Podcasts
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="episodes-list">
            {episodes.map((ep, index) => (
              <Link 
                key={ep.id} 
                to={`/podcasts/${ep.show_id}`} 
                className="episode-card glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="episode-number">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className="episode-info">
                  <h4>{ep.title}</h4>
                  <p className="episode-show">{ep.show_title}</p>
                </div>
                <div className="episode-meta">
                  <span className="episode-date">{ep.publish_date}</span>
                  <div className="episode-play-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Active Discussions */}
      <section className="content-section animate-on-scroll" id="discussions-section">
        <div className={`section-wrapper ${visibleSections['discussions-section'] ? 'visible' : ''}`}>
          <div className="section-header">
            <div className="section-title-group">
              <span className="section-icon">💬</span>
              <div>
                <h2>Active Discussions</h2>
                <p>Join the conversation with fellow readers</p>
              </div>
            </div>
            <Link to="/forum" className="btn btn-glass">
              Visit Forum
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
          <div className="discussions-list">
            {discussions.map((t, index) => (
              <Link 
                key={t.id} 
                to={`/forum/thread/${t.id}`} 
                className="discussion-card glass-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="discussion-votes">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="18 15 12 9 6 15"/></svg>
                  <span>{t.score}</span>
                </div>
                <div className="discussion-content">
                  <h4>{t.title}</h4>
                  <div className="discussion-meta">
                    <span className="discussion-author">
                      <span className="author-avatar">{t.author_name?.[0]?.toUpperCase()}</span>
                      {t.author_name}
                    </span>
                    <span className="discussion-replies">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {t.reply_count} replies
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            {discussions.length === 0 && (
              <div className="empty-state glass-card">
                <span className="empty-icon">💭</span>
                <p>No discussions yet. Be the first to start one!</p>
                <Link to="/forum/new" className="btn btn-glow">Start a Discussion</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="features-section animate-on-scroll" id="features-section">
        <div className={`section-wrapper ${visibleSections['features-section'] ? 'visible' : ''}`}>
          <div className="features-header">
            <h2>Why Choose AudioBooks?</h2>
            <p>Everything you need for the ultimate listening experience</p>
          </div>
          <div className="features-grid">
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>🎵</span>
              </div>
              <h3>Premium Audio</h3>
              <p>Crystal-clear narration with professional voice actors and studio-quality production.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>📱</span>
              </div>
              <h3>Listen Anywhere</h3>
              <p>Seamlessly switch between devices. Your progress syncs automatically everywhere.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>🌙</span>
              </div>
              <h3>Sleep Timer</h3>
              <p>Fall asleep to your favorite stories with customizable sleep timer and fade-out.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>👥</span>
              </div>
              <h3>Community</h3>
              <p>Connect with readers worldwide. Share reviews, discuss plots, and discover gems.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>📖</span>
              </div>
              <h3>Buy Print Editions</h3>
              <p>Purchase physical copies directly from the catalog. Special editions and signed copies available.</p>
            </div>
            <div className="feature-card glass-card">
              <div className="feature-icon-wrapper">
                <span>🎙</span>
              </div>
              <h3>Exclusive Podcasts</h3>
              <p>Author interviews, book discussions, and literary analysis from industry experts.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

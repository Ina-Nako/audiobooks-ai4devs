import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import AppShell from './components/AppShell'
import HomePage from './pages/HomePage'
import CatalogPage from './pages/CatalogPage'
import AudiobookDetailPage from './pages/AudiobookDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import PodcastHubPage from './pages/PodcastHubPage'
import PodcastShowPage from './pages/PodcastShowPage'
import ForumHomePage from './pages/ForumHomePage'
import ForumCategoryPage from './pages/ForumCategoryPage'
import ForumThreadPage from './pages/ForumThreadPage'
import CreateThreadPage from './pages/CreateThreadPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import ProfilePage from './pages/ProfilePage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 }
}

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.25
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/catalog" element={<AnimatedPage><CatalogPage /></AnimatedPage>} />
          <Route path="/audiobook/:id" element={<AnimatedPage><AudiobookDetailPage /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><CartPage /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><CheckoutPage /></AnimatedPage>} />
          <Route path="/orders" element={<AnimatedPage><OrderHistoryPage /></AnimatedPage>} />
          <Route path="/podcasts" element={<AnimatedPage><PodcastHubPage /></AnimatedPage>} />
          <Route path="/podcasts/:showId" element={<AnimatedPage><PodcastShowPage /></AnimatedPage>} />
          <Route path="/forum" element={<AnimatedPage><ForumHomePage /></AnimatedPage>} />
          <Route path="/forum/:categoryId" element={<AnimatedPage><ForumCategoryPage /></AnimatedPage>} />
          <Route path="/forum/thread/:threadId" element={<AnimatedPage><ForumThreadPage /></AnimatedPage>} />
          <Route path="/forum/new" element={<AnimatedPage><CreateThreadPage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/signup" element={<AnimatedPage><SignUpPage /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><ProfilePage /></AnimatedPage>} />
          <Route path="/notifications" element={<AnimatedPage><NotificationsPage /></AnimatedPage>} />
          <Route path="*" element={<AnimatedPage><NotFoundPage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </AppShell>
  )
}

export default App

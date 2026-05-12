import toast from 'react-hot-toast'

const toastStyles = {
  style: {
    background: 'var(--color-bg-secondary)',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '12px 20px',
    fontSize: 'var(--font-size-sm)',
    backdropFilter: 'blur(20px)',
  },
}

export const notify = {
  success: (msg) => toast.success(msg, toastStyles),
  error: (msg) => toast.error(msg, toastStyles),
  info: (msg) => toast(msg, { ...toastStyles, icon: 'ℹ️' }),
  cart: (msg) => toast.success(msg, {
    ...toastStyles,
    icon: '🛒',
    duration: 2000,
  }),
  wishlist: (added) => toast.success(
    added ? 'Added to wishlist' : 'Removed from wishlist',
    { ...toastStyles, icon: added ? '❤️' : '💔', duration: 1500 }
  ),
}

export default notify

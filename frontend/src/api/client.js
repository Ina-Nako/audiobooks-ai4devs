const BASE_URL = '/api'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('access_token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })

  if (res.status === 401 && token) {
    // Try refresh
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${refreshToken}`, 'Content-Type': 'application/json' }
      })
      if (refreshRes.ok) {
        const data = await refreshRes.json()
        localStorage.setItem('access_token', data.access_token)
        headers['Authorization'] = `Bearer ${data.access_token}`
        const retry = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers })
        return retry
      } else {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
  }
  return res
}

export const api = {
  get: (url) => request(url),
  post: (url, data) => request(url, { method: 'POST', body: JSON.stringify(data) }),
  patch: (url, data) => request(url, { method: 'PATCH', body: JSON.stringify(data) }),
  put: (url, data) => request(url, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (url) => request(url, { method: 'DELETE' }),
}

export default api

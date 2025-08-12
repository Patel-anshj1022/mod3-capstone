const API_URL = import.meta.env.VITE_API_URL || ''

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let message = 'Request failed'
    try { const data = await res.json(); message = data.message || message } catch {}
    throw new Error(message)
  }
  return res.json()
}
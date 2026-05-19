const BASE = '/api'

async function request(path, options = {}) {
  const { token, body, ...rest } = options
  const res = await fetch(`${BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })

  if (res.status === 200 && res.headers.get('content-length') === '0') return null
  if (res.status === 204) return null

  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`)
  return data
}

export const api = {
  get:    (path, token)        => request(path, { method: 'GET', token }),
  post:   (path, body, token)  => request(path, { method: 'POST', body, token }),
  put:    (path, body, token)  => request(path, { method: 'PUT', body, token }),
  patch:  (path, body, token)  => request(path, { method: 'PATCH', body, token }),
  delete: (path, token)        => request(path, { method: 'DELETE', token }),
}

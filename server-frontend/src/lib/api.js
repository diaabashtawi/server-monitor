const BASE = '/server'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const body = await res.json().catch(() => null)
  if (!res.ok) throw new Error(body?.message || `Request failed (${res.status})`)
  return body
}

export const api = {
  listServers: () => request('/list').then((r) => r.data?.servers ?? []),
  getServer: (id) => request(`/get/${id}`).then((r) => r.data?.server),
  createServer: (server) =>
    request('/save', { method: 'POST', body: JSON.stringify(server) }).then((r) => r.data?.server),
  deleteServer: (id) => request(`/delete/${id}`, { method: 'DELETE' }),
  pingServer: (ipAddress) => request(`/ping/${ipAddress}`).then((r) => r.data?.server),
}

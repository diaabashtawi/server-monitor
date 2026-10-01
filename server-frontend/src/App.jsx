import { useEffect, useState } from 'react'
import { RefreshCw, Server } from 'lucide-react'
import AddServerDialog from '@/components/AddServerDialog'
import ServerCard from '@/components/ServerCard'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'

export default function App() {
  const [servers, setServers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      setServers(await api.listServers())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const showNotice = (msg) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  const addServer = async (form) => {
    const created = await api.createServer(form)
    if (created) setServers((prev) => [...prev, created])
    showNotice(`Server "${form.name}" created successfully`)
  }

  const pingServer = async (server) => {
    const updated = await api.pingServer(server.ipAddress)
    setServers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  }

  const deleteServer = async (server) => {
    try {
      await api.deleteServer(server.id)
      setServers((prev) => prev.filter((s) => s.id !== server.id))
      showNotice(`Server "${server.name}" deleted successfully`)
    } catch (err) {
      setError(err.message || 'Failed to delete server')
    }
  }

  const upCount = servers.filter((s) => s.status === 'SERVER_UP').length

  return (
    <div className="min-h-svh bg-muted/40">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Server className="size-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-none">Server Monitor</h1>
              <p className="text-sm text-muted-foreground">
                {upCount} of {servers.length} servers up
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
            <AddServerDialog onAdd={addServer} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {notice && (
          <Alert className="mb-4 border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400">
            <AlertDescription>{notice}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Could not reach the API</AlertTitle>
            <AlertDescription>{error}. Make sure the Spring backend runs on port 8080.</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : servers.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-background p-10 text-center">
            <Server className="mx-auto mb-3 size-10 text-muted-foreground" />
            <p className="font-medium">No servers yet</p>
            <p className="text-sm text-muted-foreground">Add your first server to start monitoring.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {servers.map((server) => (
              <ServerCard key={server.id} server={server} onPing={pingServer} onDelete={deleteServer} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { useState } from 'react'
import { Loader2, RotateCw, Server, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ServerCard({ server, onPing, onDelete }) {
  const [pinging, setPinging] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const up = server.status === 'SERVER_UP'

  const handlePing = async () => {
    setPinging(true)
    try {
      await onPing(server)
    } catch (err) {
      alert(err.message || 'Failed to ping server')
    } finally {
      setPinging(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(server)
    } catch (err) {
      alert(err.message || 'Failed to delete server')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4 p-4">
        <div className="relative">
          {pinging && (
            <>
              <span className="absolute inset-0 animate-ping rounded-lg bg-primary/30" />
              <span className="absolute inset-0 animate-ping rounded-lg bg-primary/20 [animation-delay:200ms]" />
            </>
          )}
          {server.imageUrl ? (
            <img
              src={server.imageUrl}
              alt={server.name}
              className={`size-16 rounded-lg border object-cover ${pinging ? 'animate-pulse' : ''}`}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          ) : (
            <div className={`flex size-16 items-center justify-center rounded-lg bg-muted ${pinging ? 'animate-pulse' : ''}`}>
              <Server className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium">{server.name}</h3>
          <p className="truncate font-mono text-sm text-muted-foreground">{server.ipAddress}</p>
          <p className="text-xs text-muted-foreground">
            {server.type} · {server.memory} GB
          </p>
        </div>
        <Badge variant={up ? 'default' : 'destructive'}>
          {up ? 'UP' : 'DOWN'}
        </Badge>
      </div>
      <CardContent className="flex gap-2 p-4 pt-0">
        <Button size="sm" variant="outline" onClick={handlePing} disabled={pinging}>
          {pinging ? <Loader2 className="size-4 animate-spin" /> : <RotateCw className="size-4 transition-transform hover:rotate-90" />}
          {pinging ? 'Pinging…' : 'Ping'}
        </Button>
        <Button size="sm" variant="destructive" onClick={() => setConfirmOpen(true)} disabled={deleting}>
          {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
          Delete
        </Button>
      </CardContent>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete server?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{server.name}" ({server.ipAddress}). This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const EMPTY = { name: '', ipAddress: '', memory: '', type: '' }

export default function AddServerDialog({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onAdd(form)
      setForm(EMPTY)
      setOpen(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus className="size-4" /> Add Server
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Server</DialogTitle>
          <DialogDescription>Register a new server to monitor.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={set('name')} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="ip">IP Address</Label>
            <Input id="ip" placeholder="192.168.1.10" value={form.ipAddress} onChange={set('ipAddress')} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="memory">Memory (GB)</Label>
            <Input id="memory" value={form.memory} onChange={set('memory')} required />
          </div>
          <div className="flex flex-col gap-1">
            <Label htmlFor="type">Type</Label>
            <Input id="type" placeholder="WEB / DB / APP" value={form.type} onChange={set('type')} required />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

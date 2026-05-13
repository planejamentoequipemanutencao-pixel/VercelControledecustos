'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Equipamento } from '@/types'

export function EquipamentosTab({ initialData }: { initialData: Equipamento[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Equipamento | null>(null)
  const [loading, setLoading] = useState(false)

  function openNew() { setEditing(null); setOpen(true) }
  function openEdit(e: Equipamento) { setEditing(e); setOpen(true) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const payload = { nome: form.get('nome') as string, abreviacao: (form.get('abreviacao') as string).toUpperCase().slice(0, 5), identificacao: form.get('identificacao') as string || null }

    if (editing) {
      await supabase.from('equipamentos').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('equipamentos').insert(payload)
    }
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm('Excluir este equipamento? Os registros associados serão mantidos.')) return
    const supabase = createClient()
    await supabase.from('equipamentos').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Novo Equipamento
        </Button>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">Abreviação</TableHead>
              <TableHead className="text-zinc-400">Identificação</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((e) => (
              <TableRow key={e.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="text-zinc-200 font-medium text-sm">{e.nome}</TableCell>
                <TableCell className="text-zinc-400 font-mono text-sm">{e.abreviacao}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{e.identificacao ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(e)} className="h-7 w-7 text-zinc-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(e.id)} className="h-7 w-7 text-zinc-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} Equipamento</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Nome *</Label>
              <Input name="nome" required defaultValue={editing?.nome ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Abreviação * (máx 5 letras)</Label>
              <Input name="abreviacao" required maxLength={5} defaultValue={editing?.abreviacao ?? ''} className="bg-zinc-800 border-zinc-700 text-white uppercase" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Identificação</Label>
              <Input name="identificacao" defaultValue={editing?.identificacao ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Salvando...' : 'Salvar'}</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import type { Assunto } from '@/types'

export function AssuntosTab({ initialData }: { initialData: Assunto[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Assunto | null>(null)
  const [tipo, setTipo] = useState<'normal' | 'equipamento'>('normal')
  const [loading, setLoading] = useState(false)

  function openNew() { setEditing(null); setTipo('normal'); setOpen(true) }
  function openEdit(a: Assunto) { setEditing(a); setTipo(a.tipo); setOpen(true) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const payload = { nome: form.get('nome') as string, tipo }

    if (editing) {
      await supabase.from('assuntos').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('assuntos').insert(payload)
    }
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm('Excluir este assunto?')) return
    const supabase = createClient()
    await supabase.from('assuntos').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Novo Assunto
        </Button>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">Tipo</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((a) => (
              <TableRow key={a.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="text-zinc-200 font-medium text-sm">{a.nome}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.tipo === 'equipamento' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {a.tipo}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(a)} className="h-7 w-7 text-zinc-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(a.id)} className="h-7 w-7 text-zinc-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <DialogTitle className="text-white">{editing ? 'Editar' : 'Novo'} Assunto</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Nome *</Label>
              <Input name="nome" required defaultValue={editing?.nome ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Tipo</Label>
              <Select value={tipo} onValueChange={(v) => setTipo(v as 'normal' | 'equipamento')}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="normal" className="text-white">Normal (Atividades)</SelectItem>
                  <SelectItem value="equipamento" className="text-white">Equipamento</SelectItem>
                </SelectContent>
              </Select>
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

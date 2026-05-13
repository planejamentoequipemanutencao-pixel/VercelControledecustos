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
import type { Filial } from '@/types'

export function FilialTab({ initialData }: { initialData: Filial[] }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Filial | null>(null)
  const [loading, setLoading] = useState(false)

  function openNew() { setEditing(null); setOpen(true) }
  function openEdit(f: Filial) { setEditing(f); setOpen(true) }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const payload = { nome: form.get('nome') as string, cnpj: form.get('cnpj') as string || null, cidade: form.get('cidade') as string || null, estado: form.get('estado') as string || null, regiao: form.get('regiao') as string || null }

    if (editing) {
      await supabase.from('filiais').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('filiais').insert(payload)
    }
    setOpen(false)
    setLoading(false)
    router.refresh()
  }

  async function handleDelete(id: number) {
    if (!confirm('Excluir esta filial?')) return
    const supabase = createClient()
    await supabase.from('filiais').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={openNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Nova Filial
        </Button>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Nome</TableHead>
              <TableHead className="text-zinc-400">CNPJ</TableHead>
              <TableHead className="text-zinc-400">Cidade</TableHead>
              <TableHead className="text-zinc-400">Estado</TableHead>
              <TableHead className="text-zinc-400">Região</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((f) => (
              <TableRow key={f.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="text-zinc-200 font-medium text-sm">{f.nome}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{f.cnpj ?? '—'}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{f.cidade ?? '—'}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{f.estado ?? '—'}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{f.regiao ?? '—'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(f)} className="h-7 w-7 text-zinc-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(f.id)} className="h-7 w-7 text-zinc-400 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? 'Editar' : 'Nova'} Filial</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-zinc-300">Nome *</Label>
              <Input name="nome" required defaultValue={editing?.nome ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-zinc-300">CNPJ</Label>
                <Input name="cnpj" defaultValue={editing?.cnpj ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Região</Label>
                <Input name="regiao" defaultValue={editing?.regiao ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Cidade</Label>
                <Input name="cidade" defaultValue={editing?.cidade ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Estado</Label>
                <Input name="estado" maxLength={2} placeholder="SP" defaultValue={editing?.estado ?? ''} className="bg-zinc-800 border-zinc-700 text-white" />
              </div>
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

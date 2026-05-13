'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { dateToDisplay } from '@/lib/validators'
import { Search, CheckCircle } from 'lucide-react'
import type { OrdemServico } from '@/types'

export function ResolverOSClient({ osAbertas }: { osAbertas: OrdemServico[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<OrdemServico | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const filtered = osAbertas.filter((os) =>
    os.numero_os.toLowerCase().includes(search.toLowerCase()) ||
    (os.filial_nome ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (os.descricao ?? '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleResolve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const supabase = createClient()
    const hoje = new Date().toISOString().split('T')[0]

    const { error: updateError } = await supabase
      .from('ordens_servico')
      .update({
        status: 'Fechado',
        data_fechamento: hoje,
        custo: parseFloat((form.get('custo') as string).replace(',', '.')) || null,
        observacoes: form.get('observacoes') as string || selected.observacoes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selected.id)

    if (updateError) {
      setError('Erro ao fechar OS: ' + updateError.message)
      setLoading(false)
      return
    }

    setSelected(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Buscar por número, filial ou descrição..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500"
        />
      </div>

      {/* Lista de OS */}
      {!selected && (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Nº OS</TableHead>
                <TableHead className="text-zinc-400">Filial</TableHead>
                <TableHead className="text-zinc-400">Descrição</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Prazo</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((os) => (
                <TableRow key={os.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-mono text-xs text-zinc-200">{os.numero_os}</TableCell>
                  <TableCell className="text-zinc-300 text-sm">{os.filial_nome ?? '—'}</TableCell>
                  <TableCell className="text-zinc-300 text-sm max-w-xs truncate">{os.descricao}</TableCell>
                  <TableCell><StatusBadge status={os.status} /></TableCell>
                  <TableCell className="text-zinc-400 text-sm">{os.data_prazo ? dateToDisplay(os.data_prazo) : '—'}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => setSelected(os)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-700 text-xs">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" /> Resolver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-zinc-500 py-8">Nenhuma OS encontrada.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form de resolução */}
      {selected && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-zinc-300 flex items-center justify-between">
              <span>Encerrando OS <span className="font-mono text-blue-400">{selected.numero_os}</span></span>
              <Button size="sm" variant="ghost" onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white text-xs">Voltar</Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-3 bg-zinc-800 rounded-lg text-sm text-zinc-300">
              <p><span className="text-zinc-500">Filial:</span> {selected.filial_nome}</p>
              <p><span className="text-zinc-500">Descrição:</span> {selected.descricao}</p>
            </div>
            <form onSubmit={handleResolve} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Custo (R$)</Label>
                  <Input name="custo" placeholder="0,00" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-zinc-300">Observações de encerramento</Label>
                <Textarea name="observacoes" defaultValue={selected.observacoes ?? ''} className="bg-zinc-800 border-zinc-700 text-white resize-none" rows={3} />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading} className="flex-1 bg-green-600 hover:bg-green-700">
                  {loading ? 'Encerrando...' : 'Confirmar Encerramento'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setSelected(null)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

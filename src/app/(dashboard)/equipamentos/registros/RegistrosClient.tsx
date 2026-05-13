'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, dateToDisplay, calcNFStatus } from '@/lib/validators'
import { Search, Plus, Download } from 'lucide-react'
import { NovoRegistroDialog } from './NovoRegistroDialog'
import * as XLSX from 'xlsx'
import type { RegistroManutencao, Equipamento, Filial } from '@/types'

interface Props {
  registros: RegistroManutencao[]
  equipamentos: Equipamento[]
  filiais: Filial[]
}

export function RegistrosClient({ registros, equipamentos, filiais }: Props) {
  const [equipTab, setEquipTab] = useState<string>('todos')
  const [filialFilter, setFilialFilter] = useState<string>('todos')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)

  // Enriquece com status de NF calculado
  const enriched = useMemo(() =>
    registros.map((r) => ({ ...r, nf_status: calcNFStatus(r.numero_nf, r.lancamento_id, r.data_previsao_nf) })),
    [registros]
  )

  const filtered = useMemo(() => {
    return enriched.filter((r) => {
      if (equipTab !== 'todos' && String(r.equipamento_id) !== equipTab) return false
      if (filialFilter !== 'todos' && String(r.filial_id) !== filialFilter) return false
      if (statusFilter !== 'todos' && r.nf_status !== statusFilter) return false
      if (search && !r.descricao?.toLowerCase().includes(search.toLowerCase()) &&
          !r.fornecedor_nome?.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [enriched, equipTab, filialFilter, statusFilter, search])

  const totalFiltrado = filtered.reduce((sum, r) => sum + (r.valor ?? 0), 0)

  function exportar() {
    const rows = filtered.map((r) => ({
      Equipamento: r.equipamento_nome ?? '',
      Filial: r.filial_nome ?? '',
      Descrição: r.descricao,
      Fornecedor: r.fornecedor_nome ?? '',
      Valor: r.valor ?? 0,
      Data: dateToDisplay(r.data_intervencao),
      'Status NF': r.nf_status ?? '',
      'Nº NF': r.numero_nf ?? '',
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Registros')
    XLSX.writeFile(wb, 'registros_manutencao.xlsx')
  }

  return (
    <div className="space-y-4">
      {/* Abas por equipamento */}
      <Tabs value={equipTab} onValueChange={setEquipTab}>
        <TabsList className="bg-zinc-900 border border-zinc-800 h-auto flex-wrap gap-1 p-1">
          <TabsTrigger value="todos" className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">Todos</TabsTrigger>
          {equipamentos.map((e) => (
            <TabsTrigger key={e.id} value={String(e.id)} className="text-xs data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              {e.nome}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filtros + ações */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500" />
        </div>

        <Select value={filialFilter} onValueChange={(v) => setFilialFilter(v ?? 'todos')}>
          <SelectTrigger className="w-40 bg-zinc-900 border-zinc-700 text-zinc-300 text-sm">
            <SelectValue placeholder="Filial" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="todos" className="text-white">Todas filiais</SelectItem>
            {filiais.map((f) => <SelectItem key={f.id} value={String(f.id)} className="text-white">{f.nome}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? 'todos')}>
          <SelectTrigger className="w-36 bg-zinc-900 border-zinc-700 text-zinc-300 text-sm">
            <SelectValue placeholder="Status NF" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="todos" className="text-white">Todos</SelectItem>
            {['Vinculada', 'Pendente', 'Atrasada'].map((s) => <SelectItem key={s} value={s} className="text-white">{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" onClick={exportar} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          <Download className="h-4 w-4 mr-1" /> Excel
        </Button>

        <Button size="sm" onClick={() => setShowNew(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-1" /> Novo
        </Button>
      </div>

      {/* Totais */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-2.5">
        <span className="text-xs text-zinc-400">{filtered.length} registro(s)</span>
        <span className="text-sm font-semibold text-white">Total: {formatCurrency(totalFiltrado)}</span>
      </div>

      {/* Tabela */}
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Equipamento</TableHead>
              <TableHead className="text-zinc-400">Filial</TableHead>
              <TableHead className="text-zinc-400">Descrição</TableHead>
              <TableHead className="text-zinc-400">Fornecedor</TableHead>
              <TableHead className="text-zinc-400">Data</TableHead>
              <TableHead className="text-zinc-400">Status NF</TableHead>
              <TableHead className="text-zinc-400 text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id} className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer">
                <TableCell className="text-zinc-200 text-sm font-medium">{r.equipamento_nome ?? '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm">{r.filial_nome ?? '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm max-w-xs truncate">{r.descricao}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{r.fornecedor_nome ?? '—'}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{dateToDisplay(r.data_intervencao)}</TableCell>
                <TableCell><StatusBadge status={r.nf_status ?? 'Pendente'} /></TableCell>
                <TableCell className="text-zinc-200 text-sm font-medium text-right">{formatCurrency(r.valor ?? 0)}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-zinc-500 py-8">Nenhum registro encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showNew && (
        <NovoRegistroDialog
          equipamentos={equipamentos}
          filiais={filiais}
          onClose={() => setShowNew(false)}
        />
      )}
    </div>
  )
}

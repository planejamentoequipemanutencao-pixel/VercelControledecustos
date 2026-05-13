import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatCurrency, dateToDisplay } from '@/lib/validators'

export default async function GlobalPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: os }, { data: registros }] = await Promise.all([
    supabase.from('ordens_servico').select('*').order('created_at', { ascending: false }).limit(100),
    supabase.from('registros_manutencao').select('*').order('data_intervencao', { ascending: false }).limit(100),
  ])

  const itensOS = (os ?? []).map((o) => ({ tipo: 'OS', id: o.id, descricao: o.descricao, filial: o.filial_nome, status: o.status, data: o.data_abertura, valor: o.custo }))
  const itensReg = (registros ?? []).map((r) => ({ tipo: 'Registro', id: r.id, descricao: r.descricao, filial: r.filial_nome, status: r.status, data: r.data_intervencao, valor: r.valor }))
  const todos = [...itensOS, ...itensReg].sort((a, b) => (b.data ?? '').localeCompare(a.data ?? ''))

  const totalCusto = todos.reduce((s, i) => s + (i.valor ?? 0), 0)

  return (
    <div>
      <PageHeader title="Visão Global" description="Consolidado de OS e registros de equipamentos" />

      <div className="flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-3 mb-4">
        <span className="text-xs text-zinc-400">{todos.length} item(ns) total</span>
        <span className="text-sm font-semibold text-white">Custo total: {formatCurrency(totalCusto)}</span>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Tipo</TableHead>
              <TableHead className="text-zinc-400">Filial</TableHead>
              <TableHead className="text-zinc-400">Descrição</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Data</TableHead>
              <TableHead className="text-zinc-400 text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todos.map((item, i) => (
              <TableRow key={`${item.tipo}-${item.id}-${i}`} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.tipo === 'OS' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {item.tipo}
                  </span>
                </TableCell>
                <TableCell className="text-zinc-300 text-sm">{item.filial ?? '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm max-w-xs truncate">{item.descricao}</TableCell>
                <TableCell><StatusBadge status={item.status ?? '—'} /></TableCell>
                <TableCell className="text-zinc-400 text-sm">{item.data ? dateToDisplay(item.data) : '—'}</TableCell>
                <TableCell className="text-zinc-200 text-sm font-medium text-right">{item.valor ? formatCurrency(item.valor) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

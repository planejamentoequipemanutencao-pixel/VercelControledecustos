'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { dateToDisplay } from '@/lib/validators'
import type { OrdemServico } from '@/types'

export function OSTable({ data }: { data: OrdemServico[] }) {
  if (!data.length) {
    return <p className="text-sm text-zinc-500 py-4 text-center">Nenhuma OS encontrada.</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">Nº OS</TableHead>
            <TableHead className="text-zinc-400">Filial</TableHead>
            <TableHead className="text-zinc-400">Assunto</TableHead>
            <TableHead className="text-zinc-400">Responsável</TableHead>
            <TableHead className="text-zinc-400">Status</TableHead>
            <TableHead className="text-zinc-400">Prioridade</TableHead>
            <TableHead className="text-zinc-400">Prazo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((os) => (
            <TableRow key={os.id} className="border-zinc-800 hover:bg-zinc-800/50 cursor-pointer">
              <TableCell className="text-zinc-200 font-mono text-xs">{os.numero_os}</TableCell>
              <TableCell className="text-zinc-300 text-sm">{os.filial_nome ?? '—'}</TableCell>
              <TableCell className="text-zinc-300 text-sm">{os.assunto_nome ?? '—'}</TableCell>
              <TableCell className="text-zinc-300 text-sm">{os.responsavel_nome ?? '—'}</TableCell>
              <TableCell><StatusBadge status={os.status} /></TableCell>
              <TableCell><StatusBadge status={os.prioridade} /></TableCell>
              <TableCell className="text-zinc-400 text-sm">{os.data_prazo ? dateToDisplay(os.data_prazo) : '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

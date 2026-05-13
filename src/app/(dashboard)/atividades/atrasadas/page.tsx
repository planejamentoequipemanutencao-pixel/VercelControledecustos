import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { dateToDisplay } from '@/lib/validators'
import { AlertTriangle } from 'lucide-react'

export default async function AtrasadasPage() {
  const supabase = await createServerSupabaseClient()
  const hoje = new Date().toISOString().split('T')[0]

  const { data: os } = await supabase
    .from('ordens_servico')
    .select('*')
    .neq('status', 'Fechado')
    .lt('data_prazo', hoje)
    .order('data_prazo', { ascending: true })

  const lista = os ?? []

  return (
    <div>
      <PageHeader
        title="OS Atrasadas"
        description={`${lista.length} ordem(ns) com prazo vencido`}
      />

      {lista.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <AlertTriangle className="h-10 w-10 mb-3 text-green-500 opacity-50" />
          <p className="text-sm">Nenhuma OS atrasada. Ótimo trabalho!</p>
        </div>
      ) : (
        <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Nº OS</TableHead>
                <TableHead className="text-zinc-400">Filial</TableHead>
                <TableHead className="text-zinc-400">Assunto</TableHead>
                <TableHead className="text-zinc-400">Responsável</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Prazo</TableHead>
                <TableHead className="text-zinc-400">Dias em atraso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lista.map((os) => {
                const prazo = new Date(os.data_prazo!)
                const diasAtraso = Math.floor((new Date().getTime() - prazo.getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <TableRow key={os.id} className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableCell className="text-zinc-200 font-mono text-xs">{os.numero_os}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">{os.filial_nome ?? '—'}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">{os.assunto_nome ?? '—'}</TableCell>
                    <TableCell className="text-zinc-300 text-sm">{os.responsavel_nome ?? '—'}</TableCell>
                    <TableCell><StatusBadge status={os.status} /></TableCell>
                    <TableCell className="text-red-400 text-sm">{dateToDisplay(os.data_prazo!)}</TableCell>
                    <TableCell className="text-red-400 text-sm font-medium">{diasAtraso}d</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

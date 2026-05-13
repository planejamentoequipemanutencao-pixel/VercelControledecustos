import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { dateToDisplay } from '@/lib/validators'

export default async function HistoricoAtividadesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: os } = await supabase
    .from('ordens_servico')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(100)

  const lista = os ?? []

  return (
    <div>
      <PageHeader title="Histórico de Atividades" description="Todas as ordens de serviço" />
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-400">Nº OS</TableHead>
              <TableHead className="text-zinc-400">Filial</TableHead>
              <TableHead className="text-zinc-400">Assunto</TableHead>
              <TableHead className="text-zinc-400">Responsável</TableHead>
              <TableHead className="text-zinc-400">Status</TableHead>
              <TableHead className="text-zinc-400">Abertura</TableHead>
              <TableHead className="text-zinc-400">Fechamento</TableHead>
              <TableHead className="text-zinc-400 text-right">Custo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lista.map((os) => (
              <TableRow key={os.id} className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell className="font-mono text-xs text-zinc-200">{os.numero_os}</TableCell>
                <TableCell className="text-zinc-300 text-sm">{os.filial_nome ?? '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm">{os.assunto_nome ?? '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm">{os.responsavel_nome ?? '—'}</TableCell>
                <TableCell><StatusBadge status={os.status} /></TableCell>
                <TableCell className="text-zinc-400 text-sm">{dateToDisplay(os.data_abertura)}</TableCell>
                <TableCell className="text-zinc-400 text-sm">{os.data_fechamento ? dateToDisplay(os.data_fechamento) : '—'}</TableCell>
                <TableCell className="text-zinc-300 text-sm text-right">
                  {os.custo ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(os.custo) : '—'}
                </TableCell>
              </TableRow>
            ))}
            {lista.length === 0 && (
              <TableRow><TableCell colSpan={8} className="text-center text-zinc-500 py-8">Nenhum registro encontrado.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

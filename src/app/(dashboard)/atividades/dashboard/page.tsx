import { createServerSupabaseClient } from '@/lib/supabase/server'
import { KpiCard } from '@/components/shared/KpiCard'
import { PageHeader } from '@/components/shared/PageHeader'
import { Activity, AlertTriangle, Clock, CheckCircle } from 'lucide-react'
import { OSTable } from './OSTable'

async function getKPIs() {
  const supabase = await createServerSupabaseClient()
  const hoje = new Date().toISOString().split('T')[0]

  const [{ count: abertas }, { count: atrasadas }, { count: fechadasMes }] = await Promise.all([
    supabase.from('ordens_servico').select('*', { count: 'exact', head: true }).neq('status', 'Fechado'),
    supabase.from('ordens_servico').select('*', { count: 'exact', head: true }).neq('status', 'Fechado').lt('data_prazo', hoje),
    supabase.from('ordens_servico').select('*', { count: 'exact', head: true }).eq('status', 'Fechado')
      .gte('data_fechamento', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
  ])

  return { abertas: abertas ?? 0, atrasadas: atrasadas ?? 0, fechadasMes: fechadasMes ?? 0 }
}

async function getRecentOS() {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from('ordens_servico')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20)
  return data ?? []
}

export default async function AtividadesDashboard() {
  const [kpis, recentOS] = await Promise.all([getKPIs(), getRecentOS()])

  return (
    <div>
      <PageHeader title="Dashboard — Atividades" description="Resumo geral das ordens de serviço" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="OS Abertas" value={kpis.abertas} icon={Activity} color="blue" />
        <KpiCard title="Atrasadas" value={kpis.atrasadas} icon={AlertTriangle} color="red" />
        <KpiCard title="Fechadas este mês" value={kpis.fechadasMes} icon={CheckCircle} color="green" />
        <KpiCard title="Em andamento" value={kpis.abertas - kpis.atrasadas} icon={Clock} color="yellow" />
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h2 className="text-sm font-semibold text-zinc-300 mb-4">Últimas Ordens de Serviço</h2>
        <OSTable data={recentOS} />
      </div>
    </div>
  )
}

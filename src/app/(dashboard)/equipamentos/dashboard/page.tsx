import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { KpiCard } from '@/components/shared/KpiCard'
import { DollarSign, FileText, AlertCircle, TrendingUp } from 'lucide-react'
import { DashboardCharts } from './DashboardCharts'
import { formatCurrency } from '@/lib/validators'

async function getDashboardData() {
  const supabase = await createServerSupabaseClient()
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]

  const [{ data: registros }, { data: todos }] = await Promise.all([
    supabase.from('registros_manutencao').select('*').gte('data_intervencao', inicioMes),
    supabase.from('registros_manutencao').select('*').order('data_intervencao', { ascending: false }).limit(200),
  ])

  const allRegistros = todos ?? []
  const mesRegistros = registros ?? []

  const custoTotal = allRegistros.reduce((sum, r) => sum + (r.valor ?? 0), 0)
  const custoMes = mesRegistros.reduce((sum, r) => sum + (r.valor ?? 0), 0)
  const nfPendentes = allRegistros.filter((r) => !r.numero_nf && !r.lancamento_id).length
  const abertos = allRegistros.filter((r) => r.status === 'Aberto').length

  // Custo por equipamento
  const porEquip: Record<string, number> = {}
  allRegistros.forEach((r) => {
    if (r.equipamento_nome) porEquip[r.equipamento_nome] = (porEquip[r.equipamento_nome] ?? 0) + (r.valor ?? 0)
  })
  const custoEquip = Object.entries(porEquip).map(([nome, custo]) => ({ nome, custo })).sort((a, b) => b.custo - a.custo).slice(0, 8)

  // Custo mensal (últimos 6 meses)
  const mensal: Record<string, number> = {}
  allRegistros.forEach((r) => {
    const mes = r.data_intervencao?.slice(0, 7) ?? ''
    if (mes) mensal[mes] = (mensal[mes] ?? 0) + (r.valor ?? 0)
  })
  const custoMensal = Object.entries(mensal).sort().slice(-6).map(([mes, custo]) => ({ mes, custo }))

  return { custoTotal, custoMes, nfPendentes, abertos, custoEquip, custoMensal }
}

export default async function EquipamentosDashboard() {
  const data = await getDashboardData()

  return (
    <div>
      <PageHeader title="Dashboard — Custo de Equipamentos" description="Visão geral de custos de manutenção" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Custo Total" value={formatCurrency(data.custoTotal)} icon={DollarSign} color="blue" />
        <KpiCard title="Custo este mês" value={formatCurrency(data.custoMes)} icon={TrendingUp} color="green" />
        <KpiCard title="NFs Pendentes" value={data.nfPendentes} icon={FileText} color="yellow" />
        <KpiCard title="Registros Abertos" value={data.abertos} icon={AlertCircle} color="red" />
      </div>

      <DashboardCharts custoEquip={data.custoEquip} custoMensal={data.custoMensal} />
    </div>
  )
}

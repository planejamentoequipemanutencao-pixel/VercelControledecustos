'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { formatCurrency } from '@/lib/validators'

interface Props {
  custoEquip: { nome: string; custo: number }[]
  custoMensal: { mes: string; custo: number }[]
}

const tooltipStyle = { backgroundColor: '#1c1c1e', border: '1px solid #3f3f46', borderRadius: 8, color: '#e4e4e7' }

export function DashboardCharts({ custoEquip, custoMensal }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Custo por Equipamento</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={custoEquip} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="nome" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), 'Custo']} />
            <Bar dataKey="custo" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl bg-zinc-900 border border-zinc-800 p-4">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4">Tendência Mensal (últimos 6 meses)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={custoMensal} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="mes" tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#71717a', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [formatCurrency(Number(v)), 'Custo']} />
            <Line type="monotone" dataKey="custo" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

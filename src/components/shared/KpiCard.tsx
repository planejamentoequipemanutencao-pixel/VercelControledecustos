import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
  description?: string
}

const colorMap = {
  blue:   { card: 'border-blue-500/20',   icon: 'bg-blue-500/10 text-blue-400' },
  green:  { card: 'border-green-500/20',  icon: 'bg-green-500/10 text-green-400' },
  red:    { card: 'border-red-500/20',    icon: 'bg-red-500/10 text-red-400' },
  yellow: { card: 'border-yellow-500/20', icon: 'bg-yellow-500/10 text-yellow-400' },
  purple: { card: 'border-purple-500/20', icon: 'bg-purple-500/10 text-purple-400' },
}

export function KpiCard({ title, value, icon: Icon, color = 'blue', description }: KpiCardProps) {
  const c = colorMap[color]
  return (
    <Card className={cn('bg-zinc-900 border', c.card)}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-zinc-400 font-medium uppercase tracking-wide">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {description && <p className="text-xs text-zinc-500">{description}</p>}
          </div>
          <div className={cn('rounded-lg p-2', c.icon)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const statusColors: Record<string, string> = {
  'Aberto':       'bg-red-500/20 text-red-400 border-red-500/30',
  'Em andamento': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Fechado':      'bg-green-500/20 text-green-400 border-green-500/30',
  'Vinculada':    'bg-green-500/20 text-green-400 border-green-500/30',
  'Pendente':     'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Atrasada':     'bg-red-500/20 text-red-400 border-red-500/30',
  'Baixa':        'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Normal':       'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
  'Alta':         'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Urgente':      'bg-red-600/20 text-red-300 border-red-600/30',
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', statusColors[status] ?? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30')}
    >
      {status}
    </Badge>
  )
}

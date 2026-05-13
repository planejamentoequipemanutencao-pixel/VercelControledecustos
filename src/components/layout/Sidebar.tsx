'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Activity, Wrench, BarChart3, Settings, LogOut,
  AlertTriangle, Clock, History, PlusCircle, CheckCircle,
  LayoutDashboard, List, Globe
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Module = 'atividades' | 'equipamentos' | 'global'

const modules = [
  { id: 'atividades' as Module, label: 'Atividades', icon: Activity, color: 'text-blue-400' },
  { id: 'equipamentos' as Module, label: 'Custo Equip.', icon: Wrench, color: 'text-green-400' },
  { id: 'global' as Module, label: 'Global', icon: Globe, color: 'text-purple-400' },
]

const navItems: Record<Module, { href: string; label: string; icon: React.ElementType }[]> = {
  atividades: [
    { href: '/atividades/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/atividades/nova', label: 'Nova OS', icon: PlusCircle },
    { href: '/atividades/resolver', label: 'Resolver OS', icon: CheckCircle },
    { href: '/atividades/atrasadas', label: 'Atrasadas', icon: AlertTriangle },
    { href: '/atividades/historico', label: 'Histórico', icon: History },
  ],
  equipamentos: [
    { href: '/equipamentos/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/equipamentos/registros', label: 'Registros', icon: List },
    { href: '/equipamentos/historico', label: 'Histórico', icon: History },
  ],
  global: [
    { href: '/global', label: 'Visão Global', icon: Globe },
    { href: '/global/historico', label: 'Histórico Global', icon: History },
  ],
}

function getActiveModule(pathname: string): Module {
  if (pathname.startsWith('/equipamentos')) return 'equipamentos'
  if (pathname.startsWith('/global')) return 'global'
  return 'atividades'
}

export function Sidebar({ atrasadasCount = 0 }: { atrasadasCount?: number }) {
  const pathname = usePathname()
  const router = useRouter()
  const activeModule = getActiveModule(pathname)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="flex h-screen w-56 flex-col bg-zinc-900 border-r border-zinc-800 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <h1 className="text-sm font-bold text-white leading-tight">Gestão de<br/>Manutenção</h1>
      </div>

      {/* Módulos */}
      <div className="flex gap-1 px-2 py-2 border-b border-zinc-800">
        {modules.map((mod) => {
          const Icon = mod.icon
          const isActive = activeModule === mod.id
          return (
            <Link
              key={mod.id}
              href={navItems[mod.id][0].href}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-md py-2 px-1 text-[10px] font-medium transition-colors',
                isActive
                  ? 'bg-zinc-700 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive ? mod.color : '')} />
              <span className="text-center leading-tight">{mod.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems[activeModule].map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const isAtrasadas = item.href.includes('atrasadas')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-zinc-700 text-white font-medium'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isAtrasadas && atrasadasCount > 0 && (
                <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {atrasadasCount}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="border-t border-zinc-800 px-2 py-2 space-y-1">
        <Link
          href="/configuracoes"
          className={cn(
            'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
            pathname.startsWith('/configuracoes')
              ? 'bg-zinc-700 text-white font-medium'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          )}
        >
          <Settings className="h-4 w-4" />
          <span>Configurações</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

import { Sidebar } from '@/components/layout/Sidebar'
import { createServerSupabaseClient } from '@/lib/supabase/server'

async function getAtrasadasCount(): Promise<number> {
  try {
    const supabase = await createServerSupabaseClient()
    const hoje = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('ordens_servico')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'Fechado')
      .lt('data_prazo', hoje)
    return count ?? 0
  } catch {
    return 0
  }
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const atrasadasCount = await getAtrasadasCount()

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar atrasadasCount={atrasadasCount} />
      <main className="ml-56 flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

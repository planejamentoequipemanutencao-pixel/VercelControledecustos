import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { ResolverOSClient } from './ResolverOSClient'

export default async function ResolverOSPage() {
  const supabase = await createServerSupabaseClient()
  const { data: osAbertas } = await supabase
    .from('ordens_servico')
    .select('*')
    .neq('status', 'Fechado')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <PageHeader title="Resolver OS" description="Busque e encerre ordens de serviço" />
      <ResolverOSClient osAbertas={osAbertas ?? []} />
    </div>
  )
}

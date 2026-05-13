import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { RegistrosClient } from './RegistrosClient'

export default async function RegistrosPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: registros }, { data: equipamentos }, { data: filiais }] = await Promise.all([
    supabase.from('registros_manutencao').select('*').order('data_intervencao', { ascending: false }).limit(300),
    supabase.from('equipamentos').select('id, nome, abreviacao').order('nome'),
    supabase.from('filiais').select('id, nome').order('nome'),
  ])

  return (
    <div>
      <PageHeader title="Registros de Manutenção" description="Histórico de intervenções por equipamento" />
      <RegistrosClient
        registros={registros ?? []}
        equipamentos={equipamentos ?? []}
        filiais={filiais ?? []}
      />
    </div>
  )
}

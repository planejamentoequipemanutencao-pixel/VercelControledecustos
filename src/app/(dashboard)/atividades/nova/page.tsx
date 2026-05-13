import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/shared/PageHeader'
import { NovaOSForm } from './NovaOSForm'

async function getFormData() {
  const supabase = await createServerSupabaseClient()
  const [{ data: filiais }, { data: assuntos }, { data: responsaveis }, { data: equipamentos }] = await Promise.all([
    supabase.from('filiais').select('id, nome').order('nome'),
    supabase.from('assuntos').select('id, nome, tipo').order('nome'),
    supabase.from('responsaveis').select('id, nome, eh_lider').order('nome'),
    supabase.from('equipamentos').select('id, nome, abreviacao').order('nome'),
  ])
  return {
    filiais: filiais ?? [],
    assuntos: assuntos ?? [],
    responsaveis: responsaveis ?? [],
    equipamentos: equipamentos ?? [],
  }
}

export default async function NovaOSPage() {
  const formData = await getFormData()
  return (
    <div className="max-w-3xl">
      <PageHeader title="Nova Ordem de Serviço" description="Preencha os dados para abrir uma OS de atividade" />
      <NovaOSForm {...formData} />
    </div>
  )
}

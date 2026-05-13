import { PageHeader } from '@/components/shared/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilialTab } from './tabs/FilialTab'
import { ResponsaveisTab } from './tabs/ResponsaveisTab'
import { EquipamentosTab } from './tabs/EquipamentosTab'
import { AssuntosTab } from './tabs/AssuntosTab'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ConfiguracoesPage() {
  const supabase = await createServerSupabaseClient()

  const [{ data: filiais }, { data: responsaveis }, { data: equipamentos }, { data: assuntos }] = await Promise.all([
    supabase.from('filiais').select('*').order('nome'),
    supabase.from('responsaveis').select('*').order('nome'),
    supabase.from('equipamentos').select('*').order('nome'),
    supabase.from('assuntos').select('*').order('nome'),
  ])

  return (
    <div>
      <PageHeader title="Configurações" description="Gerencie dados cadastrais do sistema" />

      <Tabs defaultValue="filiais">
        <TabsList className="bg-zinc-900 border border-zinc-800 mb-6">
          {['filiais', 'responsaveis', 'equipamentos', 'assuntos'].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="capitalize data-[state=active]:bg-zinc-700 data-[state=active]:text-white text-zinc-400">
              {tab === 'responsaveis' ? 'Responsáveis' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="filiais"><FilialTab initialData={filiais ?? []} /></TabsContent>
        <TabsContent value="responsaveis"><ResponsaveisTab initialData={responsaveis ?? []} /></TabsContent>
        <TabsContent value="equipamentos"><EquipamentosTab initialData={equipamentos ?? []} /></TabsContent>
        <TabsContent value="assuntos"><AssuntosTab initialData={assuntos ?? []} /></TabsContent>
      </Tabs>
    </div>
  )
}

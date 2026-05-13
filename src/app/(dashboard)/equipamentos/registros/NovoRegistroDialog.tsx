'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { parseCurrency } from '@/lib/validators'
import type { Equipamento, Filial } from '@/types'

interface Props {
  equipamentos: Equipamento[]
  filiais: Filial[]
  onClose: () => void
}

export function NovoRegistroDialog({ equipamentos, filiais, onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const supabase = createClient()

    const equipId = Number(form.get('equipamento_id'))
    const filialId = Number(form.get('filial_id'))
    const equip = equipamentos.find((e) => e.id === equipId)
    const filial = filiais.find((f) => f.id === filialId)

    const valor = parseCurrency(form.get('valor') as string)

    const payload = {
      equipamento_id: equipId || null,
      equipamento_nome: equip?.nome ?? null,
      filial_id: filialId || null,
      filial_nome: filial?.nome ?? null,
      descricao: form.get('descricao') as string,
      fornecedor_nome: form.get('fornecedor_nome') as string || null,
      valor,
      status: 'Aberto',
      data_intervencao: form.get('data_intervencao') as string,
      causa_manutencao: form.get('causa_manutencao') as string || null,
      dificuldade_tecnica: form.get('dificuldade_tecnica') as string || null,
      tipo_servico: form.get('tipo_servico') as string || null,
      numero_nf: form.get('numero_nf') as string || null,
      data_previsao_nf: form.get('data_previsao_nf') as string || null,
      observacoes: form.get('observacoes') as string || null,
    }

    const { error: err } = await supabase.from('registros_manutencao').insert(payload)

    if (err) {
      setError('Erro ao salvar: ' + err.message)
      setLoading(false)
      return
    }

    router.refresh()
    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Novo Registro de Manutenção</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="identificacao">
            <TabsList className="bg-zinc-800 border-zinc-700">
              <TabsTrigger value="identificacao" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-white">Identificação</TabsTrigger>
              <TabsTrigger value="nf" className="data-[state=active]:bg-zinc-700 text-zinc-400 data-[state=active]:text-white">Nota Fiscal</TabsTrigger>
            </TabsList>

            <TabsContent value="identificacao" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Equipamento *</Label>
                  <Select name="equipamento_id" required>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {equipamentos.map((e) => <SelectItem key={e.id} value={String(e.id)} className="text-white hover:bg-zinc-700">{e.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Filial</Label>
                  <Select name="filial_id">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {filiais.map((f) => <SelectItem key={f.id} value={String(f.id)} className="text-white hover:bg-zinc-700">{f.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Data da Intervenção *</Label>
                  <Input name="data_intervencao" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="bg-zinc-800 border-zinc-700 text-white" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Valor (R$) *</Label>
                  <Input name="valor" placeholder="0,00" required className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-zinc-300">Descrição *</Label>
                  <Textarea name="descricao" required placeholder="Descreva a intervenção realizada..." className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none" rows={2} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Fornecedor</Label>
                  <Input name="fornecedor_nome" placeholder="Nome do fornecedor" className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500" />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Causa da Manutenção</Label>
                  <Select name="causa_manutencao">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {['Corretiva', 'Preventiva', 'Preditiva', 'Emergencial', 'Melhoria'].map((c) => (
                        <SelectItem key={c} value={c} className="text-white hover:bg-zinc-700">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Dificuldade Técnica</Label>
                  <Select name="dificuldade_tecnica">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {['Baixa', 'Média', 'Alta'].map((d) => (
                        <SelectItem key={d} value={d} className="text-white hover:bg-zinc-700">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Tipo de Serviço</Label>
                  <Select name="tipo_servico">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {['Interno', 'Terceirizado', 'Misto'].map((t) => (
                        <SelectItem key={t} value={t} className="text-white hover:bg-zinc-700">{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <Label className="text-zinc-300">Observações</Label>
                  <Textarea name="observacoes" className="bg-zinc-800 border-zinc-700 text-white resize-none" rows={2} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="nf" className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Número da NF</Label>
                  <Input name="numero_nf" className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-zinc-300">Data Previsão NF</Label>
                  <Input name="data_previsao_nf" type="date" className="bg-zinc-800 border-zinc-700 text-white" />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1">{loading ? 'Salvando...' : 'Salvar Registro'}</Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">Cancelar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Filial, Assunto, Responsavel, Equipamento } from '@/types'

interface Props {
  filiais: Filial[]
  assuntos: Assunto[]
  responsaveis: Responsavel[]
  equipamentos: Equipamento[]
}

export function NovaOSForm({ filiais, assuntos, responsaveis, equipamentos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const lideres = responsaveis.filter((r) => r.eh_lider)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    const supabase = createClient()

    // Gera número de OS: busca último seq do ano
    const ano = new Date().getFullYear()
    const filialId = Number(form.get('filial_id'))
    const filial = filiais.find((f) => f.id === filialId)
    const abrev = filial?.nome?.slice(0, 4).toUpperCase() ?? 'OS'

    const { data: lastOS } = await supabase
      .from('ordens_servico')
      .select('numero_os')
      .like('numero_os', `${abrev}-${ano}-%`)
      .order('created_at', { ascending: false })
      .limit(1)

    let seq = 1
    if (lastOS && lastOS.length > 0) {
      const parts = lastOS[0].numero_os.split('-')
      seq = (parseInt(parts[2] ?? '0') || 0) + 1
    }
    const numero_os = `${abrev}-${ano}-${String(seq).padStart(3, '0')}`

    const payload = {
      numero_os,
      filial_id: filialId || null,
      filial_nome: filial?.nome ?? null,
      assunto_id: Number(form.get('assunto_id')) || null,
      assunto_nome: assuntos.find((a) => a.id === Number(form.get('assunto_id')))?.nome ?? null,
      descricao: form.get('descricao') as string,
      responsavel_id: Number(form.get('responsavel_id')) || null,
      responsavel_nome: responsaveis.find((r) => r.id === Number(form.get('responsavel_id')))?.nome ?? null,
      lider_id: Number(form.get('lider_id')) || null,
      lider_nome: lideres.find((l) => l.id === Number(form.get('lider_id')))?.nome ?? null,
      status: 'Aberto',
      prioridade: form.get('prioridade') as string || 'Normal',
      data_abertura: new Date().toISOString().split('T')[0],
      data_prazo: form.get('data_prazo') as string || null,
      observacoes: form.get('observacoes') as string || null,
    }

    const { error: insertError } = await supabase.from('ordens_servico').insert(payload)

    if (insertError) {
      setError('Erro ao criar OS: ' + insertError.message)
      setLoading(false)
      return
    }

    router.push('/atividades/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-zinc-300">Identificação</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Filial *</Label>
            <Select name="filial_id" required>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {filiais.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)} className="text-white hover:bg-zinc-700">{f.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Assunto *</Label>
            <Select name="assunto_id" required>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {assuntos.map((a) => (
                  <SelectItem key={a.id} value={String(a.id)} className="text-white hover:bg-zinc-700">{a.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label className="text-zinc-300">Descrição *</Label>
            <Textarea name="descricao" required placeholder="Descreva o problema ou atividade..." className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none" rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-zinc-300">Responsabilidade</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Responsável</Label>
            <Select name="responsavel_id">
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {responsaveis.map((r) => (
                  <SelectItem key={r.id} value={String(r.id)} className="text-white hover:bg-zinc-700">{r.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Líder</Label>
            <Select name="lider_id">
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {lideres.map((l) => (
                  <SelectItem key={l.id} value={String(l.id)} className="text-white hover:bg-zinc-700">{l.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-zinc-300">Prazo e Prioridade</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-zinc-300">Prioridade</Label>
            <Select name="prioridade" defaultValue="Normal">
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {['Baixa', 'Normal', 'Alta', 'Urgente'].map((p) => (
                  <SelectItem key={p} value={p} className="text-white hover:bg-zinc-700">{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-zinc-300">Prazo</Label>
            <Input name="data_prazo" type="date" className="bg-zinc-800 border-zinc-700 text-white" />
          </div>

          <div className="col-span-2 space-y-1.5">
            <Label className="text-zinc-300">Observações</Label>
            <Textarea name="observacoes" placeholder="Observações adicionais..." className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 resize-none" rows={2} />
          </div>
        </CardContent>
      </Card>

      {error && <p className="text-sm text-red-400 bg-red-950/30 rounded-md px-3 py-2">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Salvando...' : 'Abrir OS'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          Cancelar
        </Button>
      </div>
    </form>
  )
}

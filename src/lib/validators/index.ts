// Formata número para moeda brasileira
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

// Converte string monetária brasileira para número (ex: "R$ 1.234,56" → 1234.56)
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.')
  const num = parseFloat(cleaned)
  return isNaN(num) ? 0 : num
}

// Formata data DD/MM/YYYY para YYYY-MM-DD
export function dateToISO(value: string): string {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (match) return `${match[3]}-${match[2]}-${match[1]}`
  return value
}

// Formata data YYYY-MM-DD para DD/MM/YYYY
export function dateToDisplay(value: string): string {
  if (!value) return ''
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) return `${match[3]}/${match[2]}/${match[1]}`
  return value
}

// Calcula status da NF com base nas datas
export function calcNFStatus(
  numero_nf?: string,
  lancamento_id?: string,
  data_previsao_nf?: string,
  prazo_alerta_dias = 30
): 'Vinculada' | 'Pendente' | 'Atrasada' {
  if (numero_nf || lancamento_id) return 'Vinculada'
  if (!data_previsao_nf) return 'Pendente'
  const prazo = new Date(data_previsao_nf)
  const hoje = new Date()
  const diffDias = Math.floor((prazo.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  return diffDias < 0 ? 'Atrasada' : 'Pendente'
}

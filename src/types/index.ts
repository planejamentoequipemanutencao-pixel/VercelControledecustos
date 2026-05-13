// ── Filial ────────────────────────────────────────────────────────────────────
export interface Filial {
  id: number
  nome: string
  cnpj?: string
  endereco?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  regiao?: string
}

// ── Equipamento ───────────────────────────────────────────────────────────────
export interface Equipamento {
  id: number
  nome: string
  abreviacao: string
  sheet_name?: string
  identificacao?: string
  data_cadastro?: string
}

// ── Responsável ───────────────────────────────────────────────────────────────
export interface Responsavel {
  id: number
  nome: string
  cargo?: string
  telefone?: string
  regiao?: string
  eh_lider: boolean
}

// ── Assunto / Subassunto ──────────────────────────────────────────────────────
export interface Assunto {
  id: number
  nome: string
  tipo: 'normal' | 'equipamento'
}

export interface Subassunto {
  id: number
  assunto_id: number
  nome: string
}

// ── Ordem de Serviço (Atividades) ─────────────────────────────────────────────
export type OSStatus = 'Aberto' | 'Em andamento' | 'Fechado'
export type OSPrioridade = 'Baixa' | 'Normal' | 'Alta' | 'Urgente'

export interface OrdemServico {
  id: number
  numero_os: string
  filial_id?: number
  filial_nome?: string
  assunto_id?: number
  assunto_nome?: string
  subassunto_id?: number
  subassunto_nome?: string
  descricao: string
  responsavel_id?: number
  responsavel_nome?: string
  lider_id?: number
  lider_nome?: string
  status: OSStatus
  prioridade: OSPrioridade
  data_abertura: string
  data_prazo?: string
  data_fechamento?: string
  custo?: number
  observacoes?: string
  created_at?: string
  updated_at?: string
  synced_at?: string
}

export interface OSHistorico {
  id: number
  os_id: number
  campo: string
  valor_anterior?: string
  valor_novo?: string
  alterado_por?: string
  created_at: string
}

// ── Registro de Manutenção (Custo Equipamento) ────────────────────────────────
export type NFStatus = 'Vinculada' | 'Pendente' | 'Atrasada'

export interface RegistroManutencao {
  id: number
  equipamento_id: number
  equipamento_nome?: string
  filial_id?: number
  filial_nome?: string
  descricao: string
  fornecedor_nome?: string
  cnpj_fornecedor?: string
  cnpj_loja?: string
  valor: number
  status: 'Aberto' | 'Fechado'
  data_intervencao: string
  causa_manutencao?: string
  dificuldade_tecnica?: string
  tipo_servico?: string
  causa_falha?: string
  numero_nf?: string
  data_nf?: string
  valor_nf?: number
  lancamento_id?: string
  data_previsao_nf?: string
  observacoes?: string
  nf_status?: NFStatus
  created_at?: string
}

// ── Fornecedor (Supabase empresa) ─────────────────────────────────────────────
export interface Fornecedor {
  id: string
  nome: string
  cnpj: string
  cidade?: string
  uf?: string
}

// ── Lançamento NF (Supabase empresa) ─────────────────────────────────────────
export interface Lancamento {
  id: string
  numero_nf?: string
  fornecedor_nome?: string
  valor?: number
  data_emissao?: string
  cnpj_fornecedor?: string
}

// ── Usuário (autenticação) ────────────────────────────────────────────────────
export type UserPerfil = 'admin' | 'lider' | 'executor' | 'visualizador'

export interface Usuario {
  id: string
  email: string
  nome: string
  perfil: UserPerfil
  regiao?: string
  created_at?: string
}

// ── Campos customizados ───────────────────────────────────────────────────────
export interface CampoCustomizado {
  id?: number
  label: string
  options: string[]
  required: boolean
}

// ── Grupos de campos configuráveis ───────────────────────────────────────────
export interface FieldGroups {
  causa_manutencao: string[]
  dificuldade_tecnica: string[]
  tipo_servico: string[]
  causa_falha: string[]
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardKPIs {
  custo_total: number
  os_abertas: number
  nf_pendentes: number
  os_atrasadas: number
  registros_mes: number
}

export interface CustoMensal {
  mes: string
  custo: number
}

export interface CustoPorEquipamento {
  nome: string
  custo: number
}

export interface CustoPorFilial {
  nome: string
  custo: number
}

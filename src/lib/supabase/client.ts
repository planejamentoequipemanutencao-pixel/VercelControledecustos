import { createBrowserClient } from '@supabase/ssr'

// Cliente PRÓPRIO — leitura e gravação (OS, histórico, configs)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Cliente EMPRESA — somente leitura (fornecedores, lançamentos, unidades)
export function createCompanyClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_COMPANY_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_COMPANY_SUPABASE_ANON_KEY!
  )
}

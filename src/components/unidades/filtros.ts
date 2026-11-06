import type { Servico, TipoUnidade } from '@/types/unidade'

export type Filtros = {
  municipio: string
  tipo: TipoUnidade | 'todos'
  servico: Servico | 'todos'
}

export const FILTROS_VAZIOS: Filtros = { municipio: 'todos', tipo: 'todos', servico: 'todos' }

export function temFiltroAtivo(filtros: Filtros): boolean {
  return filtros.municipio !== 'todos' || filtros.tipo !== 'todos' || filtros.servico !== 'todos'
}

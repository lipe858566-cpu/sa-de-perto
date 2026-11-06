import type { ComOrigem } from '@/types/dados'

export type CampanhaDestaque = {
  id: string
  tema: string
  descricao: string
  publico: string
}

/**
 * Exemplos de TEMA de saúde preventiva, para demonstrar a interface.
 *
 * Não são campanhas vigentes. Não têm período, meta, órgão responsável nem
 * qualquer dado institucional — inventar isso seria falsear informação de
 * saúde pública. Campanha real só entra com fonte oficial verificável
 * (ver docs/apis.md §6).
 */
export const CAMPANHAS_DESTAQUE: ComOrigem<CampanhaDestaque>[] = [
  {
    id: 'vacinacao',
    tema: 'Vacinação em dia',
    descricao:
      'Conferir a caderneta e completar as doses atrasadas é a forma mais simples de prevenir doença grave.',
    publico: 'Todas as idades',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'pressao',
    tema: 'Medir a pressão',
    descricao:
      'Pressão alta não costuma dar sintoma. A medição periódica na unidade de saúde é gratuita e rápida.',
    publico: 'Pessoas adultas',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'saude-bucal',
    tema: 'Saúde bucal',
    descricao:
      'Avaliação odontológica regular evita tratamento mais longo e doloroso depois.',
    publico: 'Todas as idades',
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
]

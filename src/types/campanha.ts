import type { ComOrigem } from './dados'

export type PublicoAlvo =
  | 'todas-idades'
  | 'criancas'
  | 'adolescentes'
  | 'adultos'
  | 'gestantes'
  | 'idosos'

export const ROTULO_PUBLICO: Record<PublicoAlvo, string> = {
  'todas-idades': 'Todas as idades',
  criancas: 'Crianças',
  adolescentes: 'Adolescentes',
  adultos: 'Pessoas adultas',
  gestantes: 'Gestantes',
  idosos: 'Pessoas idosas',
}

type CampanhaBase = {
  id: string
  tema: string
  resumo: string
  /** Por que o tema importa. Texto informativo, nunca prescrição clínica. */
  porQueImporta: string
  /** O que a pessoa pode fazer. Ações concretas e verificáveis. */
  oQueFazer: string[]
  publico: PublicoAlvo
  /** Onde procurar. Sempre aponta para serviço real e genérico, nunca inventado. */
  ondeProcurar: string
}

export type Campanha = ComOrigem<CampanhaBase>

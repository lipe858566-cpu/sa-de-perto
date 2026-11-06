import type { ComOrigem } from './dados'

export type TipoUnidade =
  | 'ubs'
  | 'upa'
  | 'hospital'
  | 'caps'
  | 'policlinica'
  | 'odontologia'

export const ROTULO_TIPO: Record<TipoUnidade, string> = {
  ubs: 'Unidade Básica de Saúde',
  upa: 'Unidade de Pronto Atendimento',
  hospital: 'Hospital',
  caps: 'Centro de Atenção Psicossocial',
  policlinica: 'Policlínica',
  odontologia: 'Centro de odontologia',
}

export type Servico =
  | 'clinica-geral'
  | 'vacinacao'
  | 'odontologia'
  | 'saude-mental'
  | 'pediatria'
  | 'pre-natal'
  | 'curativo'
  | 'urgencia'

export const ROTULO_SERVICO: Record<Servico, string> = {
  'clinica-geral': 'Clínica geral',
  vacinacao: 'Vacinação',
  odontologia: 'Odontologia',
  'saude-mental': 'Saúde mental',
  pediatria: 'Pediatria',
  'pre-natal': 'Pré-natal',
  curativo: 'Curativo',
  urgencia: 'Urgência',
}

type UnidadeBase = {
  id: string
  nome: string
  tipo: TipoUnidade
  servicos: Servico[]
  /** Campos abaixo podem faltar na fonte. `null` significa "não informado". */
  endereco: string | null
  bairro: string | null
  municipio: string
  uf: string
  telefone: string | null
  horario: string | null
  coordenadas: { lat: number; lon: number } | null
}

export type Unidade = ComOrigem<UnidadeBase>

import type { TipoAtendimento } from '@/schemas/agendamento'

export type Solicitacao = {
  /** Protocolo SIMULADO. Não tem validade em nenhum serviço de saúde. */
  protocolo: string
  nome: string
  contato: string
  unidadeId: string
  unidadeNome: string
  tipoAtendimento: TipoAtendimento
  dataPreferida: string
  periodo: 'manha' | 'tarde'
  observacao: string
  /** Momento do envio, em ISO 8601. */
  criadaEm: string
}

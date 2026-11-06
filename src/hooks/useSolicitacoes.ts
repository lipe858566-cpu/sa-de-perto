import { useSyncExternalStore } from 'react'

import { assinarSolicitacoes, lerSolicitacoes } from '@/services/solicitacoes'

/** Lê as solicitações da sessão, reagindo a novos envios (RF13). */
export function useSolicitacoes() {
  return useSyncExternalStore(assinarSolicitacoes, lerSolicitacoes, lerSolicitacoes)
}

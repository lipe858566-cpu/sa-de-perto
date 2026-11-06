import { useCallback, useState } from 'react'

import { buscarLocal } from '@/services/geocodificacao'
import { buscarUnidadesPorArea } from '@/services/unidades'
import type { ErroApp } from '@/services/erros'
import type { Unidade } from '@/types/unidade'

export type EstadoBusca =
  | { situacao: 'inicial' }
  | { situacao: 'carregando'; etapa: 'local' | 'unidades' }
  | { situacao: 'erro'; erro: ErroApp }
  | {
      situacao: 'pronto'
      unidades: Unidade[]
      local: string
      /** `true` quando a API falhou e os dados vieram do conjunto demonstrativo. */
      usouFallback: boolean
    }

/**
 * Orquestra a busca de unidades: geocodifica o termo, depois consulta a área.
 *
 * Mantém os três estados exigidos por RF14 e nunca lança — toda falha vira
 * `situacao: 'erro'` ou degrada para dados demonstrativos (RNF11).
 */
export function useBuscaUnidades() {
  const [estado, setEstado] = useState<EstadoBusca>({ situacao: 'inicial' })

  const buscar = useCallback(async (termo: string) => {
    const consulta = termo.trim()
    if (!consulta) return

    setEstado({ situacao: 'carregando', etapa: 'local' })

    const local = await buscarLocal(consulta)
    if (!local.ok) {
      setEstado({ situacao: 'erro', erro: local.erro })
      return
    }

    const primeiro = local.dados[0]
    if (!primeiro) {
      setEstado({ situacao: 'erro', erro: { tipo: 'nao_encontrado' } })
      return
    }

    setEstado({ situacao: 'carregando', etapa: 'unidades' })

    const resultado = await buscarUnidadesPorArea(primeiro.lat, primeiro.lon)
    if (!resultado.ok) {
      setEstado({ situacao: 'erro', erro: resultado.erro })
      return
    }

    setEstado({
      situacao: 'pronto',
      unidades: resultado.dados.unidades,
      local: primeiro.display_name,
      usouFallback: resultado.dados.usouFallback,
    })
  }, [])

  const limpar = useCallback(() => setEstado({ situacao: 'inicial' }), [])

  return { estado, buscar, limpar }
}

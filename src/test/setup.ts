import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

/**
 * Nenhum teste deve tocar a rede real: serviços públicos de uso justo não
 * existem para rodar nossa suíte, e teste dependente de rede é instável.
 * Qualquer `fetch` não simulado falha com mensagem explícita.
 */
globalThis.fetch = vi.fn(() => {
  throw new Error(
    'Teste tentou acessar a rede. Simule o serviço em vez de chamar fetch de verdade.',
  )
}) as unknown as typeof fetch

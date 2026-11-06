import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'

import { ErroDeRota } from './ErroDeRota'

/**
 * Esta tela existe para substituir a tela de depuração do React Router, que
 * começa com "Unexpected Application Error!" e fala com o desenvolvedor, não
 * com quem está usando o site.
 *
 * A falha mais provável em produção é a aba estar aberta desde antes de uma
 * publicação nova: os pedaços de código com hash antigo somem do servidor.
 */

const recarregar = vi.fn()

function montarComErro(erro: unknown) {
  function Explode(): never {
    throw erro
  }

  const router = createMemoryRouter([
    { path: '/', element: <Explode />, errorElement: <ErroDeRota /> },
  ])

  return render(<RouterProvider router={router} />)
}

beforeEach(() => {
  sessionStorage.clear()
  recarregar.mockClear()
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { ...globalThis.location, reload: recarregar },
  })
  // O React registra no console todo erro capturado por limite de erro.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('ErroDeRota — pedaço de código de uma versão anterior', () => {
  const erroDeImport = new Error(
    'Failed to fetch dynamically imported module: /assets/Campanhas-8DZTvDt7.js',
  )

  it('recarrega uma vez e avisa o que está fazendo', () => {
    montarComErro(erroDeImport)

    expect(recarregar).toHaveBeenCalledTimes(1)
    expect(screen.getByText(/recarregando/i)).toBeInTheDocument()
  })

  it('não recarrega de novo se a recarga anterior não resolveu', () => {
    montarComErro(erroDeImport)
    expect(recarregar).toHaveBeenCalledTimes(1)

    recarregar.mockClear()
    montarComErro(erroDeImport)

    expect(recarregar).not.toHaveBeenCalled()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/erro ao carregar/i)
  })

  it('na segunda falha, não promete que tentar de novo resolve', () => {
    montarComErro(erroDeImport)
    const { container } = montarComErro(erroDeImport)

    expect(container.textContent).toMatch(/recarregada uma vez sem sucesso/i)
  })
})

describe('ErroDeRota — erro comum da aplicação', () => {
  it('não recarrega e não afirma que o site foi atualizado', () => {
    const { container } = montarComErro(new Error('Cannot read properties of undefined'))

    expect(recarregar).not.toHaveBeenCalled()
    expect(container.textContent).toMatch(/algo deu errado ao abrir esta página/i)
    expect(container.textContent).not.toMatch(/o site foi atualizado/i)
  })

  it('nunca mostra a tela de depuração do React Router', () => {
    const { container } = montarComErro(new Error('Cannot read properties of undefined'))

    expect(container.textContent).not.toMatch(/unexpected application error/i)
    expect(container.textContent).not.toMatch(/hey developer/i)
    expect(container.textContent).not.toMatch(/errorElement/i)
  })

  it('oferece saída: botão de tentar de novo e links para as seções', () => {
    montarComErro(new Error('qualquer falha'))

    screen.getByRole('button', { name: /tentar de novo/i }).click()
    expect(recarregar).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('link', { name: /unidades/i })).toBeInTheDocument()
  })

  it('anuncia o erro a leitor de tela e dá um título de página próprio', () => {
    montarComErro(new Error('qualquer falha'))

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(document.title).toMatch(/erro ao carregar a página/i)
  })
})

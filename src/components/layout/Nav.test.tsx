import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizar } from '@/test/utils'

import { Nav } from './Nav'

function botaoMenu() {
  return screen.getByRole('button', { name: /menu/i })
}

describe('Nav — navegação responsiva (RF15)', () => {
  it('começa com o menu recolhido', () => {
    renderizar(<Nav />)
    expect(botaoMenu()).toHaveAttribute('aria-expanded', 'false')
  })

  it('aponta para a lista que controla', () => {
    renderizar(<Nav />)
    expect(botaoMenu()).toHaveAttribute('aria-controls', 'menu-principal')
    expect(document.getElementById('menu-principal')).toBeInTheDocument()
  })

  it('abre ao ser acionado e move o foco para o primeiro link', async () => {
    const user = userEvent.setup()
    renderizar(<Nav />)
    await user.click(botaoMenu())

    expect(botaoMenu()).toHaveAttribute('aria-expanded', 'true')
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Início' })).toHaveFocus()
    })
  })

  it('fecha com Esc e devolve o foco ao botão', async () => {
    const user = userEvent.setup()
    renderizar(<Nav />)
    await user.click(botaoMenu())
    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(botaoMenu()).toHaveAttribute('aria-expanded', 'false')
      expect(botaoMenu()).toHaveFocus()
    })
  })

  it('marca a página atual com aria-current', () => {
    renderizar(<Nav />, '/campanhas')
    expect(screen.getByRole('link', { name: 'Campanhas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('link', { name: 'Início' })).not.toHaveAttribute('aria-current')
  })

  it('identifica a navegação para leitores de tela', () => {
    renderizar(<Nav />)
    expect(screen.getByRole('navigation', { name: /navegação principal/i })).toBeInTheDocument()
  })
})

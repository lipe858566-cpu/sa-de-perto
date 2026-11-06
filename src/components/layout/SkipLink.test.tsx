import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderizar } from '@/test/utils'

import { SkipLink } from './SkipLink'

describe('SkipLink (RF15)', () => {
  it('aponta para o conteúdo principal', () => {
    renderizar(<SkipLink />)
    expect(screen.getByRole('link', { name: /pular para o conteúdo/i })).toHaveAttribute(
      'href',
      '#conteudo',
    )
  })

  it('é alcançável pelo teclado na primeira tabulação', async () => {
    const user = userEvent.setup()
    renderizar(<SkipLink />)
    await user.tab()
    expect(screen.getByRole('link', { name: /pular para o conteúdo/i })).toHaveFocus()
  })
})

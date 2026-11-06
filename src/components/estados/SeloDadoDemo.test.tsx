import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'

import { SeloDadoDemo } from './SeloDadoDemo'

/**
 * O selo é o que materializa a decisão D7 na tela. Se ele sumir, dado
 * inventado passa a parecer informação real de saúde.
 */
describe('SeloDadoDemo (D7)', () => {
  it('avisa que o dado é demonstrativo e não corresponde a serviço real', () => {
    const { container } = render(<SeloDadoDemo origem="demonstrativo" />)
    expect(screen.getByText(/exemplo:/i)).toBeInTheDocument()
    expect(container.textContent).toMatch(/não corresponde a um serviço real/i)
  })

  it('para dado do OpenStreetMap, diz que não é cadastro oficial do SUS', () => {
    const { container } = render(<SeloDadoDemo origem="openstreetmap" />)
    expect(container.textContent).toMatch(/não é cadastro oficial do sus/i)
  })

  it('não exibe selo para conteúdo editorial, cuja fonte é citada no texto', () => {
    const { container } = render(<SeloDadoDemo origem="editorial" />)
    expect(container).toBeEmptyDOMElement()
  })
})

import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

/** Renderiza com o roteador, que quase todo componente do projeto exige. */
export function renderizar(ui: ReactElement, rota = '/') {
  return render(<MemoryRouter initialEntries={[rota]}>{ui}</MemoryRouter>)
}

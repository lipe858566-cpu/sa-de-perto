import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { limparSolicitacoes } from '@/services/solicitacoes'
import { renderizar } from '@/test/utils'

import { Agendamento } from './Agendamento'

function enviar() {
  return screen.getByRole('button', { name: /enviar solicitação de demonstração/i })
}

describe('Agendamento — aviso e coleta mínima (RF10)', () => {
  it('avisa antes do primeiro campo que não marca consulta', () => {
    const { container } = renderizar(<Agendamento />)
    const aviso = screen.getByText(/isto não marca consulta de verdade/i)
    const primeiroCampo = screen.getByLabelText(/como podemos chamar você/i)

    // compareDocumentPosition: o aviso precisa vir ANTES do campo no documento.
    const posicao = aviso.compareDocumentPosition(primeiroCampo)
    expect(posicao & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(container.textContent).toMatch(/nada é enviado/i)
  })

  it('não pede nenhum dado clínico nem documento pessoal', () => {
    const { container } = renderizar(<Agendamento />)
    const texto = container.textContent?.toLowerCase() ?? ''
    for (const proibido of ['cpf', 'cartão sus', 'cartao sus', 'sintoma', 'diagnóstico']) {
      // "sintomas" aparece só no aviso para NÃO escrever sintomas; por isso a
      // checagem é por rótulo de campo, não por ocorrência no texto.
      expect(screen.queryByLabelText(new RegExp(proibido, 'i'))).toBeNull()
    }
    expect(texto).not.toContain('data de nascimento')
  })
})

describe('Agendamento — validação acessível (RF11)', () => {
  it('mostra erro em cada campo obrigatório vazio', async () => {
    const user = userEvent.setup()
    renderizar(<Agendamento />)
    await user.click(enviar())

    await waitFor(() => {
      expect(screen.getByText(/informe como podemos chamar você/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/informe um telefone ou e-mail/i)).toBeInTheDocument()
    expect(screen.getByText(/escolha a unidade/i)).toBeInTheDocument()
    expect(screen.getByText(/escolha manhã ou tarde/i)).toBeInTheDocument()
  })

  /**
   * REGRESSÃO de um defeito real (Fase 6): o `shouldFocusError` do
   * react-hook-form levava o foco ao ÚLTIMO campo inválido, não ao primeiro.
   * Não dava para ver na tela, porque foco programático após clique de mouse
   * não aciona `:focus-visible`.
   */
  it('move o foco para o PRIMEIRO campo inválido, na ordem visual', async () => {
    const user = userEvent.setup()
    renderizar(<Agendamento />)
    await user.click(enviar())

    await waitFor(() => {
      expect(screen.getByLabelText(/como podemos chamar você/i)).toHaveFocus()
    })
  })

  it('liga o erro ao campo por aria-describedby e marca aria-invalid', async () => {
    const user = userEvent.setup()
    renderizar(<Agendamento />)
    await user.click(enviar())

    const campo = await screen.findByLabelText(/como podemos chamar você/i)
    await waitFor(() => expect(campo).toHaveAttribute('aria-invalid', 'true'))

    const descritoPor = campo.getAttribute('aria-describedby') ?? ''
    expect(descritoPor).toContain('nome-erro')

    const erro = document.getElementById('nome-erro')
    expect(erro).toBeInTheDocument()
    expect(erro?.textContent).toMatch(/informe como podemos chamar você/i)
  })

  it('não comunica o erro apenas pela cor: há texto para cada campo inválido', async () => {
    const user = userEvent.setup()
    renderizar(<Agendamento />)
    await user.click(enviar())

    await waitFor(() => {
      const invalidos = document.querySelectorAll('[aria-invalid="true"]')
      expect(invalidos.length).toBeGreaterThan(0)
      for (const campo of invalidos) {
        const ids = (campo.getAttribute('aria-describedby') ?? '').split(' ')
        const temErro = ids.some((id) => id.endsWith('-erro') && document.getElementById(id))
        expect(temErro).toBe(true)
      }
    })
  })
})

describe('Agendamento — envio válido (RF12)', () => {
  it('leva à confirmação que declara que nada foi agendado', async () => {
    limparSolicitacoes()
    const user = userEvent.setup()
    renderizar(<Agendamento />)

    await user.type(screen.getByLabelText(/como podemos chamar você/i), 'Maria')
    await user.type(screen.getByLabelText(/telefone ou e-mail/i), 'maria@exemplo.com')
    await user.selectOptions(screen.getByLabelText(/^unidade/i), 'demo-1')
    await user.selectOptions(screen.getByLabelText(/tipo de atendimento/i), 'vacinacao')
    await user.type(screen.getByLabelText(/data de preferência/i), '2099-01-01')
    await user.click(screen.getByRole('radio', { name: /manhã/i }))
    await user.click(enviar())

    const titulo = await screen.findByRole('heading', {
      level: 1,
      name: /nenhuma consulta foi agendada/i,
    })
    expect(titulo).toBeInTheDocument()
  })
})

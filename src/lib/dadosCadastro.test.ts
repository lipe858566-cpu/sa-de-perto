import { describe, expect, it } from 'vitest'
import { dataNascimentoValida, formatarTelefone, telefoneValido } from './dadosCadastro'

describe('Dados do cadastro', () => {
  it('formata o celular com DDD', () => {
    expect(formatarTelefone('81987654321')).toBe('(81) 98765-4321')
    expect(formatarTelefone('8132345678')).toBe('(81) 3234-5678')
  })

  it('aceita telefones com 10 ou 11 dígitos', () => {
    expect(telefoneValido('(81) 98765-4321')).toBe(true)
    expect(telefoneValido('(81) 3234-5678')).toBe(true)
    expect(telefoneValido('12345')).toBe(false)
  })

  it('rejeita datas inexistentes e futuras', () => {
    expect(dataNascimentoValida('2000-02-29')).toBe(true)
    expect(dataNascimentoValida('2025-02-29')).toBe(false)
    expect(dataNascimentoValida('2999-01-01')).toBe(false)
    expect(dataNascimentoValida('1899-12-31')).toBe(false)
  })
})

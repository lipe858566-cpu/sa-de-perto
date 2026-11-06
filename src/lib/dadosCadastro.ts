export function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, '')
}

export function formatarTelefone(valor: string) {
  const digitos = somenteNumeros(valor).slice(0, 11)

  if (digitos.length <= 2) return digitos ? `(${digitos}` : ''

  const ddd = digitos.slice(0, 2)
  const numero = digitos.slice(2)

  if (numero.length <= 4) return `(${ddd}) ${numero}`

  const tamanhoPrefixo = numero.length > 8 ? 5 : 4
  return `(${ddd}) ${numero.slice(0, tamanhoPrefixo)}-${numero.slice(tamanhoPrefixo)}`
}

export function telefoneValido(valor: string) {
  const digitos = somenteNumeros(valor)
  return digitos.length === 10 || digitos.length === 11
}

export function dataNascimentoValida(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false

  const ano = Number(valor.slice(0, 4))
  const mes = Number(valor.slice(5, 7))
  const dia = Number(valor.slice(8, 10))
  const data = new Date(Date.UTC(ano, mes - 1, dia))
  const hoje = new Date()
  const dataAtual = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())

  return (
    ano >= 1900 &&
    data.getUTCFullYear() === ano &&
    data.getUTCMonth() === mes - 1 &&
    data.getUTCDate() === dia &&
    data.getTime() <= dataAtual
  )
}

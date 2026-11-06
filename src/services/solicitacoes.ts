import type { Solicitacao } from '@/types/solicitacao'

/**
 * Solicitações criadas nesta sessão (RF13).
 *
 * **Só em memória, de propósito** (decisão D15). O formulário coleta nome e
 * contato, que são dados pessoais; guardá-los em `localStorage` deixaria essa
 * informação no dispositivo, legível por qualquer outra pessoa que o use, sem
 * nenhum ganho real para um projeto acadêmico. Some ao recarregar a página, e
 * a interface declara isso.
 */
let solicitacoes: Solicitacao[] = []
const ouvintes = new Set<() => void>()

function avisar() {
  for (const ouvinte of ouvintes) ouvinte()
}

export function assinarSolicitacoes(ouvinte: () => void): () => void {
  ouvintes.add(ouvinte)
  return () => ouvintes.delete(ouvinte)
}

export function lerSolicitacoes(): Solicitacao[] {
  return solicitacoes
}

/** Protocolo SIMULADO. Não tem validade em nenhum serviço de saúde. */
function geraProtocolo(): string {
  const sufixo = Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, '0')
  return `DEMO-${new Date().getFullYear()}-${sufixo}`
}

export function registrarSolicitacao(dados: Omit<Solicitacao, 'protocolo' | 'criadaEm'>): Solicitacao {
  const nova: Solicitacao = {
    ...dados,
    protocolo: geraProtocolo(),
    criadaEm: new Date().toISOString(),
  }
  solicitacoes = [nova, ...solicitacoes]
  avisar()
  return nova
}

export function limparSolicitacoes() {
  solicitacoes = []
  avisar()
}

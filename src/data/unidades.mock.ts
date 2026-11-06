import type { Unidade } from '@/types/unidade'

/**
 * Unidades FICTÍCIAS, para demonstrar a interface.
 *
 * Nenhuma destas unidades existe. Os nomes usam logradouros genéricos e os
 * endereços são inventados de propósito — não correspondem a nenhum
 * estabelecimento real, e não devem ser usados para procurar atendimento.
 *
 * Toda entrada carrega `origem: 'demonstrativo'`, o que obriga a interface a
 * exibir <SeloDadoDemo /> (decisão D7).
 *
 * Alguns campos estão propositalmente em `null` para exercitar o caminho de
 * "não informado" exigido por RF03.
 */
export const UNIDADES_DEMO: Unidade[] = [
  {
    id: 'demo-1',
    nome: 'UBS Exemplo — Vila das Flores',
    tipo: 'ubs',
    servicos: ['clinica-geral', 'vacinacao', 'pre-natal', 'curativo'],
    endereco: 'Rua Fictícia das Flores, 100',
    bairro: 'Vila das Flores',
    municipio: 'Recife',
    uf: 'PE',
    telefone: null,
    horario: 'Segunda a sexta, 7h às 17h',
    coordenadas: { lat: -8.0578, lon: -34.8829 },
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'demo-2',
    nome: 'UPA Exemplo — Centro',
    tipo: 'upa',
    servicos: ['urgencia', 'clinica-geral', 'pediatria'],
    endereco: 'Avenida Fictícia Central, 2000',
    bairro: 'Centro',
    municipio: 'Recife',
    uf: 'PE',
    telefone: null,
    horario: 'Todos os dias, 24 horas',
    coordenadas: { lat: -8.0631, lon: -34.8711 },
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'demo-3',
    nome: 'CAPS Exemplo — Boa Esperança',
    tipo: 'caps',
    servicos: ['saude-mental'],
    endereco: 'Rua Fictícia da Esperança, 45',
    bairro: 'Boa Esperança',
    municipio: 'Recife',
    uf: 'PE',
    telefone: null,
    horario: 'Segunda a sexta, 8h às 17h',
    coordenadas: { lat: -8.0489, lon: -34.9012 },
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'demo-4',
    nome: 'UBS Exemplo — Alto do Morro',
    tipo: 'ubs',
    servicos: ['clinica-geral', 'vacinacao', 'odontologia'],
    endereco: null,
    bairro: 'Alto do Morro',
    municipio: 'Olinda',
    uf: 'PE',
    telefone: null,
    horario: null,
    coordenadas: null,
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'demo-5',
    nome: 'Policlínica Exemplo — Jardim Norte',
    tipo: 'policlinica',
    servicos: ['clinica-geral', 'pediatria', 'odontologia', 'saude-mental'],
    endereco: 'Rua Fictícia do Jardim, 780',
    bairro: 'Jardim Norte',
    municipio: 'Jaboatão dos Guararapes',
    uf: 'PE',
    telefone: null,
    horario: 'Segunda a sexta, 7h às 19h',
    coordenadas: { lat: -8.1122, lon: -35.0149 },
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
  {
    id: 'demo-6',
    nome: 'Centro de Odontologia Exemplo',
    tipo: 'odontologia',
    servicos: ['odontologia'],
    endereco: 'Travessa Fictícia do Sorriso, 12',
    bairro: 'Centro',
    municipio: 'Olinda',
    uf: 'PE',
    telefone: null,
    horario: 'Segunda a quinta, 8h às 16h',
    coordenadas: { lat: -8.0089, lon: -34.8553 },
    origem: 'demonstrativo',
    obtidoEm: '2026-10-23',
  },
]

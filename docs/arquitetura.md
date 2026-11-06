# Arquitetura — Saúde Perto

Camadas, fluxo de dados, convenções e padrões de código.

**Última atualização:** 2026-10-23
**Estado:** o scaffold existe e foi validado em execução (build, lint e dev). A estrutura de camadas descrita em §3 e §4 segue **planejada**: apenas `src/lib/`, `src/components/ui/` e os arquivos de entrada existem. Estado real confirmado em `docs/PROJECT_MEMORY.md` §D.

Referências cruzadas: stack em `CLAUDE.md` §3 · decisões em `docs/PROJECT_MEMORY.md` §C · requisitos em `docs/requisitos.md` · APIs em `docs/apis.md`.

---

## 1. Visão geral

Aplicação **client-side pura**: um SPA React servido como arquivos estáticos. Não há backend, servidor de aplicação ou banco de dados. Toda a lógica roda no navegador da pessoa.

```
Navegador
  ├── React SPA (roteamento client-side)
  │     ├── Páginas  ──consomem──>  Hooks  ──consomem──>  Serviços
  │     └── Componentes (apresentação)
  │
  └── Serviços  ──HTTP──>  APIs públicas externas
                            ├── Nominatim (geocodificação)
                            ├── Overpass API (unidades de saúde)
                            └── Tiles OpenStreetMap (mapa)
                          Falha ──> dados demonstrativos locais (rotulados)
```

**Implicações dessa escolha:**
- Nenhum segredo pode existir na aplicação: todo o código é público.
- Qualquer API consumida precisa ter **CORS liberado** — por isso a verificação de CORS em `docs/apis.md` é obrigatória antes de adotar uma fonte.
- Hospedagem em host estático exige tratar a recarga de URL profunda (ver `docs/deploy.md`).

## 2. Stack e justificativas

Versões candidatas e licenças: `README.md` §Tecnologias. Decisões completas com alternativas descartadas: `docs/PROJECT_MEMORY.md` §C (D1–D8).

Resumo das escolhas estruturais:

| Decisão | Resumo |
|---|---|
| **D1** Vite + React + TS | Build simples, adequado a host estático. Next.js descartado. |
| **D2** Tailwind 4 via plugin do Vite | Método oficial atual; sem `tailwind.config.js`. |
| **D3** shadcn/ui sobre Radix | Acessibilidade de origem — decisão motivada por RNF02/RNF03. |
| **D4** `motion`, não GSAP | MIT e React-first; GSAP tem licença proprietária e é redundante. |
| **D5** Leaflet + React Leaflet | Sem chave de API, compatível com a restrição de "nenhum segredo". |
| **D6** OpenStreetMap como fonte de unidades | A API oficial do Ministério da Saúde está inacessível. |
| **D7** Dado real vs. demonstrativo modelado no tipo | Honestidade da informação de saúde. |
| **D8** Sem estado global | O MVP não justifica. Reavaliar TanStack Query na Fase 5. |
| **D10** `oxlint` em vez de ESLint | O template do Vite deixou de gerar ESLint; `oxlint` tem plugin `jsx-a11y`. |
| **D11** shadcn base `radix`, preset `nova` | Coerente com D3 (acessibilidade de origem). A fonte Geist é herança do preset. |
| **D12** `strict` manual, alias sem `baseUrl` | O template não traz `strict`; o TS 6 deprecou `baseUrl`. |
| **D13** Direção visual "cartilha de saúde pública" | Específica do assunto e funcionalmente certa para o público (§10). |
| **D14** `createBrowserRouter`, decisão de host adiada | URLs limpas em desenvolvimento; a escolha para host estático fica na Fase 8. |

> ⚠️ **Tailwind 4 não usa `tailwind.config.js`.** Configuração de tema vai em `@theme` dentro do CSS. Tutoriais de Tailwind 3 encontrados na web **não se aplicam** a este projeto.
>
> ⚠️ **O linter é `oxlint`, não ESLint** (D10). Configuração em `.oxlintrc.json`, com o plugin `jsx-a11y` habilitado.
>
> ⚠️ **Não reintroduzir `baseUrl` nos tsconfig** (D12). O TypeScript 6 o deprecou e o build falha com `TS5101`. O alias `@/*` funciona apenas com `paths`.

## 3. Estrutura de pastas

> Esta é a estrutura **planejada**. Confirme com `ls` antes de tratá-la como existente. Estado real: `docs/PROJECT_MEMORY.md` §D.

```
src/
├── main.tsx                  ponto de entrada
├── App.tsx                   composição de rotas
├── index.css                 @import "tailwindcss" + tokens de tema
│
├── components/
│   ├── ui/                   primitivos do shadcn/ui (gerados pela CLI)
│   ├── layout/               Header, Nav, Footer, SkipLink
│   ├── unidades/             UnidadeCard, UnidadeFiltros, UnidadeLista
│   ├── campanhas/            CampanhaCard, CampanhaLista
│   ├── mapa/                 MapaUnidades, MarcadorUnidade
│   ├── formulario/           campos compostos e controlados
│   └── estados/              Carregando, Erro, Vazio, SeloDadoDemo
│
├── pages/
│   ├── Inicio.tsx            RF01
│   ├── Unidades.tsx          RF02, RF03, RF04, RF06
│   ├── UnidadeDetalhe.tsx    RF05
│   ├── Campanhas.tsx         RF07
│   ├── PrimeirosSocorros.tsx RF08
│   ├── SaudeMental.tsx       RF09
│   ├── Agendamento.tsx       RF10, RF11, RF12
│   ├── MinhasSolicitacoes.tsx RF13
│   ├── Sobre.tsx             RF16
│   ├── Privacidade.tsx       RF16
│   ├── Acessibilidade.tsx    RF16
│   └── NaoEncontrado.tsx     RF16
│
├── layouts/
│   └── LayoutPrincipal.tsx   casca comum a todas as rotas
│
├── services/                 ÚNICA camada que faz rede
│   ├── http.ts               wrapper de fetch: timeout, erro tipado
│   ├── geocodificacao.ts     Nominatim
│   ├── unidades.ts           Overpass + fallback demonstrativo
│   └── erros.ts              tipos de erro de aplicação
│
├── hooks/
│   ├── useUnidades.ts        busca, filtro, estados de carregamento/erro
│   ├── useGeocodificacao.ts
│   └── useSolicitacoes.ts    RF13
│
├── schemas/                  esquemas Zod
│   ├── agendamento.ts        validação do formulário (RF11)
│   ├── unidade.ts            validação da resposta da Overpass
│   └── nominatim.ts          validação da resposta do Nominatim
│
├── types/
│   ├── unidade.ts
│   ├── campanha.ts
│   ├── solicitacao.ts
│   └── dados.ts              OrigemDado e tipos utilitários
│
├── data/                     dados demonstrativos — SEMPRE rotulados
│   ├── unidades.mock.ts
│   ├── campanhas.mock.ts
│   ├── primeiros-socorros.ts
│   └── saude-mental.ts
│
├── lib/
│   ├── formatacao.ts         funções puras
│   └── distancia.ts
│
└── test/
    ├── setup.ts
    └── utils.tsx             render com providers
```

## 4. Camadas e regras de dependência

```
pages  ──>  hooks  ──>  services  ──>  rede
  │           │            │
  └──> components          └──> schemas (validação na fronteira)
         │
         └──> lib, types
```

**Regras invioláveis:**

1. **`services/` é a única camada que faz rede.** Nenhum `fetch` em componente, página ou hook de UI. Isso mantém a lógica de integração testável e substituível, e é condição para simular rede nos testes (RNF10).
2. **Serviços não conhecem React.** São funções assíncronas puras, sem hooks, sem JSX.
3. **Hooks adaptam serviços para a UI.** Eles detêm o estado de carregamento, erro e vazio.
4. **Componentes de apresentação não buscam dados.** Recebem por props.
5. **Dependência flui para baixo.** Um serviço nunca importa de `hooks/`, `pages/` ou `components/`.
6. **Validação acontece na fronteira.** Toda resposta externa passa por um esquema Zod em `schemas/` antes de virar tipo de domínio. Nada de API externa entra tipado por confiança.

## 5. Fluxo de dados: busca de unidades

```
1. Pessoa submete "Recife, PE"
2. pages/Unidades  ──>  hooks/useUnidades
3. hooks           ──>  services/geocodificacao.buscarLocal()
                           └─> Nominatim  ─> validação Zod ─> { lat, lon }
4. hooks           ──>  services/unidades.buscarPorArea(lat, lon)
                           └─> Overpass   ─> validação Zod ─> Unidade[]
5. Se a Overpass falhar (timeout, 502, resposta inválida):
       └─> services retorna dados de data/unidades.mock.ts
             com origem = "demonstrativo"
6. hooks expõe { unidades, carregando, erro, origem }
7. pages renderiza lista + mapa, e SeloDadoDemo quando origem = demonstrativo
```

O passo 5 é o que materializa RNF11: a aplicação degrada com informação honesta, não quebra nem mente sobre a procedência.

## 6. Separação entre dado real e demonstrativo (D7)

Todo dado que chega à interface carrega sua procedência no próprio tipo:

```ts
// types/dados.ts
export type OrigemDado = 'openstreetmap' | 'demonstrativo' | 'editorial';

export type ComOrigem<T> = T & {
  origem: OrigemDado;
  /** Data de obtenção ou de redação do dado, em ISO 8601. */
  obtidoEm: string;
};
```

**Consequências obrigatórias:**
- Nenhuma função retorna dado sem `origem`. Não há valor padrão — o campo é sempre explícito.
- `origem: 'demonstrativo'` **exige** que a interface renderize `SeloDadoDemo` de forma visível.
- Dados em `src/data/` são fictícios e evidentemente não reais. **Nenhum dado real de paciente, em nenhuma circunstância** (RNF08).
- `origem: 'editorial'` identifica conteúdo redigido a partir de fonte oficial citada — usado em RF07, RF08 e RF09.

## 7. Convenções de código

| Elemento | Convenção | Exemplo |
|---|---|---|
| Componente | `PascalCase.tsx` | `UnidadeCard.tsx` |
| Página | `PascalCase.tsx` em `pages/` | `Unidades.tsx` |
| Hook | `useCamelCase.ts` | `useUnidades.ts` |
| Serviço | `camelCase.ts`, exportando funções nomeadas | `unidades.ts` |
| Tipo / interface | `PascalCase` | `Unidade`, `OrigemDado` |
| Esquema Zod | `camelCaseSchema` | `agendamentoSchema` |
| Mock | `nome.mock.ts` | `unidades.mock.ts` |
| Teste | `nome.test.ts(x)`, ao lado do alvo | `UnidadeCard.test.tsx` |
| Constante | `SCREAMING_SNAKE_CASE` | `TIMEOUT_PADRAO_MS` |

**Idioma:** nomes de domínio em português (`Unidade`, `Campanha`, `Solicitacao`), termos técnicos consagrados em inglês (`props`, `hook`, `fetch`, `schema`). Interface e mensagens de erro ao usuário sempre em português.

**TypeScript:**
- `strict` habilitado. `any` implícito proibido.
- `any` explícito só com comentário justificando; prefira `unknown` + validação.
- Props de componente declaradas como `type`, não `interface`, salvo necessidade de extensão.
- Importações internas pelo alias `@/`, nunca por caminho relativo longo (`../../../`).

**React:**
- Apenas componentes de função.
- Um componente exportado por arquivo (mais o que for auxiliar e privado).
- Efeitos com dependências completas e corretas; sem desabilitar a regra do linter sem justificativa em comentário.
- Listas sempre com `key` estável de identidade, nunca o índice do array.

## 8. Padrões de tratamento de erro

`services/http.ts` centraliza as chamadas e normaliza falhas em um tipo discriminado, para que a UI nunca precise inspecionar objetos de erro brutos:

```ts
export type ResultadoRede<T> =
  | { ok: true; dados: T }
  | { ok: false; erro: ErroApp };

export type ErroApp =
  | { tipo: 'rede' }            // offline, DNS, conexão recusada
  | { tipo: 'timeout' }
  | { tipo: 'indisponivel' }    // 5xx, serviço sobrecarregado (Overpass 502)
  | { tipo: 'limite' }          // 429, política de uso justo
  | { tipo: 'formato' }         // resposta não passou na validação Zod
  | { tipo: 'nao_encontrado' };
```

Regras:
- Todo `fetch` tem timeout explícito via `AbortSignal.timeout`.
- Nenhum `throw` atravessa a fronteira do serviço: a falha é retornada como valor.
- A UI traduz cada `tipo` em mensagem compreensível em português, **sem** stack trace nem jargão.
- Onde o provedor recomenda (Overpass), há retentativa com backoff exponencial antes de desistir.

## 9. Padrões de acessibilidade

Decorrem de RNF02–RNF04 e orientam toda implementação:

1. **Semântica primeiro.** Elemento nativo antes de ARIA. `<button>` para ação, `<a>` para navegação — nunca `<div onClick>`.
2. **Primitivos do shadcn/ui** para tudo que seja interativo e composto (diálogo, seleção, menu). Não reimplementar gestão de foco à mão.
3. **Formulários:** `<label for>` sempre; erro ligado por `aria-describedby`; `aria-invalid` no campo inválido; foco move para o primeiro erro no submit.
4. **Conteúdo dinâmico:** mudanças assíncronas anunciadas por região live (`role="status"` para confirmação, `role="alert"` para erro).
5. **Foco:** nunca remover o contorno sem substituto de contraste ≥ 3:1. Diálogo devolve o foco ao acionador.
6. **Movimento:** respeitar `prefers-reduced-motion`. Nenhuma animação essencial à compreensão.
7. **O mapa não é o único caminho** para a informação: a lista de unidades é equivalente textual (RF06).

## 10. Design system

Definido na Fase 3 (2026-10-23). Tokens em `src/index.css`, consumidos pelo shadcn/ui via `components.json`.

### Conceito

**A cartilha impressa de saúde pública.** A comunicação de saúde pública brasileira tem uma tradição visual própria: a cartilha, o cartaz de campanha, a placa esmaltada do posto. Blocos de cor chapada, tipografia grande e direta, contraste alto, informação legível a distância.

Essa referência foi escolhida porque é ao mesmo tempo **específica do assunto** e **funcionalmente correta** para o público: pessoas idosas, com baixa visão e com pouca familiaridade digital. O que torna o visual distintivo é o mesmo que o torna acessível.

### Cor

Seis valores base, com as razões de contraste **medidas**, não estimadas:

| Token | Hex | Papel |
|---|---|---|
| `--papel` | `#FAF8F3` | Fundo. O papel de uma cartilha. |
| `--papel-2` | `#F0EDE4` | Fundo de faixa alternada. |
| `--tinta` | `#15231D` | Texto. Tinta de impressão, com fundo esverdeado. |
| `--verde-posto` | `#0F5D4A` | Primária. O esmalte verde da placa de posto de saúde. |
| `--azul-cartilha` | `#1B4D8F` | Links. O azul do impresso informativo. |
| `--amarelo-campanha` | `#F2B705` | Destaque e atenção. O cartaz de campanha. |

Derivados: `--tinta-suave` `#4A5A52`, `--verde-claro` `#DCEAE2`, `--vermelho-urgencia` `#B3261E`.

### Contraste medido (2026-10-23)

Mínimos de RNF04: 4,5:1 para texto normal, 3:1 para texto grande e componentes.

| Par | Razão | Texto normal | Grande / componente |
|---|---|---|---|
| tinta sobre papel | **15,34** | passa | passa |
| tinta sobre papel-2 | **13,91** | passa | passa |
| tinta sobre verde-claro | **13,11** | passa | passa |
| tinta sobre amarelo | **8,95** | passa | passa |
| branco sobre verde-posto | **7,82** | passa | passa |
| azul-cartilha sobre papel | **7,90** | passa | passa |
| verde-posto sobre papel | **7,37** | passa | passa |
| papel sobre verde-posto | **7,37** | passa | passa |
| tinta-suave sobre papel | **6,88** | passa | passa |
| verde-posto sobre papel-2 | **6,68** | passa | passa |
| verde-posto sobre verde-claro | **6,30** | passa | passa |
| vermelho-urgencia sobre papel | **6,16** | passa | passa |
| **amarelo sobre verde-posto** | **4,30** | **FALHA** | passa |

> ⚠️ **Restrição vinculante:** `--amarelo-campanha` sobre `--verde-posto` fica **abaixo** de 4,5:1. Esse par só pode ser usado em **texto grande** (≥ 24 px, ou ≥ 19 px em negrito) e em **componentes não textuais** — borda, ícone, preenchimento de botão. Nunca em texto corrido. É por isso que, no cabeçalho, o item de navegação ativo em amarelo aparece em peso médio e tamanho de interface, e que a borda inferior carrega a indicação junto com a cor.

O cálculo está em `/tmp/.../scratchpad/contraste.py` (descartável). Qualquer alteração na paleta **precisa** refazer essa medição antes de entrar.

### Tipografia

**Archivo Variable** (`@fontsource-variable/archivo`, 5.3.0), uma única família em dois papéis: títulos em 600–700, corpo em 400–500. É um grotesco desenhado para sinalização e impressão, com altura-x grande — legível em corpo pequeno e em tela ruim.

A fonte é servida pelo próprio build, não por CDN externa: evita requisição a terceiros, funciona offline e não vaza navegação do usuário (coerente com RNF08).

**Escala:** corpo base em **18 px** (`font-size: 112.5%` no `html`), acima do comum de 16 px, porque o público inclui pessoas idosas e com baixa visão. Entrelinha 1,6 no corpo e 1,15 em títulos. Medida de linha limitada por `max-w-prose`.

> A fonte **Geist**, que vinha do preset `nova` do shadcn (D11), foi **removida**. Era herança do gerador, não escolha: um grotesco neutro de produto de software, sem relação com o assunto. `@fontsource-variable/geist` foi desinstalado.

### Layout

Faixas horizontais de cor chapada, empilhadas como as páginas de um impresso — **não** uma grade de cartões iguais. Conteúdo **alinhado à esquerda** em toda a aplicação: alinhamento centralizado em blocos de texto longo prejudica quem tem dificuldade de leitura. Centralizado aparece só em estado vazio, que é um bloco curto.

```
┌──────────────────────────────────────────┐
│ cabeçalho — faixa verde-posto            │  logo + navegação
├──────────────────────────────────────────┤
│                                          │
│  Onde tem atendimento                    │  faixa verde, tipo grande,
│  perto de mim?                           │  o momento ousado da página
│                                          │
│  [ Procurar unidades ] [ Ver temas ]     │
├──────────────────────────────────────────┤
│ O que você encontra aqui   (fundo papel) │  lista 2 col, separada por
│  ▸ item      ▸ item                      │  linhas de 1px, sem sombra
├──────────────────────────────────────────┤
│ Temas de prevenção        (fundo papel-2)│  faixa alternada
│  [selo de dado demonstrativo]            │
│  ▬ tema    ▬ tema    ▬ tema              │  borda superior amarela
├──────────────────────────────────────────┤
│ O que este site não faz    (fundo papel) │  os limites, ditos de frente
├──────────────────────────────────────────┤
│ rodapé — papel-2, borda superior 2px     │  emergência + links
└──────────────────────────────────────────┘
```

### Princípios

1. **A legibilidade é a estética.** Corpo em 18 px, medida curta, alinhamento à esquerda. Nada decorativo compete com o texto.
2. **Faixas chapadas, sem sombra e sem gradiente.** A separação entre seções vem de cor e de borda, nunca de elevação. Não há uma única `box-shadow` no projeto.
3. **Raio só onde se clica.** `--radius: 0.375rem` aplica-se a botões, campos e links de ação. Faixas, seções e listas ficam retas. Isso faz o raio carregar informação — ele sinaliza o que é interativo — em vez de ser enfeite uniforme.
4. **Amarelo é atenção; vermelho é emergência.** `--amarelo-campanha` marca campanha, dado demonstrativo e foco. `--vermelho-urgencia` aparece **somente** em erro e emergência, nunca como decoração.
5. **Uma ousadia por página.** Na inicial é a faixa verde com a pergunta em corpo grande. O resto é disciplinado e quieto.
6. **O texto diz a verdade.** Rótulo de ação descreve o que acontece ("Procurar unidades", não "Começar"). Estado vazio orienta. Erro explica o que houve e o que fazer, sem pedir desculpa. Os limites do projeto aparecem na própria página inicial, em seção própria.

### Revisão contra o padrão genérico

A direção foi conferida contra as marcas comuns de interface gerada automaticamente, e cada uma foi evitada deliberadamente:

| Padrão genérico | O que foi feito |
|---|---|
| Fundo creme + serifada de display + acento terracota | Não usado. Papel quase branco, grotesco único, acento verde/amarelo. |
| Preto quase puro + acento verde-limão | Não usado. |
| Grade de cartões idênticos, mesmo raio, mesma sombra cinza | Substituída por faixas chapadas. Zero sombra. Raio só em controles. |
| Lavagens de gradiente como decoração | Nenhum gradiente. |
| Rótulo em CAIXA ALTA espaçada acima de cada título | Nenhum. Títulos em caixa de sentença, sem sobre-rótulo. |
| Cadeias de metadados unidas por ponto do meio (`A · B · C`) | Não usado. |
| `→` colado no texto de botão e link | Não usado. |
| Monoespaçada para rótulos pequenos | Não usado. Uma família só. |
| Marcadores numerados `01 / 02 / 03` em conteúdo que não é sequência | Não usado. |
| Entrada "fade-and-slide-up" em cada seção, transição em todo cartão | Nenhuma animação de entrada. Transição apenas em `hover` de link. |

Uma ressalva honesta sobre o risco que sobra: faixa chapada com tipografia grande pode resvalar em brutalismo genérico. A mitigação foi deliberada — tipo não condensado, caixa de sentença, base de papel quente em vez de branco puro, e as faixas carregando conteúdo real em vez de blocos decorativos.

### Pendente de verificação

A paleta e a escala estão medidas no cálculo, mas **a interface não foi vista**. Não houve inspeção visual, captura de tela, teste com leitor de tela, verificação em 320 px nem ampliação a 200%. Ver `docs/PROJECT_MEMORY.md` §B.

## 11. Pontos a decidir em fases futuras

Registrados aqui para não serem decididos por omissão:

| Questão | Quando decidir | Observação |
|---|---|---|
| Cache de rede manual ou TanStack Query | Fase 5 | Reavaliar D8 se o cache ficar complexo |
| Fonte de dados se Overpass for inviável | Fase 5 | Plano B: extrato CNES embutido (P3) |
| Armazenamento das solicitações simuladas (memória ou `localStorage`) | Fase 6 | `localStorage` exige declarar a limitação na UI (RNF08) |
| Rotas em `BrowserRouter` com fallback 404 ou `HashRouter` | Fase 8 | Depende do comportamento real do GitHub Pages — ver `docs/deploy.md` |
| Instalar `motion` ou ficar só em CSS | Fase 7 | Só instalar se houver necessidade concreta. Até agora, zero animação além de `hover` |
| ~~Manter a fonte Geist do preset~~ | ~~Fase 3~~ | **Resolvido:** substituída por Archivo e desinstalada (§10) |

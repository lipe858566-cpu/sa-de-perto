# PROJECT_MEMORY.md — Memória operacional do Saúde Perto

> **Este é o arquivo principal do segundo cérebro do projeto.**
> Reflete o estado **REAL** do código e do ambiente — nunca apenas o planejado.
> Toda sessão deve ler §B, §G e §I antes de agir, e atualizar §H e §I antes de encerrar.

**Última atualização:** 2026-10-23
**Fase atual:** 8 — **concluída.** Build e preparação para publicação. **As 8 fases do plano estão cumpridas.**
**Versão da aplicação:** 0.0.0 (scaffold; nenhuma funcionalidade implementada)

---

## A. Resumo do projeto

**Nome:** Saúde Perto

**Descrição:** Aplicação web responsiva que reúne informação de saúde preventiva — unidades de saúde próximas, campanhas de prevenção e conteúdo educativo sobre primeiros socorros e saúde mental — com um fluxo demonstrativo de solicitação de agendamento.

**Objetivo:** Entregar um MVP de frontend organizado, acessível (WCAG 2.2 AA), responsivo, testável e pronto para publicação no GitHub, como trabalho da disciplina Front-End Frameworks da UNINASSAU.

**Público-alvo:** Moradores de comunidades urbanas que buscam atendimento na atenção primária e informação preventiva confiável; secundariamente, a banca avaliadora da disciplina.

**Escopo atual:** Frontend apenas. Sem backend, sem autenticação, sem persistência compartilhada, sem agendamento oficial. Agendamento é demonstrativo e rotulado como tal.

---

## B. Estado atual

### Fase de desenvolvimento

**Fase 8 de 8 concluída. O plano original terminou.** O projeto está pronto para publicação, mas **não foi publicado**: o usuário optou por não commitar por enquanto.

### O que está pronto

| Área | Estado |
|---|---|
| 16 requisitos funcionais | ✅ implementados |
| Testes automatizados | ✅ **105 em 14 arquivos**, exit 0 |
| Auditoria de acessibilidade | ✅ medida na tela renderizada, 0 falhas de contraste |
| Roteamento em host estático (D14) | ✅ **resolvido e testado** em simulador do GitHub Pages |
| `base` para subcaminho | ✅ configurável por `VITE_BASE`; `basename` do roteador acompanha |
| Fallback `dist/404.html` | ✅ gerado por `scripts/pos-build.mjs` |
| Varredura de segredos no `dist/` | ✅ limpa |
| `npm run preview` | ✅ verificado |
| Documentação | ✅ 9 arquivos sincronizados |

### Verificação do build para publicação (2026-10-23)

Simulador local reproduzindo o GitHub Pages — subcaminho `/saude-perto/` e `404.html` com status 404 para arquivo inexistente:

| Rota | Status | Renderizou |
|---|---|---|
| `/saude-perto/` | 200 | Início ✅ |
| `/saude-perto/unidades` | 404 | **Unidades de saúde ✅** com mapa |
| `/saude-perto/agendamento` | 404 | **Solicitação de agendamento ✅** |
| `/saude-perto/rota-que-nao-existe` | 404 | **Esta página não existe ✅** |

**A recarga de URL profunda funciona.** Console do build de produção: sem nenhuma mensagem.

Varredura de segurança do `dist/`: nenhum `.env`, nenhuma chave, nenhum segredo. O único acerto do padrão foi a palavra "password" na lista de tipos de `input` de uma biblioteca. Apenas os **nomes** das variáveis `VITE_*` aparecem no bundle, todos URLs públicos. A versionar: 96 arquivos, 880 KB, sem `node_modules` nem `dist`.

### O que NÃO foi feito

- **Nenhum commit.** `git rev-list --all --count` → **0**. Decisão do usuário nesta sessão.
- Nenhum repositório remoto, nenhum push, **nada publicado**.
- Nome do repositório definido pelo usuário: **`saude-perto`** → `VITE_BASE=/saude-perto/`.
- `LICENSE` não definida.

### O que continua sem verificação

- **Leitor de tela real** (P13) e **dispositivo móvel real**.
- Caminho de sucesso da Overpass na interface (P2).
- O site em produção, já que não foi publicado.

### Problemas conhecidos

| # | Problema | Severidade |
|---|---|---|
| P1 | API do Ministério da Saúde inacessível | Alta |
| P2 | Overpass intermitente; sucesso nunca visto na interface | Alta |
| P3 | Plano B de dados de estabelecimentos | Alta |
| P4 | `gh` não instalado — criar o repositório pela web | Baixa |
| P6 | Pacote inicial 325,10 kB | Média |
| P7 | Armadilhas de configuração registradas | Baixa |
| P11 | Só 15 de 29 unidades do OSM trazem município | Baixa |
| P12 | Busca pode levar ~26 s antes do fallback | Média |
| P13 | Leitor de tela real nunca testado | Média |
| **P14** | Status HTTP 404 em rotas válidas, custo do fallback de SPA. Pode afetar indexação | Baixa |
| **P15** | Publicação no GitHub Pages ainda não concluída — duas execuções do CI falharam | Alta |
| **P16** | Diagnóstico meu dado como confirmado sem reproduzir o ambiente que falhou | Média |

## C. Decisões técnicas

### D1 — React + TypeScript + Vite como base
- **Decisão:** Usar Vite como ferramenta de build, com React 19 e TypeScript.
- **Motivo:** Exigência da disciplina e do escopo do projeto; Vite tem dev server rápido e build simples, adequado a host estático.
- **Alternativas:** Next.js (descartado — SSR/rotas de servidor são desnecessários e dificultam GitHub Pages); Create React App (descontinuado).
- **Consequências:** Aplicação puramente client-side; roteamento precisa de tratamento específico em host estático (ver `docs/deploy.md`).
- **Status:** vigente

### D2 — Tailwind CSS 4 com plugin oficial do Vite
- **Decisão:** Tailwind CSS 4.x via `@tailwindcss/vite`, com `@import "tailwindcss"` no CSS.
- **Motivo:** É o método documentado oficialmente pelo shadcn/ui para Vite em 2026. Tailwind 4 dispensa `tailwind.config.js` e `postcss.config.js`.
- **Alternativas:** CSS Modules (mais verboso, sem design system pronto); Tailwind 3 com PostCSS (abordagem antiga).
- **Consequências:** Configuração de tema via `@theme` no CSS, não em arquivo JS. Documentação de Tailwind 3 encontrada na web **não se aplica**.
- **Status:** vigente

### D3 — shadcn/ui como base de componentes
- **Decisão:** Adotar shadcn/ui (sobre Radix UI) como fundação da interface.
- **Motivo:** Acessibilidade é requisito não funcional de alta prioridade (WCAG 2.2 AA). Radix entrega gestão de foco, semântica ARIA e navegação por teclado corretas, o que seria custoso e arriscado implementar à mão. O código entra no repositório, permitindo customização total.
- **Alternativas:** Material UI (identidade visual difícil de personalizar, bundle grande); Chakra UI; componentes próprios (acessibilidade correta exigiria esforço desproporcional ao prazo).
- **Consequências:** Código dos componentes passa a ser mantido pelo projeto, não atualizado por `npm update`. Requer `components.json` e alias `@/*`.
- **Status:** vigente

### D4 — Motion como biblioteca de animação, GSAP descartado
- **Decisão:** Se houver necessidade de animação além de CSS, usar `motion`. Não usar GSAP.
- **Motivo:** `motion` é MIT, tem API React-first, tree-shaking e `useReducedMotion` nativo. GSAP opera sob licença proprietária "no-charge" da Webflow, que retém a propriedade intelectual e pode alterar os termos, e é redundante com `motion`.
- **Alternativas:** GSAP (descartado por licença e redundância); apenas CSS (preferível onde suficiente).
- **Consequências:** Nenhuma animação complexa de timeline ou morph de SVG. Aceitável para o escopo.
- **Status:** vigente — **instalação ainda não autorizada nem realizada**

### D5 — Leaflet + React Leaflet para o mapa
- **Decisão:** `leaflet` 1.9.4 com `react-leaflet` 5.0.0 e tiles do OpenStreetMap.
- **Motivo:** Sem chave de API, sem segredo no frontend, sem custo. Previsto nos requisitos do projeto.
- **Alternativas:** Google Maps e Mapbox (exigem chave de API — inviável em frontend público, conforme §8 do CLAUDE.md).
- **Consequências:** `react-leaflet` 5 usa licença **Hippocratic 2.1**, não aprovada pela OSI, com cláusulas de direitos humanos. Sem conflito prático para uso acadêmico em saúde pública, mas é uma diferença real em relação às demais dependências MIT. Exige exibir atribuição ao OpenStreetMap e respeitar a Tile Usage Policy.
- **Status:** vigente

### D6 — OpenStreetMap como fonte real de unidades de saúde
- **Decisão:** Usar a Overpass API (OpenStreetMap) como fonte de dados reais de estabelecimentos de saúde, com cache local e fallback para dados demonstrativos.
- **Motivo:** A API oficial do Ministério da Saúde está inacessível (P1) e o `dados.gov.br` exige chave (P3). A Overpass tem CORS liberado (verificado) e não exige autenticação.
- **Alternativas:** API do Ministério da Saúde (indisponível); CSV do CNES baixado e embutido no repositório (descartado nesta fase — arquivo grande, dado congelado, mas é o **plano B** se a Overpass se mostrar instável).
- **Consequências:** Cobertura varia por município conforme a completude do OSM. Dados não são oficiais do SUS — isso **deve** ser declarado na interface. Servidor público sem garantia de disponibilidade, exigindo tratamento de erro robusto.
- **Status:** vigente — **não validado com dados reais ainda** (bloqueado por P2)

### D7 — Separação explícita entre dado real e demonstrativo
- **Decisão:** Todo dado demonstrativo vive em `src/data/`, carrega um campo de origem no tipo, e a interface exibe rótulo visível de "dado demonstrativo".
- **Motivo:** Requisito do projeto e questão de honestidade: usuário não pode confundir exemplo com informação de saúde real.
- **Alternativas:** Misturar silenciosamente (inaceitável).
- **Consequências:** Tipos precisam modelar a origem do dado desde o início, não como adendo.
- **Status:** vigente

### D8 — Sem gerenciador de estado global
- **Decisão:** Usar estado local, Context apenas onde necessário, e hooks próprios para dados.
- **Motivo:** O MVP não tem estado compartilhado complexo. Redux/Zustand seriam complexidade arquitetural desnecessária para um projeto acadêmico.
- **Alternativas:** Zustand, Redux Toolkit, TanStack Query (este último seria justificável se o cache de rede ficar complexo — reavaliar na Fase 5).
- **Consequências:** Cache e revalidação de rede implementados manualmente nos hooks de serviço.
- **Status:** vigente

### D9 — Plugin `frontend-design` do Claude Code
- **Decisão:** **Instalado** em 2026-10-23, com autorização do usuário.
- **Motivo:** Plugin oficial da Anthropic, sem dependências, scripts de instalação ou hooks. Orienta direção visual e evita estética genérica de IA.
- **Alternativas:** Understand-Anything (adiado — traz hooks que injetam a instrução "Do not ask the user for confirmation — just do it"; e não havia codebase para mapear).
- **Consequências:** `claude plugin list` confirma `frontend-design@claude-plugins-official`, versão `465f09344424`, enabled, escopo user. A skill carrega no início de sessão, então fica disponível **a partir da próxima sessão**.
- **Status:** vigente

### D10 — `oxlint` como linter, em vez de ESLint
- **Decisão:** Manter `oxlint` 1.89.0, que vem no template oficial do Vite, e habilitar seu plugin `jsx-a11y`.
- **Motivo:** O planejamento inicial previa ESLint, mas `create-vite` 9.3.1 **não gera mais configuração de ESLint** — entrega `.oxlintrc.json`. Trocar para ESLint significaria remover o que o template oficial fornece e manter configuração própria. O fator decisivo foi verificar que `oxlint` tem plugin **`jsx-a11y`**, que cobre o lint de acessibilidade exigido por RNF02; sem isso a troca se justificaria.
- **Alternativas:** ESLint + `eslint-plugin-jsx-a11y` (descartado — mais configuração para a mesma cobertura); oxlint sem `jsx-a11y` (descartado — perderia o lint de acessibilidade).
- **Consequências:** Substitui a previsão de ESLint feita em §8 dos requisitos do projeto. `jsx-a11y` foi **verificado disparando** com um arquivo-sonda (`<img>` sem `alt` → `error jsx-a11y(alt-text)`, exit 1). A regra `react/only-export-components` foi desligada em `src/components/ui/**`, porque são arquivos gerados pela CLI do shadcn, não autorais.
- **Status:** vigente

### D11 — Base `radix` e preset `nova` no shadcn/ui
- **Decisão:** Inicializar o shadcn com `--base radix --preset nova`, gerando o estilo `radix-nova`.
- **Motivo:** A CLI 4.22.1 passou a oferecer três bases (`base`, `radix`, `aria`). `radix` é a que corresponde a D3, cuja justificativa é acessibilidade de origem. O preset `nova` usa Lucide como biblioteca de ícones, coerente com a stack já prevista.
- **Alternativas:** base `base` (padrão da CLI, não é Radix); base `aria` (React Aria — também acessível, mas foge de D3 e da documentação de referência).
- **Consequências:** Instalou `radix-ui` 1.8.1, `lucide-react` 1.61.0, `class-variance-authority`, `cn`, `tw-animate-css` e a fonte `@fontsource-variable/geist`. O `src/index.css` cresceu para 129 linhas com os tokens de tema. A fonte Geist vem do preset — a decisão tipográfica própria do projeto fica para a Fase 3 e pode substituí-la.
- **Status:** vigente

### D12 — TypeScript estrito adicionado manualmente; sem `baseUrl`
- **Decisão:** Adicionar `strict: true` e `noUncheckedIndexedAccess: true` em `tsconfig.app.json`, e configurar o alias `@/*` apenas por `paths`, sem `baseUrl`.
- **Motivo:** O template do Vite **não traz `strict`**, o que contraria RNF09. E o TypeScript 6.0.3 **deprecou `baseUrl`**: o build falhou com `error TS5101` até o campo ser removido.
- **Alternativas:** Manter `baseUrl` com `ignoreDeprecations: "6.0"` (descartado — apenas adia o problema até o TS 7).
- **Consequências:** Tipagem mais rígida desde o início, o que é mais barato agora que depois. **Não reintroduzir `baseUrl`** — quebra o build. Registrado como P7.
- **Status:** vigente

---

### D13 — Direção visual: a cartilha de saúde pública
- **Decisão:** Identidade baseada na tradição gráfica da comunicação de saúde pública brasileira — cartilha impressa, cartaz de campanha, placa esmaltada de posto. Faixas de cor chapada, tipografia grande, zero sombra, raio apenas em elementos clicáveis. Paleta de seis valores: papel `#FAF8F3`, papel-2 `#F0EDE4`, tinta `#15231D`, verde-posto `#0F5D4A`, azul-cartilha `#1B4D8F`, amarelo-campanha `#F2B705`.
- **Motivo:** A referência é simultaneamente **específica do assunto** e **funcionalmente correta** para o público — pessoas idosas, com baixa visão, com pouca familiaridade digital. Contraste alto e tipo grande servem à estética e à acessibilidade ao mesmo tempo. Corpo base em 18 px, acima do comum de 16 px, pelo mesmo motivo.
- **Alternativas:** O padrão genérico de aplicação de saúde (fundo branco, azul primário, grade de cartões arredondados com sombra suave, faixa com gradiente) foi descartado por não dizer nada sobre o assunto. A fonte Geist, herdada do preset do shadcn, foi descartada por ser um grotesco neutro de produto de software, sem relação com o tema — foi desinstalada.
- **Consequências:** Nenhuma `box-shadow` e nenhum gradiente no projeto. O raio passa a carregar informação (sinaliza o que é interativo) em vez de ser enfeite uniforme. Vermelho fica reservado a erro e emergência. Registrado por extenso em `docs/arquitetura.md` §10, com a revisão contra os padrões genéricos e a medição de contraste. **Alterar a paleta obriga a remedir o contraste.**
- **Status:** vigente

### D14 — `createBrowserRouter` com fallback de 404 — **resolvida e testada**
- **Decisão:** `createBrowserRouter` com URLs limpas, mais `dist/404.html` gerado a partir do `index.html` no fim do build. `HashRouter` descartado.
- **Motivo:** URLs limpas importam num projeto que também serve de portfólio. A decisão foi **testada em simulador do GitHub Pages**, não presumida: as quatro rotas conferidas renderizaram a página correta.
- **Alternativas:** `HashRouter` (descartado — expõe uma limitação de hospedagem ao usuário em toda URL).
- **Consequências:** A resposta HTTP continua **404** em rotas válidas. Não afeta quem navega, mas pode afetar indexação — registrado como P14. O `basename` do roteador acompanha `import.meta.env.BASE_URL`; sem isso, toda rota cairia no 404 em publicação com subcaminho.
- **Status:** vigente

### D15 — Solicitações só em memória, nunca em `localStorage`
- **Decisão:** As solicitações simuladas vivem em um store de módulo, em memória. Somem ao recarregar a página, e a interface declara isso.
- **Motivo:** O formulário coleta nome e contato, que são dados pessoais. `localStorage` deixaria essa informação no dispositivo, legível por qualquer pessoa que o use, sem nenhum ganho real num projeto acadêmico. Resolve o ponto que estava em aberto em `docs/arquitetura.md` §11.
- **Alternativas:** `localStorage` (descartado por privacidade); `sessionStorage` (mesmo problema, menor alcance).
- **Consequências:** RF13 funciona apenas dentro da sessão. A página de solicitações e a de privacidade explicam isso em texto.
- **Status:** vigente

### D16 — Resolver Zod escrito à mão
- **Decisão:** Ligar Zod ao react-hook-form com `src/lib/resolverZod.ts`, próprio, em vez de `@hookform/resolvers`.
- **Motivo:** `@hookform/resolvers@6` falhou a instalação com `ERESOLVE`: arrasta `@typeschema/main` e `effect` como peers opcionais conflitantes. O resolver são ~20 linhas.
- **Alternativas:** `--legacy-peer-deps` (descartado — mascara conflito real).
- **Consequências:** Uma dependência a menos. Mostra só a primeira mensagem por campo, para não sobrecarregar leitores de tela.
- **Status:** vigente

### D17 — Recarga única após publicação nova, com tela de erro própria
- **Decisão:** As rotas carregadas sob demanda ganham um `errorElement`. Ao reconhecer uma falha de import dinâmico, a página recarrega **uma vez**; falhando de novo, mostra uma tela de erro própria. O `errorElement` fica numa rota sem caminho, abaixo do `LayoutPrincipal`, para o erro aparecer dentro do `<main>` com cabeçalho e rodapé no lugar.
- **Motivo:** Publicada uma versão nova, os pedaços de código com hash antigo somem do servidor e quem está com a aba aberta recebe `Failed to fetch dynamically imported module`. Sem `errorElement`, aparece a tela de depuração do React Router ("Unexpected Application Error!", "Hey developer 👋"), inaceitável num projeto de portfólio. Reproduzido no preview local em 2026-10-23.
- **Alternativas:** Não fazer nada (descartado — a tela padrão fala com o desenvolvedor); recarregar sem limite (descartado — laço infinito se a falha for permanente); carregar a tela de erro sob demanda (**impossível** — se o erro é um pedaço que não carrega, a tela de erro falharia junto).
- **Consequências:** O componente fica no pacote inicial e por isso é deliberadamente pobre em dependências: `<button>` comum em vez do `Button` de `components/ui`, que custaria +35 kB de `radix-ui` no primeiro carregamento. Custo real medido: +2,5 kB. **Não trocar por componentes do design system.**
- **Relação com D15:** D15 recusou `sessionStorage` para **dados pessoais** do formulário. Aqui o que se grava é um carimbo de tempo numérico, sem nada pessoal, apenas para impedir laço de recarga — não há contradição.
- **Status:** vigente

## D. Estrutura atual do projeto

**Confirmada por `find src -type f` em 2026-10-23: 39 arquivos.**

```
src/
├── main.tsx · App.tsx · rotas.tsx · index.css
├── types/      dados.ts · unidade.ts · campanha.ts
├── hooks/      useTituloPagina.ts
├── lib/        utils.ts
├── data/       campanhas-destaque.ts · unidades.mock.ts · campanhas.mock.ts
├── layouts/    LayoutPrincipal.tsx          (header / main#conteudo / footer + Suspense)
├── components/
│   ├── ui/         button.tsx
│   ├── layout/     SkipLink · Header · Nav · itens-nav · Footer
│   ├── estados/    Carregando · Erro · Vazio · SeloDadoDemo
│   │               FonteOficial · AvisoEmergencia
│   └── unidades/   UnidadeCard · UnidadeFiltros · filtros.ts
└── pages/      Inicio · Unidades · UnidadeDetalhe · Campanhas
                PrimeirosSocorros · SaudeMental · Sobre · Privacidade
                Acessibilidade · NaoEncontrado · EmConstrucao
```

**Ainda não existe:** `src/services/`, `src/schemas/`, `src/test/`, `components/mapa/`, `components/formulario/`.

### Rotas declaradas

| Caminho | Componente | Requisito |
|---|---|---|
| `/` | `Inicio` | RF01 |
| `/unidades` | `Unidades` (lazy) | RF03, RF04 |
| `/unidades/:id` | `UnidadeDetalhe` (lazy) | RF05 |
| `/campanhas` | `Campanhas` (lazy) | RF07 |
| `/primeiros-socorros` | `PrimeirosSocorros` (lazy) | RF08 |
| `/saude-mental` | `SaudeMental` (lazy) | RF09 |
| `/agendamento` | `EmConstrucao` (Fase 6) | RF10–RF12 |
| `/minhas-solicitacoes` | `EmConstrucao` (Fase 6) | RF13 |
| `/sobre` | `Sobre` | RF16 |
| `/privacidade` | `Privacidade` | RF16 |
| `/acessibilidade` | `Acessibilidade` | RF16 |
| `*` | `NaoEncontrado` | RF16 |

## E. Requisitos e funcionalidades

Definição completa, com critérios verificáveis: **`docs/requisitos.md`**.

Estados possíveis: `Planejada` · `Em desenvolvimento` · `Implementada` · `Testada` · `Bloqueada`

> Uma funcionalidade só vira **Testada** com teste automatizado passando ou verificação manual registrada em §H. Código escrito ≠ testado.

### Requisitos funcionais

| ID | Requisito | Estado |
|---|---|---|
| RF01 | Página inicial com serviços e campanhas em destaque | **Implementada** |
| RF02 | Busca de unidades de saúde por localidade | **Implementada** |
| RF03 | Listagem de unidades com informações essenciais | **Testada** |
| RF04 | Filtros de unidades (tipo, serviço) | **Testada** |
| RF05 | Página de detalhes da unidade | **Implementada** |
| RF06 | Mapa interativo com marcadores das unidades | **Implementada** |
| RF07 | Listagem de campanhas de saúde preventiva | **Implementada** |
| RF08 | Conteúdo educativo de primeiros socorros | **Implementada** |
| RF09 | Conteúdo educativo de saúde mental | **Implementada** |
| RF10 | Formulário de solicitação de agendamento demonstrativo | **Testada** |
| RF11 | Validação de formulário com mensagens acessíveis | **Testada** |
| RF12 | Confirmação de envio com aviso de caráter demonstrativo | **Testada** |
| RF13 | Acompanhamento de solicitações simuladas | **Implementada** |
| RF14 | Estados de carregamento, erro e resultado vazio | **Testada** |
| RF15 | Navegação responsiva entre páginas | **Testada** |
| RF16 | Páginas informativas (sobre, acessibilidade, privacidade, 404) | **Implementada** |

### Requisitos não funcionais

| ID | Requisito | Estado |
|---|---|---|
| RNF01 | Responsividade de 320 px a desktop | **Em desenvolvimento** |
| RNF02 | Acessibilidade WCAG 2.2 AA | Planejada |
| RNF03 | Operação completa por teclado | **Implementada** |
| RNF04 | Contraste e foco visível | **Testada** |
| RNF05 | Desempenho de carregamento | Planejada |
| RNF06 | Compatibilidade de navegadores | Planejada |
| RNF07 | Segurança (sem segredos no cliente) | Planejada |
| RNF08 | Privacidade e conformidade com a LGPD | **Implementada** |
| RNF09 | Manutenibilidade e tipagem consistente | Planejada |
| RNF10 | Testabilidade e cobertura dos fluxos principais | **Testada** |
| RNF11 | Confiabilidade das integrações com fallback | **Testada** |
| RNF12 | Facilidade de publicação | Planejada |

**Estado após a Fase 7:** os 16 requisitos funcionais estão implementados, e **7 deles passaram a Testada** com teste automatizado cobrindo seus critérios (RF03, RF04, RF10, RF11, RF12, RF14, RF15). Nos não funcionais, **4 Testados** (RNF04, RNF10, RNF11 e, parcialmente, RNF02 pela via automatizada).

> **Testada** aqui significa: existe teste automatizado passando que cobre os critérios de aceitação, **ou** verificação manual registrada com data e resultado. Os demais requisitos seguem Implementados — funcionam, mas sem rede de proteção contra regressão.

> **Nenhum requisito está Testado.** Não há teste automatizado (P10). A interface **foi** inspecionada no navegador na Fase 4, e os comportamentos de RF03, RF04, RF05, RF15 e RF16 foram observados funcionando — mas verificação manual pontual não é cobertura de teste, e nada impede uma regressão silenciosa na próxima alteração. O estado **Testada** só é atribuído com teste automatizado passando (ver `docs/testes.md` §5).
>
> - **RF14 Em desenvolvimento:** os quatro componentes de estado existem (`Carregando`, `Erro`, `Vazio`, `SeloDadoDemo`), mas nenhum fluxo assíncrono real os usa ainda. Fecha na Fase 5.
> - **RNF04 Em desenvolvimento:** o contraste da paleta foi medido no cálculo e o foco de 3 px está implementado, mas nada foi verificado na tela renderizada.

---

## F. APIs e integrações

Investigação completa: **`docs/apis.md`**. Resumo do estado verificado:

### F1 — API de Dados Abertos do Ministério da Saúde
- **Fonte:** `https://apidadosabertos.saude.gov.br/`
- **Endpoint utilizado:** nenhum — serviço inacessível
- **Finalidade pretendida:** estabelecimentos de saúde (CNES), dados oficiais
- **Formato:** não verificado (sem resposta)
- **Autenticação:** não verificada
- **Limites:** não verificados
- **Resultado dos testes:** DNS resolve para `189.28.130.6`, mas as portas 80 e 443 não completam conexão (timeout de 20 s). Teste independente a partir de outra rede retornou `ECONNREFUSED 189.28.130.6:443`. Tentativas em `/v3/api-docs`, `/swagger-ui/index.html`, `/openapi.json`, `/v2/api-docs`, `/api-docs` — todas HTTP 000.
- **Fallback implementado:** nenhum ainda; planejado D6 (Overpass) + dados demonstrativos
- **Última verificação:** 2026-10-23

### F2 — Overpass API (OpenStreetMap)
- **Fonte:** `https://overpass-api.de/api/interpreter`
- **Endpoint pretendido:** `POST` com Overpass QL, filtrando `amenity` em `hospital|clinic|doctors` por caixa geográfica
- **Finalidade:** unidades de saúde reais por área
- **Formato:** JSON (`[out:json]`)
- **Autenticação:** nenhuma
- **Limites:** uso justo, sem SLA; exige `User-Agent` identificável (requisições sem ele retornaram HTTP 406); recomenda retentativa com backoff exponencial
- **Resultado dos testes:** HTTP 502 "server at capacity" nas tentativas. **`access-control-allow-origin: *` confirmado nos headers de resposta** — CORS viável no navegador. Consulta **não validada com dados reais**.
- **Fallback implementado:** nenhum ainda; planejado cache local + dados demonstrativos rotulados
- **Última verificação:** 2026-10-23

### F3 — Nominatim (OpenStreetMap)
- **Fonte:** `https://nominatim.openstreetmap.org/search`
- **Endpoint utilizado:** `GET /search?q=<consulta>&format=json&limit=<n>`
- **Finalidade:** geocodificar o termo de busca do usuário em coordenadas
- **Formato:** JSON — array com `display_name`, `lat`, `lon`
- **Autenticação:** nenhuma
- **Limites:** máximo 1 requisição por segundo; identificação obrigatória (no navegador, via `Referer`, já que `User-Agent` não é definível); uso pesado proibido pela política
- **Resultado dos testes:** ✅ HTTP 200, `access-control-allow-origin: *`. Consulta `Recife, PE` retornou `-8.0584933, -34.8848193`.
- **Fallback implementado:** nenhum ainda; planejado debounce + lista de municípios pré-definidos
- **Última verificação:** 2026-10-23

### F4 — Tiles do OpenStreetMap
- **Fonte:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Finalidade:** camada base do mapa
- **Formato:** PNG
- **Autenticação:** nenhuma
- **Limites:** Tile Usage Policy — atribuição obrigatória, uso pesado proibido, sem SLA
- **Resultado dos testes:** ✅ HTTP 200, `image/png`
- **Fallback implementado:** nenhum ainda
- **Última verificação:** 2026-10-23

### F5 — API do dados.gov.br
- **Fonte:** `https://dados.gov.br/api/publico/conjuntos-dados`
- **Resultado dos testes:** HTTP 401 — exige autenticação
- **Decisão:** **descartada.** Chave de API em frontend público violaria §8 do CLAUDE.md.
- **Última verificação:** 2026-10-23

### Conteúdo sem API (campanhas, primeiros socorros, saúde mental)
Não há API pública confiável. Será conteúdo editorial redigido a partir de fontes oficiais, **com citação explícita da fonte em cada página**, marcado como conteúdo informativo. **Proibido inventar campanhas vigentes, datas, estatísticas ou dados institucionais.**

> ⚠️ **Nenhum token, senha ou segredo deve ser registrado neste arquivo.** Nenhuma das APIs acima exige credencial.

---

## G. Problemas e pendências

### P1 — API oficial do Ministério da Saúde inacessível
- **Descrição:** `apidadosabertos.saude.gov.br` não responde nas portas 80/443, confirmado de duas redes independentes.
- **Impacto:** Alto. Elimina a fonte oficial de estabelecimentos (CNES), que era a integração mais relevante academicamente.
- **Prioridade:** Alta
- **Próxima ação:** Reverificar no início da Fase 5. Se continuar fora, documentar como limitação e seguir com D6.
- **Bloqueios:** Externo, fora do nosso controle.

### P2 — Overpass API sobrecarregada, sem validação de dados
- **Descrição:** Servidor público retornou HTTP 502 "at capacity". A consulta planejada nunca retornou dados.
- **Impacto:** Médio. A viabilidade prática de D6 segue não comprovada.
- **Prioridade:** Alta (pré-requisito de D6)
- **Próxima ação:** Na Fase 5, revalidar com backoff exponencial e testar espelhos. Definir cache e fallback antes de depender da API.
- **Bloqueios:** Disponibilidade do serviço público.

### P3 — Plano B de dados de estabelecimentos não definido
- **Descrição:** Se P1 e P2 persistirem, não há fonte real de unidades de saúde.
- **Impacto:** Médio. Reduziria o projeto a dados demonstrativos, enfraquecendo o objetivo de consumo de API pública.
- **Prioridade:** Média
- **Próxima ação:** Avaliar na Fase 5 embutir extrato reduzido do CNES (CSV → JSON) com data de extração declarada.
- **Bloqueios:** Resultado de P1/P2.

### P4 — `gh` não instalado
- **Descrição:** `git init` feito (branch `main`, 0 commits), mas o GitHub CLI não está disponível.
- **Impacto:** Baixo. A criação do repositório remoto na Fase 8 terá de ser pela interface web ou após instalar `gh`.
- **Prioridade:** Baixa
- **Próxima ação:** Decidir na Fase 8. **Nenhum commit sem autorização do usuário.**
- **Bloqueios:** Nenhum.

### P6 — Pacote inicial em 325,10 kB
- **Descrição:** Pacote inicial de JS em **325,10 kB** (103,37 kB gzip), medido em 2026-10-23 com `VITE_BASE="/saude-perto/" npm run build`. As rotas já são carregadas sob demanda e o mapa está num pedaço separado (154,85 kB), que só baixa em `/unidades`.
- **Impacto:** Médio. RNF05 exige atenção a desempenho e o público usa rede móvel.
- **Prioridade:** Média
- **Próxima ação:** Se for mexer, medir antes e depois. Já se sabe que `radix-ui` é caro: importar `Button` de `components/ui` no pacote inicial custou **+35 kB** (D17). O resto da aplicação usa `<button>` com classes diretas; migrar o pouco que usa `Button` provavelmente tira `radix-ui` do caminho crítico.
- **Bloqueios:** Nenhum.

### P7 — Armadilhas de configuração a não repetir
- **Descrição:** Duas pegadinhas já custaram tempo: (a) o template do Vite **não** traz `strict`, que precisou ser adicionado à mão; (b) o TypeScript 6 **deprecou `baseUrl`** e o build falha com `TS5101` se ele existir.
- **Impacto:** Baixo, desde que registrado.
- **Prioridade:** Baixa
- **Próxima ação:** Nenhuma. **Não reintroduzir `baseUrl`** ao mexer em tsconfig. Registrado em D12 e em `CLAUDE.md` §3.
- **Bloqueios:** Nenhum.

### ~~P8 — A interface nunca foi vista~~ → **RESOLVIDA em 2026-10-23**
- **Como:** A extensão do Claude foi instalada no Brave pelo usuário. A interface foi inspecionada no navegador em 1440×900, 1280×860 e 320×800.
- **Resultado:** A aplicação renderiza corretamente. Console **sem nenhum erro ou aviso** (apenas mensagens do Vite e o aviso informativo do React DevTools). Verificados na tela: `SkipLink` aparecendo ao receber foco, `Esc` fechando o menu e devolvendo o foco ao botão, anel de foco branco visível sobre a faixa verde, `aria-current` marcando o item ativo, 320 px sem rolagem horizontal, rota 404 funcionando.
- **Dois defeitos encontrados e corrigidos** — ver §H.

### P9 — Par de cor amarelo-sobre-verde abaixo do mínimo
- **Descrição:** `--amarelo-campanha` `#F2B705` sobre `--verde-posto` `#0F5D4A` mede **4,30:1**, abaixo do mínimo de 4,5:1 para texto comum. Passa o mínimo de 3:1 para texto grande e componentes.
- **Impacto:** Baixo, desde que respeitado. O par é usado no item ativo da navegação e no link de ação da faixa principal.
- **Prioridade:** Baixa
- **Próxima ação:** Nenhuma imediata. **Nunca usar esse par em texto corrido.** Se a navegação precisar de texto menor em amarelo, escurecer o verde ou clarear o amarelo e **remedir**.
- **Bloqueios:** Nenhum.

### P15 — Publicação no GitHub Pages ainda não concluída
- **Descrição:** Dois pushes foram feitos e **as duas execuções do workflow falharam no passo "Testes"**, antes do build. Nada foi publicado; `https://resourceshade.github.io/saude-perto/` responde HTTP 404 e a API `/pages` também devolve 404 (Pages nunca foi habilitado, porque é o próprio workflow que o habilita e ele nunca chegou lá).
- **Causa, agora identificada e reproduzida:** o workflow usava `node-version: '20'`. O jsdom 30 traz um `undici` que chama `zlib.createZstdDecompress.bind(...)` ao carregar; essa API do Node só existe a partir da 22. Na 20 ela é `undefined`, o módulo lança `TypeError: Cannot read properties of undefined (reading 'bind')` e **todos os workers do Vitest morrem antes de executar qualquer teste** — `12 errors`, `no tests`. O `vitest` declara a exigência em `engines`: `^22.12.0 || ^24.0.0 || >=26.0.0`.
- **Como foi reproduzida:** binário oficial `node-v20.20.2-linux-x64` baixado para a pasta temporária da sessão, `sha256` conferido contra o `SHASUMS256.txt` do nodejs.org, extraído sem tocar no Node do sistema. A suíte rodada com ele falhou de forma idêntica. `typeof zlib.createZstdDecompress`: `undefined` na v20.20.2, `function` na v24.15.0.
- **Correção aplicada, ainda não validada no CI:** `node-version: '24'` no workflow, `engines.node: ">=22.12.0"` em `package.json`, `.nvmrc` com `24`.
- **Impacto:** Alto até publicar — é o requisito de entrega.
- **Prioridade:** Alta
- **Próxima ação:** o usuário faz o push; conferir a execução pela API e, se publicar, verificar o site no navegador (navegação, recarga de URL profunda, mapa, formulário, 320 px).
- **Bloqueios:** o log do CI não é legível por aqui — `GET /actions/runs/:id/logs` devolve **HTTP 403**, exige permissão de administrador. Diagnóstico depende de reprodução local ou de o usuário colar o erro.

### P16 — Um diagnóstico meu foi dado como confirmado sem reproduzir o ambiente
- **Descrição:** A primeira falha do CI foi atribuída ao `testTimeout` padrão de 5 s do Vitest. A hipótese foi apoiada por um experimento real (`--testTimeout=2000` faz falhar exatamente o teste de 2,6 s), e isso foi registrado em `docs/CHANGELOG.md` e `docs/testes.md` como "confirmado por experimento". **Estava errado.** O experimento provava apenas que aquele teste é lento, não que fosse isso que o CI sofria. O push com a correção falhou no mesmo passo.
- **Impacto:** Médio. Custou um ciclo de push ao usuário e documentação incorreta, que foi corrigida.
- **Próxima ação:** Nenhuma pendente — a documentação já traz a correção explícita. **Regra:** diagnóstico de falha em ambiente diferente só vale depois de reproduzir *aquele* ambiente. Era possível baixar o Node 20 desde o início.
- **Bloqueios:** Nenhum.

### Resolvidas nesta sessão

- ~~**P4 original** — repositório não inicializado~~ → `git init` executado, branch renomeada para `main`, 0 commits.
- ~~**P5** — plugin `frontend-design` pendente de autorização~~ → autorizado e instalado; `claude plugin list` confirma habilitado.
- ~~**Fonte Geist herdada do preset**~~ → substituída por Archivo e desinstalada (D13).

## H. Última sessão

**Data:** 2026-10-23 · **As 8 fases do plano**, mais a instalação do plugin `frontend-design`.

### O que a Fase 8 entregou

`base` configurável por `VITE_BASE`, `basename` do roteador acompanhando, `scripts/pos-build.mjs` gerando `dist/404.html`, varredura de segurança do build e a decisão D14 **testada**.

### A armadilha que custou investigação

`npm run preview` depois de um build com `VITE_BASE` **servia página em branco, sem nenhum erro no console**. O `vite preview` relê o `vite.config.ts` e não sabe com que `base` o build foi feito: servia os ativos em `/assets/` enquanto o HTML os pedia em `/saude-perto/assets/`.

Pior: minha primeira conclusão foi de que **funcionava**, porque o `curl` devolvia HTTP 200. Só que eram **758 bytes** — o tamanho do `404.html` — e não os 322 KB do bundle. **Conferir o código de status não basta.** Registrado em `docs/deploy.md` §4 e em `CLAUDE.md` §5.

### Comandos e saída real

| Comando | Saída |
|---|---|
| `VITE_BASE=/saude-perto/ npm run build` | exit 0; caminhos com o subcaminho conferidos no `dist/index.html` |
| `node scripts/pos-build.mjs` | `dist/404.html` criado |
| Simulador do Pages, 4 rotas | todas renderizaram a página correta |
| `VITE_BASE=/saude-perto/ npm run preview` | ✅ JS servido com 322.565 bytes; página renderiza |
| `npm run test` | **89 passed (89)** |
| `npm run lint` | exit 0 |
| Varredura de segredos no `dist/` | limpa |
| `git check-ignore` | `node_modules`, `dist`, `.env`, `coverage` ignorados |
| `git rev-list --all --count` | **0** |

### Decisões do usuário nesta sessão

- **Nenhum commit por enquanto.**
- Nome do repositório: **`saude-perto`**.

### O que não pôde ser verificado

Leitor de tela real (P13), dispositivo móvel real, caminho de sucesso da Overpass (P2) e o site em produção — já que nada foi publicado.

---

## I. Próxima sessão

### Estado de partida

**As 8 fases do plano original estão concluídas.** 16 requisitos funcionais implementados, 105 testes passando localmente em Node 24, acessibilidade auditada, build verificado.

**Repositório remoto:** `https://github.com/ResourceShade/saude-perto` — público, branch padrão `main`, 2 commits enviados pelo usuário. **Ainda não publicado:** as duas execuções do workflow falharam no passo "Testes" (ver P15). O site responde 404 e o GitHub Pages nunca foi habilitado.

**Correção pendente de push** (o usuário faz todas as operações de git): `node-version: '24'` no workflow, `engines.node` em `package.json`, `.nvmrc`.

### Caminhos possíveis, em ordem de valor

**1. Concluir a publicação — P15.**
- O usuário faz `git add -A && git commit && git push` com a correção da versão do Node.
- Conferir a execução por `GET /repos/ResourceShade/saude-perto/actions/runs` (o log em si dá 403).
- O workflow habilita o Pages sozinho (`enablement: true` em `configure-pages`); não é preciso mexer em Settings.
- **Verificar o site publicado antes de anunciar qualquer URL**: navegação, recarga de URL profunda, mapa, formulário, 320 px.
- Só então registrar a URL no README.

**2. Resolver P3 — fonte estável de unidades.** É a maior fragilidade técnica. A Overpass caiu em todas as buscas feitas pela interface. Avaliar embutir um extrato reduzido do CNES (CSV → JSON) com data de extração declarada, usado como fonte primária, com a Overpass como complemento.

**3. Fechar P13 — teste com leitor de tela.** É a única lacuna que resta em RNF02 e não dá para fechar por script. Precisa de alguém percorrendo os fluxos com NVDA, VoiceOver ou Orca.

**4. Melhorias que o usuário quiser rever.** O plano previa essa etapa. Candidatos registrados: P6 (tamanho do pacote), P11 (município ausente no OSM), P12 (espera de ~26 s), P14 (status 404 em rotas válidas).

### Antes de qualquer alteração

Ler `CLAUDE.md` §7 (regras, incluindo as de design em 10 e 11), `docs/arquitetura.md` §10 (design system e a restrição do par amarelo-sobre-verde) e rodar `npm run test` para confirmar que a base está verde.

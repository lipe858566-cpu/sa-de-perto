# CHANGELOG — Saúde Perto

Histórico cronológico de mudanças relevantes. Mudanças mais recentes no topo.

Este arquivo registra **o que altera o entendimento do projeto**: funcionalidades, correções importantes, arquitetura, dependências, requisitos e limitações. Ajustes visuais menores não entram aqui.

O projeto ainda não tem versões publicadas. Enquanto isso, as entradas são agrupadas por sessão.

---

## [Não publicado] — Recuperação de versão desatualizada

### Adicionado

- `src/lib/versaoDesatualizada.ts` — reconhece a falha de carregamento de pedaço de código sob demanda e controla uma recarga única.
- `src/components/estados/ErroDeRota.tsx` — `errorElement` das rotas, com mensagem para quem usa o site em vez da tela de depuração do React Router.
- `src/rotas.tsx` — rota sem caminho entre o `LayoutPrincipal` e as páginas, só para carregar o `errorElement` um nível abaixo. Assim o erro aparece dentro do `<main>`, com cabeçalho e rodapé no lugar, em vez de substituir a casca inteira.
- 16 testes novos (`versaoDesatualizada.test.ts`, `ErroDeRota.test.tsx`). Total: **105 testes em 14 arquivos**.

### O problema

As rotas são carregadas sob demanda e cada pedaço tem um hash no nome. Publicada uma versão nova, os arquivos da anterior somem do servidor; quem estava com a aba aberta continua com o `index.html` antigo e pede um arquivo que já não existe.

Em host estático com fallback de SPA o efeito é pior: o pedido **não devolve 404, devolve o `404.html` com status 200**. O navegador pede JavaScript, recebe HTML e lança `Failed to fetch dynamically imported module`. Medido no preview local:

```
/saude-perto/assets/Campanhas-8DZTvDt7.js  →  HTTP 200 | 758 bytes | text/html
```

O que aparecia era a tela padrão do React Router — "Unexpected Application Error!" seguido de "Hey developer 👋" e uma sugestão de escrever um `errorElement`. Tela de depuração, não de uso.

### Como funciona

Reconhecida a falha, a página recarrega **uma vez** e busca o `index.html` novo. A marca fica em `sessionStorage` (um carimbo de tempo, nada pessoal — `CLAUDE.md` §8), vale por 10 s e só nesta aba. Se a segunda tentativa também falhar, aparece a tela de erro, que **não promete** que tentar de novo resolve. Sem `sessionStorage` disponível (aba anônima, armazenamento bloqueado) não há recarga automática: sem onde registrar a tentativa, não há como evitar laço infinito.

O reconhecimento é por mensagem, porque não existe tipo de erro específico — cobre as quatro frases de Chrome/Edge, Firefox, Safari e do pré-carregamento de CSS do Vite, cada uma com teste.

### Custo no pacote, medido

A primeira versão usava `Erro` e `Button` de `components/ui`. Como o `errorElement` **não pode** ser carregado sob demanda — se o erro é justamente um pedaço que não carrega, a tela de erro falharia junto —, ele vive no pacote inicial, e `Button` arrasta `radix-ui` e `class-variance-authority` para lá:

| | Pacote inicial |
|---|---|
| Antes | 322,56 kB |
| Com `Button` do design system | 358,02 kB |
| Com `<button>` comum | **325,10 kB** |

Reescrito sem o design system: **+2,5 kB** em vez de +35 kB. O resto da aplicação já usa `<button>` com as mesmas classes, então não houve perda de consistência visual. Registrado em P6.

### Verificado no navegador

Simulada uma publicação nova removendo `dist/assets/Campanhas-*.js` do servidor de preview:

- Clicar em "Campanhas" → recarga automática → tela de erro. `performance.getEntriesByType('navigation')` devolveu `["reload"]`, confirmando que a recarga aconteceu de fato, e a marca em `sessionStorage` impediu a segunda.
- `role="alert"` presente; `<title>` da aba vira "Erro ao carregar a página — Saúde Perto" (RNF02).
- Restaurado o arquivo: navegação normal, sem erro, sem marca de recarga, `navigation type: "navigate"`.
- Conteúdo restrito a 320 px: sem transbordo horizontal; botão 167×56 px e nenhum link abaixo de 24 px (WCAG 2.5.8). **Ressalva:** a janela do navegador não aceitou redimensionamento no ambiente de teste, então a restrição foi aplicada ao contêiner, não à janela — as media queries não foram exercitadas. A única classe responsiva da tela é o tamanho do `<h1>`, e o teste mediu a variante maior, que é o pior caso para transbordo.

---

## [Não publicado] — Correção do CI: versão do Node

### Corrigido

- **A suíte não rodava no GitHub Actions: o workflow usava Node 20.** O jsdom 30 traz um `undici` que, ao carregar `lib/interceptor/decompress.js`, chama `zlib.createZstdDecompress.bind(...)`. Essa API do Node só existe a partir da 22; na 20 ela é `undefined` e o módulo lança `TypeError: Cannot read properties of undefined (reading 'bind')`. Todos os workers do Vitest morrem antes de começar: **12 erros e nenhum teste executado** — não é um teste falhando, é a suíte não iniciando. O `vitest` declara a exigência em `engines`: `^22.12.0 || ^24.0.0 || >=26.0.0`.
- `.github/workflows/deploy.yml`: `node-version` de `'20'` para `'24'`, a mesma versão usada no desenvolvimento, com comentário explicando por que não se deve baixar.
- `package.json`: campo `engines.node` com `>=22.12.0`, e `.nvmrc` com `24`, para que a exigência fique declarada no repositório e não só no comentário do workflow.

### Correção de um diagnóstico anterior

**A causa registrada antes neste arquivo estava errada.** O primeiro diagnóstico atribuiu a falha ao `testTimeout` padrão de 5 s do Vitest. A hipótese era plausível e foi apoiada por um experimento real (com `--testTimeout=2000` o teste de 2,6 s falha), mas o experimento confirmava apenas que *aquele teste é lento* — não que fosse isso que o CI estava sofrendo. O push com essa correção **falhou no mesmo passo**, o que derrubou a hipótese.

`testTimeout: 20_000` foi mantido: a folga continua justificada pela espera real dos serviços num runner mais lento. Mas não era a causa.

### Como foi diagnosticado, desta vez

O log do CI continua ilegível sem permissão de administrador (HTTP 403 em `/actions/runs/:id/logs`). Em vez de adivinhar de novo, a falha foi **reproduzida localmente** com o Node 20 de verdade: binário oficial `node-v20.20.2-linux-x64` baixado para a pasta temporária da sessão, com `sha256` conferido contra o `SHASUMS256.txt` do nodejs.org, extraído sem tocar no Node do sistema. Rodando a suíte com ele, o erro apareceu idêntico ao padrão do CI. A API ausente foi confirmada diretamente:

| Node | `typeof zlib.createZstdDecompress` |
|---|---|
| v20.20.2 | `undefined` |
| v24.15.0 | `function` |

**Lição:** um experimento que confirma a hipótese não prova a causa, se não reproduzir o ambiente que falhou. Era possível reproduzir o Node 20 desde o começo e isso não foi feito.

### Verificado depois da correção

Com Node 24: `npm run lint` exit 0; `npm run test` **89 testes, 12 arquivos, exit 0**; `VITE_BASE="/saude-perto/" npm run build` exit 0, ativos gerados em `/saude-perto/assets/` e `dist/404.html` criado.

---

## [Não publicado] — Preparação para o GitHub

### Adicionado

- `.github/workflows/deploy.yml`: publicação automática no GitHub Pages a cada push em `main`. O CI roda `npm ci`, `npm run lint`, `npm run test` e o build — **um teste quebrado impede a publicação**. O subcaminho vem de `github.event.repository.name`, então não precisa ser configurado à mão.

### Verificado

Servidores locais encerrados. `package-lock.json` em sincronia com `package.json` (29 dependências, nenhuma ausente, lockfileVersion 3) — o `npm ci` do CI vai funcionar. 97 arquivos a versionar, sem `node_modules`, `dist` ou `.env`.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 8)

**Fase 8 — Build e preparação para publicação. Concluída. As 8 fases do plano estão cumpridas.**

### Adicionado

- `base` do Vite configurável por `VITE_BASE`, para publicação em subcaminho.
- `basename` do roteador acompanhando `import.meta.env.BASE_URL`. **Sem isso, toda rota cairia no 404** numa publicação com subcaminho.
- `scripts/pos-build.mjs`, que copia `dist/index.html` para `dist/404.html` ao fim do build — o fallback de SPA do GitHub Pages.
- Documentação de `VITE_BASE` no `.env.example`.

### Decisões de arquitetura

- **D14 resolvida e testada:** `BrowserRouter` com fallback de 404, em vez de `HashRouter`. URLs limpas importam num projeto de portfólio. A decisão foi verificada em um simulador local do GitHub Pages — subcaminho e `404.html` com status 404 — e as quatro rotas testadas renderizaram a página correta, inclusive com mapa.

### Corrigido

- **`npm run preview` servia página em branco, sem erro no console.** O `vite preview` relê o `vite.config.ts` e não sabe com que `base` o build foi feito: servia os ativos em `/assets/` enquanto o HTML os pedia em `/saude-perto/assets/`. A variável precisa estar nos dois comandos.
- **Correção de um diagnóstico meu:** a primeira conclusão foi de que o preview funcionava, porque o `curl` devolvia HTTP 200 — eram 758 bytes, o tamanho do `404.html`, e não os 322 KB do bundle. Conferir o status não basta; é preciso conferir o tamanho ou o conteúdo. Registrado em `docs/deploy.md` §4 e `CLAUDE.md` §5.

### Verificação de segurança do build

Nenhum `.env`, chave ou segredo no `dist/`. O único acerto do padrão de busca foi a palavra "password" numa lista de tipos de `input` de biblioteca. Apenas os **nomes** das variáveis `VITE_*` aparecem no bundle, todos URLs públicos. O e-mail do autor não aparece. Nenhum CPF ou telefone real nos dados. A versionar: 96 arquivos, 880 KB, sem `node_modules` nem `dist`.

### Limitações e pendências

- **P14 (nova):** rotas válidas respondem HTTP 404 no GitHub Pages. É o custo conhecido do fallback de SPA; não afeta quem navega, mas pode afetar indexação.
- P1, P2, P3, P6, P11, P12 e P13 seguem abertas e documentadas.

### Não feito

**Nenhum commit, nenhum repositório remoto, nenhum push, nada publicado** — por decisão do usuário. `git rev-list --all --count` → 0. Nome do repositório definido: `saude-perto`.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 7)

**Fase 7 — Acessibilidade e testes automatizados. Concluída.**

### Adicionado

- **89 testes em 12 arquivos**, com Vitest e Testing Library. `npm run test` passa em ~6 s, de forma determinística.
- `src/test/setup.ts` que **substitui `fetch` por uma função que falha com mensagem explícita**: nenhum teste pode tocar a rede real.
- Scripts `test` e `test:watch` no `package.json`.
- Dois **testes de integridade**, que guardam compromissos de honestidade e não de estética: a confirmação nunca pode dizer "consulta confirmada" ou variantes; dado demonstrativo sempre tem de se declarar.

### Corrigido

1. **Mensagens de erro em inglês chegavam ao usuário.** Com campo `undefined`, o Zod emitia "Invalid input: expected string, received undefined" — as mensagens em português só cobriam `.min()`, não a checagem de tipo. Corrigido com o parâmetro `error` em cada campo. **Foi o primeiro teste escrito que pegou isso.**
2. **Violação da própria regra de contraste.** O item ativo da navegação usava amarelo sobre verde em texto de 18 px: 4,30:1 contra os 4,5:1 exigidos — exatamente o par que a pendência P9 restringia a texto grande. O texto ativo passou a `papel` (7,37:1) e o amarelo ficou só na marca, que é elemento não textual.
3. **Alvos de toque menores que 24 px** (WCAG 2.2, 2.5.8): links do rodapé e títulos dos cards de unidade.
4. `vite.config.ts` passou a importar `defineConfig` de `vitest/config`, para a chave `test` ser tipada.

### Auditoria de acessibilidade

Medida na tela renderizada, calculando contraste sobre as cores computadas com composição de alfa:

| Página | Elementos de texto | Falhas |
|---|---|---|
| `/unidades` | 77 | **0** |
| `/agendamento` com erros | 55 | **0** |

Borda de campo inválido em 6,16:1. Texto a 200% sem rolagem horizontal nem corte. Hierarquia de cabeçalhos, rótulos, marcos, `lang` e `title` conferidos em todas as páginas.

### Requisitos

**7 requisitos funcionais passaram a Testada** (RF03, RF04, RF10, RF11, RF12, RF14, RF15) e 3 não funcionais (RNF04, RNF10, RNF11).

### Limitações e pendências

- **P9 resolvida** (contraste do item ativo) e **P10 resolvida** (zero teste).
- **P13 (nova):** leitor de tela real nunca testado. É a lacuna que resta em RNF02.
- Dispositivo móvel real não testado. A verificação em 320 px desta fase não pôde ser refeita porque a janela do navegador parou de responder a redimensionamento; foi verificada visualmente nas Fases 3 e 4.
- P1, P2, P3, P11 e P12 seguem abertas.

### Não implementado

Build de publicação e decisão de roteamento em host estático (Fase 8). Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 6)

**Fase 6 — Agendamento demonstrativo. Concluída. Os 16 requisitos funcionais estão implementados.**

### Adicionado

- Esquema Zod do agendamento, **deliberadamente mínimo**: nome, contato, unidade, tipo de atendimento, data e período. **Nenhum CPF, cartão SUS, data de nascimento, sintoma ou diagnóstico** — dado de saúde é dado pessoal sensível pela LGPD e um exercício acadêmico não tem motivo para coletá-lo.
- Formulário (RF10) com o aviso "Isto não marca consulta de verdade" **antes do primeiro campo**.
- Validação acessível (RF11): `aria-invalid`, erro ligado por `aria-describedby`, ícone + texto + borda (nunca só cor), foco no primeiro campo inválido.
- Confirmação (RF12) cujo título é **"Nenhuma consulta foi agendada"**, com protocolo rotulado como simulado e foco movido para o `<h1>`.
- Acompanhamento (RF13): lista da sessão, cada item com situação "Não enviada — demonstração" e botão para apagar.
- `src/lib/resolverZod.ts`, resolver próprio de ~20 linhas.
- `src/components/formulario/Campo.tsx`, que padroniza rótulo, ajuda e erro acessíveis.

### Decisões de arquitetura

- **D15 — solicitações só em memória, nunca em `localStorage`.** O formulário coleta nome e contato; guardá-los no dispositivo deixaria dado pessoal legível por qualquer pessoa que use o aparelho, sem ganho algum. Resolve o ponto em aberto de `arquitetura.md` §11.
- **D16 — resolver Zod próprio.** `@hookform/resolvers@6` falhou com `ERESOLVE` (arrasta `@typeschema/main` e `effect`). Escrever o resolver evitou a dependência; `--legacy-peer-deps` foi descartado por mascarar conflito real.

### Corrigido

- **O foco não ia para o primeiro campo inválido.** Ao enviar vazio, o foco caía em `periodo` — o último campo com erro. Causa: o `shouldFocusError` do react-hook-form, ligado por padrão, usa a ordem interna de registro e sobrepunha o `setFocus` explícito. Desligado. Só foi detectado inspecionando `document.activeElement`, porque foco programático após clique de mouse não aciona `:focus-visible`.
- Quatro apontamentos de lint corrigidos na causa: `autocomplete` inválido, `aria-invalid` em papel `radio`, `role="status"` em `<div>` (trocado por `<output>`) e constantes de estilo extraídas para módulo próprio.

### Verificado no navegador

Fluxo completo exercitado. Varredura programática do texto da confirmação: **zero ocorrências** de "consulta confirmada", "agendamento realizado", "agendamento confirmado", "consulta marcada" ou "agendado com sucesso". Presentes: "nenhuma consulta foi agendada", "não foram enviados a nenhuma unidade de saúde" e "protocolo simulado". Foco verificado em `INPUT#nome` (envio inválido) e `H1` (envio válido).

### Requisitos

RF10, RF11, RF12, RF13 e RNF08 → **Implementada**. **16 de 16 requisitos funcionais implementados.**

**Nenhum requisito está Testado** — não há teste automatizado (P10), que é a Fase 7.

### Não implementado

Testes automatizados, auditoria de acessibilidade, build de publicação. Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 5)

**Fase 5 — Integração com dados públicos e mapa. Concluída.**

### Adicionado

- **Camada `src/services/`**, a única que faz rede: `http.ts` (timeout, `ResultadoRede<T>`, erro como valor e não exceção), `erros.ts` (tipos de `ErroApp` e tradução para português), `geocodificacao.ts` (Nominatim) e `unidades.ts` (Overpass).
- **Validação Zod na fronteira**: `schemas/nominatim.ts` e `schemas/overpass.ts`. Nada de API externa entra tipado por confiança.
- **Busca por localidade (RF02)**, disparada só no envio do formulário — a política do Nominatim limita a 1 req/s. Com cache de sessão.
- **Mapa interativo (RF06)** com Leaflet e react-leaflet, carregado sob demanda, com ícone SVG próprio e **atribuição ao OpenStreetMap visível**.
- **Fallback de RNF11**: dois espelhos com backoff; se ambos falharem, devolve os dados demonstrativos com `usouFallback: true` e a interface declara isso.
- Registro de sessão das unidades, para o detalhe funcionar com unidade vinda da busca.

### Dependências

`zod@4.6.7`, `leaflet@1.9.4`, `react-leaflet@5.0.0`, `@types/leaflet@1.9.22`. Zero vulnerabilidades.

### Reverificação das APIs

- **API do Ministério da Saúde: continua inacessível.** DNS resolve, porta 443 em timeout; `dados.gov.br` respondeu em 0,33 s na mesma sessão (controle).
- **Overpass: funciona, mas é intermitente.** A consulta de produção retornou **60 elementos, 29 com nome e coordenada** (ex.: "Hospital Unimed Recife", "Posto de Saúde de Casa Amarela"). Porém três espelhos independentes retornaram 502 "at capacity" simultaneamente, e **as 3 buscas feitas no navegador caíram no fallback**.

### Corrigido

- **Detalhe não encontrava unidade vinda da busca** — só olhava os dados demo. Criado registro de sessão.
- **Espera de ~60 s antes do fallback** — tempo limite reduzido de 30 s para 12 s por espelho, pior caso agora ~26 s.

### Requisitos

RF02, RF06, RF14 e RNF11 → **Implementada**. Total: **12 de 16 requisitos funcionais**.

**Nenhum requisito está Testado** — não há teste automatizado (P10).

### Limitações e pendências

- **P2 reclassificada:** de "sem validação" para **"intermitente"**, severidade alta. O fallback virou o caminho comum, não a exceção.
- **P3 ficou urgente:** com a Overpass instável, avaliar embutir extrato do CNES como fonte real e estável.
- **P11 (nova):** só 15 de 29 unidades do OSM trazem município; "Município não informado" aparece como opção no filtro. Limitação da fonte, não defeito.
- **P12 (nova):** busca pode levar ~26 s antes de cair no fallback.
- **Caminho de sucesso da Overpass nunca observado no navegador** — comprovado só via `curl`.

### Não implementado

Formulário de agendamento e acompanhamento de solicitações (Fase 6). Nenhum teste. Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 4)

**Fase 4 — Unidades, campanhas e conteúdo educativo. Concluída e verificada no navegador.**

### Adicionado

- Tipos `Unidade` e `Campanha`, sempre embrulhados em `ComOrigem<T>` (D7).
- Dados demonstrativos: 6 unidades fictícias e 6 temas de prevenção, todos com `origem: 'demonstrativo'`. Alguns campos propositalmente em `null`, para exercitar o caminho de "não informado".
- Lista de unidades com filtros de município, tipo e serviço (RF03, RF04), contagem anunciada por região live e estado vazio com ação de limpar.
- Página de detalhe da unidade (RF05), com estado de "não encontrado".
- Página de temas de prevenção com filtro por público (RF07).
- Primeiros socorros (RF08): 5 situações, cada uma com "o que fazer" e **"o que não fazer"**. Nenhuma manobra que exija treinamento é descrita, de propósito.
- Saúde mental (RF09): sinais de alerta, como ajudar alguém, onde procurar. **Sem questionário e sem teste**, deliberadamente.
- Componentes `FonteOficial` (só exibe link verificado) e `AvisoEmergencia`.
- **Divisão de código por rota** com `React.lazy` e `Suspense`: 15 pacotes JS; o inicial caiu de 336,10 kB para 322,12 kB e as páginas novas não pesam mais no carregamento inicial (P6).

### Verificado no navegador

Primeira inspeção visual do projeto, no Brave, em 1440×900, 1280×900 e 320×800. Console **sem erros nem avisos**. Confirmados funcionando: `SkipLink`, `Esc` fechando o menu e devolvendo o foco, anel de foco sobre a faixa verde, `aria-current`, 320 px sem rolagem horizontal, rota 404, filtros com estado vazio, "Não informado" para campo ausente, `<title>` por rota e o estado de `Suspense` entre rotas.

### Corrigido

Quatro defeitos que compilação e lint não pegariam, todos encontrados ao olhar a aplicação:

- **`EmConstrucao` estava sem `useTituloPagina`** — um script de edição da Fase 3 abortou antes de chegar ao arquivo e o resultado não foi conferido. Metade das rotas ficava com título genérico, violando RNF02.
- **Marcador do item ativo no menu mobile** lia como divisor entre itens; trocado por marca à esquerda.
- **Bairro aparecia rotulado como "Endereço"** no detalhe quando o endereço faltava; passaram a ser campos separados.
- **Indicador de carregamento colado na borda** da janela; alinhado ao container.

Dois avisos de lint resolvidos na causa: constantes de filtro extraídas para `filtros.ts`; `src/rotas.tsx` com override explícito de `react/only-export-components`, por ser manifesto de rotas e não módulo de componentes.

### Requisitos

RF03, RF04, RF05, RF07, RF08 e RF09 → **Implementada**. RNF01 e RNF03 → **Em desenvolvimento**.

**Nenhum requisito passou a Testado.** Verificação manual no navegador não é cobertura de teste.

### Limitações e pendências

- **P10 (nova, prioridade alta):** 39 arquivos de código e **zero teste automatizado**. Cada fase nova aumenta o risco de regressão silenciosa. Recomendado antecipar Vitest antes da Fase 5.
- **P8 resolvida:** a interface foi inspecionada no navegador.
- P1, P2, P3 (APIs) inalteradas — reverificação na Fase 5.

### Não implementado

Busca por API, mapa, formulário de agendamento e acompanhamento de solicitações. Nenhum teste. Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 3)

**Fase 3 — Design system, layout, navegação e página inicial. Concluída.**

### Adicionado

- **Direção visual definida e registrada** em `docs/arquitetura.md` §10: conceito "cartilha de saúde pública brasileira", com paleta de 6 valores, escala tipográfica, wireframe, princípios e revisão contra padrões genéricos de interface gerada.
- **Paleta com contraste medido:** 13 pares calculados. 12 passam o mínimo de 4,5:1; o par amarelo-sobre-verde mede 4,30:1 e ficou restrito a texto grande e componentes (pendência P9).
- Tokens de tema em `src/index.css`: paleta, mapeamento para os tokens do shadcn, variante escura coerente (sem alternador implementado), corpo base em 18 px, contorno de foco de 3 px e supressão de animação sob `prefers-reduced-motion`.
- `react-router-dom` 7.18.4 com `createBrowserRouter` e **12 rotas** em `src/rotas.tsx`.
- Casca de layout: `LayoutPrincipal` com marcos `header` / `main#conteudo` / `footer`, mais `SkipLink`, `Header`, `Nav` e `Footer`.
- Navegação responsiva (RF15): menu recolhido em telas estreitas, `aria-expanded`, `aria-controls`, foco movido para dentro ao abrir, `Esc` fechando e devolvendo o foco ao botão.
- Componentes de estado (RF14, parciais): `Carregando` (via `<output>`), `Erro` (`role="alert"` com ação de nova tentativa), `Vazio` e `SeloDadoDemo`.
- `src/types/dados.ts` com `OrigemDado` e `ComOrigem<T>` — materializa a decisão D7 no sistema de tipos.
- Página inicial (RF01): faixa principal com a pergunta do usuário, serviços, três temas de prevenção rotulados como demonstrativos, e uma seção declarando o que o site **não** faz.
- Páginas informativas (RF16): `Sobre`, `Privacidade`, `Acessibilidade` e 404, com conteúdo real. A de acessibilidade registra explicitamente o que **não** foi verificado.
- `useTituloPagina`: `<title>` único e descritivo por rota, aplicado em todas as páginas.
- `EmConstrucao`: rota navegável que declara em qual fase o conteúdo entra, em vez de prometer funcionalidade inexistente.

### Alterado

- **Fonte Geist substituída por Archivo.** A Geist era herança do preset `nova` do shadcn, não escolha: um grotesco neutro de software, sem relação com o assunto. `@fontsource-variable/geist` foi **desinstalado**.
- `src/App.tsx` passou a montar o roteador.
- `index.html` já estava com `lang="pt-BR"`; agora o título também muda por rota.

### Decisões de arquitetura

- **D13 — direção visual "cartilha de saúde pública".** Escolhida porque é ao mesmo tempo específica do assunto e funcionalmente correta para o público (pessoas idosas, baixa visão). Consequências vinculantes: nenhuma `box-shadow`, nenhum gradiente, raio só em elementos clicáveis, vermelho reservado a erro e emergência, e **alterar a paleta obriga a remedir o contraste**.
- **D14 — `createBrowserRouter`,** com a decisão entre fallback de 404 e `HashRouter` adiada para a Fase 8, quando o comportamento do GitHub Pages puder ser testado em vez de presumido.

### Corrigido

Quatro problemas apontados pelo lint, todos com a causa corrigida em vez de silenciados:

- `role="status"` em `<div>` → trocado por `<output>`, que tem o papel implícito.
- Constante `ITENS_NAV` convivendo com componente → movida para `itens-nav.ts`.
- `setState` dentro de efeito para fechar o menu → passou a fechar no `onClick` do link.
- `onKeyDown` em elemento não interativo → `Escape` passou a ser escutado no documento enquanto o menu está aberto.

Além disso, `aria-current={undefined}` no `NavLink` anularia o `aria-current="page"` automático — exatamente o critério de RF15. Corrigido antes do lint.

### Requisitos

- RF01, RF15 e RF16 → **Implementada**.
- RF14 e RNF04 → **Em desenvolvimento**.
- **Nenhum requisito passou a Testado.** Não existe teste automatizado e a interface nunca foi vista.

### Limitações e pendências

- **P8 (nova, prioridade alta):** a interface **nunca foi renderizada nem inspecionada**. Nenhum navegador está conectado à sessão e o ambiente de teste com DOM só chega na Fase 7. O que se verificou: compila, passa no lint, o texto das páginas está no bundle e o servidor responde nas 12 rotas. Isso **não** prova que a página monta em tempo de execução. Navegação por teclado, `Esc`, 320 px e foco visível estão implementados e **não comprovados**.
- **P9 (nova):** par amarelo-sobre-verde em 4,30:1, proibido para texto corrido.
- **P6 agravada:** o bundle foi de 256,86 kB para **336,10 kB** de JS (105,98 kB gzip), +79 kB, principalmente pelo roteador. Nenhuma rota é carregada de forma preguiçosa. Dividir com `React.lazy` virou tarefa da Fase 4.

### Não implementado

Busca por API, mapa, formulário de agendamento, acompanhamento de solicitações e o conteúdo das páginas de unidades, campanhas, primeiros socorros e saúde mental — todas essas rotas existem e exibem `EmConstrucao`. Nenhum teste. Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 2)

**Fase 2 — Configuração de React, TypeScript e Vite. Concluída e verificada.**

### Adicionado

- Projeto Vite com template `react-ts` (create-vite 9.3.1), nomeado `saude-perto`.
- Tailwind CSS 4.3.3 via `@tailwindcss/vite`; `src/index.css` reduzido a `@import "tailwindcss"` e depois expandido pelo shadcn com os tokens de tema.
- Alias `@/*` configurado em `vite.config.ts`, `tsconfig.json` e `tsconfig.app.json`, **verificado resolvendo em dev e no build**.
- shadcn/ui inicializado com base `radix` e preset `nova` (estilo `radix-nova`): instalou `radix-ui`, `lucide-react`, `class-variance-authority`, `cn`, `tw-animate-css` e `@fontsource-variable/geist`.
- `src/components/ui/button.tsx` adicionado pela CLI e consumido em `App.tsx` via alias.
- `.gitignore` estendido com `.env`, `.env.*`, `!.env.example` e `coverage`.
- `.env.example` documentando as três URLs públicas de API, **sem nenhum segredo**.
- Repositório git local (`git init`), branch renomeada para `main`. **Nenhum commit.**
- Plugin `frontend-design@claude-plugins-official` instalado no Claude Code (escopo user), com autorização do usuário.

### Alterado

- `index.html`: `lang="en"` → **`lang="pt-BR"`**, título e meta description do projeto (requisito de RNF02).
- `tsconfig.app.json`: adicionados `strict: true` e `noUncheckedIndexedAccess: true` — o template **não** os traz, e RNF09 os exige.
- `vite.config.ts`: `__dirname` → `import.meta.dirname`, eliminando aviso de incompatibilidade futura do Vite.
- `.oxlintrc.json`: habilitado o plugin **`jsx-a11y`** e a categoria `correctness` como erro; regra `react/only-export-components` desligada em `src/components/ui/**` (arquivos gerados, não autorais).
- Removidos os ativos de exemplo do template (`src/App.css`, `src/assets/`).

### Decisões de arquitetura

- **D10 — `oxlint` em vez de ESLint.** O planejamento previa ESLint, mas o template oficial do Vite deixou de gerar sua configuração. O fator decisivo para manter o oxlint foi verificar que ele tem plugin `jsx-a11y`, cobrindo o lint de acessibilidade exigido por RNF02. **Substitui a previsão de ESLint.**
- **D11 — base `radix` e preset `nova` no shadcn/ui.** A CLI 4.22.1 passou a oferecer três bases; `radix` é a coerente com D3, cuja justificativa é acessibilidade de origem.
- **D12 — `strict` manual e alias sem `baseUrl`.** O TypeScript 6.0.3 deprecou `baseUrl`; o build falhou com `TS5101` até sua remoção. O alias usa apenas `paths`.
- **D9 atualizada** — plugin `frontend-design` passou de "pendente de autorização" para instalado.

### Corrigido

- Build falhava com `error TS5101: Option 'baseUrl' is deprecated`. Resolvido removendo `baseUrl` de ambos os tsconfig.

### Limitações e pendências

- **P6 (nova):** o bundle do scaffold já pesa 256,86 kB de JS (83,56 kB gzip) antes de qualquer funcionalidade. Relevante para RNF05, sobretudo com o Leaflet ainda por entrar.
- **P7 (nova):** duas armadilhas de configuração registradas para não se repetirem — ausência de `strict` no template e a depreciação de `baseUrl`.
- **P4 original resolvida:** repositório git inicializado. `gh` segue ausente (P4 reformulada).
- **P5 resolvida:** plugin `frontend-design` instalado.
- P1, P2 e P3 (APIs) permanecem inalteradas.

### Não implementado

Nenhuma página, componente de domínio, rota, serviço, hook, tipo, esquema de validação ou dado demonstrativo. `src/App.tsx` contém apenas uma tela de verificação de ambiente. **Nenhum teste existe** — Vitest não está instalado. Nenhum commit, push ou publicação.

---

## [Não publicado] — Sessão de 2026-10-23 (parte 1)

**Fase 1 — Planejamento, requisitos e criação da memória do projeto.**

### Adicionado

- Estrutura de documentação e memória persistente do projeto:
  - `CLAUDE.md` — instruções permanentes, protocolos de início e encerramento de sessão, regras de arquitetura, segurança e autorização.
  - `README.md` — documentação pública com contexto acadêmico, objetivos, funcionalidades por status, limitações e atribuições.
  - `docs/PROJECT_MEMORY.md` — memória operacional (seções A–I).
  - `docs/CHANGELOG.md` — este arquivo.
  - `docs/requisitos.md` — 16 requisitos funcionais e 12 não funcionais, com critérios verificáveis.
  - `docs/arquitetura.md` — camadas, fluxo de dados, convenções de código e padrões.
  - `docs/apis.md` — investigação de APIs com resultado real dos testes.
  - `docs/testes.md` — estratégia de testes (nenhum teste existe ainda).
  - `docs/deploy.md` — plano de build e publicação em GitHub Pages.

### Decisões de arquitetura

- **D1** React 19 + TypeScript + Vite 8 como base. Next.js descartado por desnecessidade de SSR e atrito com host estático.
- **D2** Tailwind CSS 4 via `@tailwindcss/vite`, sem `tailwind.config.js` — método oficial atual.
- **D3** shadcn/ui (sobre Radix UI) como base de componentes, escolhido pela acessibilidade de origem.
- **D4** `motion` como biblioteca de animação; **GSAP descartado** por licença proprietária da Webflow e redundância.
- **D5** Leaflet + React Leaflet com tiles do OpenStreetMap; Google Maps e Mapbox descartados por exigirem chave de API em frontend público.
- **D6** OpenStreetMap (Overpass API) como fonte real de unidades de saúde, em substituição à API do Ministério da Saúde.
- **D7** Separação explícita entre dado real e demonstrativo, modelada nos tipos desde o início.
- **D8** Sem gerenciador de estado global; reavaliar TanStack Query na Fase 5 se o cache de rede ficar complexo.

### Requisitos

- Definidos RF01–RF16 (funcionais) e RNF01–RNF12 (não funcionais). Todos no estado **Planejada**.
- Meta de acessibilidade fixada em **WCAG 2.2 nível AA**, com critérios verificáveis individualmente.

### Limitações introduzidas (descobertas na investigação)

- **A API de Dados Abertos do Ministério da Saúde está inacessível.** DNS resolve, mas as portas 80 e 443 não completam conexão; `ECONNREFUSED` confirmado de uma segunda rede independente. Elimina a fonte oficial de dados do CNES. Registrado como pendência **P1**.
- **A Overpass API pública estava sobrecarregada** (HTTP 502 "at capacity") durante os testes. O CORS liberado foi confirmado nos headers, mas a consulta nunca retornou dados reais. Registrado como **P2**.
- **A API do `dados.gov.br` exige autenticação** (HTTP 401) e foi descartada: chave de API em frontend público é inviável.
- Conteúdo de campanhas, primeiros socorros e saúde mental não tem API pública confiável — será conteúdo editorial com fonte citada, nunca dado institucional inventado.

### Verificado com sucesso

- **Nominatim** (geocodificação): HTTP 200 com `access-control-allow-origin: *`.
- **Tiles do OpenStreetMap**: HTTP 200, `image/png`.
- Ambiente local: Node v24.15.0, npm 11.12.1, Git 2.43.0. `gh` e `pnpm` ausentes.

### Não alterado

- `TXT.txt` — anotações pré-existentes do usuário, preservadas.

### Nada implementado em código

Não foi criado `package.json`, `src/`, configuração de build ou qualquer componente. Nenhuma dependência foi instalada. Nenhum comando `npm` foi executado. Nenhum teste existe. Nenhum commit foi feito — o diretório ainda não é um repositório git.

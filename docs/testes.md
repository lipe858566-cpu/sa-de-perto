# Testes — Saúde Perto

Estratégia, ferramentas e **resultados reais** de teste.

**Última atualização:** 2026-10-23

> ## ✅ Estado atual
>
> **105 testes em 14 arquivos, todos passando.** `npm run test` → exit 0, determinístico, ~7 s.
>
> **Nenhum teste toca a rede.** `src/test/setup.ts` substitui `fetch` por uma função que falha com mensagem explícita se algum teste tentar sair para a internet.
>
> O que **não** está coberto: leitor de tela real (P13), dispositivo móvel real, e o caminho de sucesso da Overpass na interface (P2).
>
> ### ⚠️ A suíte exige Node 22.12 ou superior
>
> O jsdom 30 traz um `undici` que chama `zlib.createZstdDecompress`, API que só existe a partir do Node 22. **No Node 20 os workers do Vitest morrem ao carregar e nenhum teste roda** — a saída mostra `12 errors`, `no tests`, e não uma falha de asserção. O `vitest` declara a exigência em `engines`: `^22.12.0 || ^24.0.0 || >=26.0.0`.
>
> Por isso o repositório fixa `engines.node` em `package.json`, `.nvmrc` com `24` e `node-version: '24'` no workflow. **Não baixar a versão do Node no CI.** Foi exatamente essa a causa da primeira falha de publicação; ver `docs/CHANGELOG.md`.
>
> ### ⚠️ Tempo limite dos testes
>
> `vite.config.ts` define `testTimeout: 20_000`, acima dos 5 s padrão do Vitest. Não é folga arbitrária: vários testes exercitam **espera real do código de produção** — o limite de 1 requisição por segundo do Nominatim e o backoff de 1,5 s entre os espelhos da Overpass. O caso mais lento ("declara quando a lista veio do fallback") leva ~2,6 s numa máquina de desenvolvimento, e o runner do CI é mais lento.
>
> A folga é prudente, mas **não era a causa da falha no CI** — essa atribuição, registrada antes, estava errada. Ao mexer nos tempos de espera dos serviços, reavalie este valor.

## 1. Ferramentas previstas

| Ferramenta | Versão candidata | Finalidade |
|---|---|---|
| Vitest | **5.0.5** | Executor de testes, integrado ao Vite |
| @testing-library/react | **16.3.3** | Renderização e consulta de componentes |
| @testing-library/user-event | **14.6.8** | Simulação realista de interação |
| @testing-library/jest-dom | **7.0.1** | Asserções sobre o DOM |
| jsdom | **30.1.3** | Ambiente DOM para os testes |
| oxlint (plugin jsx-a11y) | **1.89.0** | Lint de acessibilidade |

**Todas instaladas e em uso.** `axe-core` foi dispensado: a auditoria de acessibilidade foi feita medindo o DOM e as cores computadas diretamente no navegador, o que cobriu contraste com composição de alfa, hierarquia de cabeçalhos, rótulos, marcos, alvos de toque e redimensionamento de texto.

### Já instalado e funcionando

| Ferramenta | Versão real | Papel |
|---|---|---|
| `oxlint` | 1.89.0 | Lint, com plugin **`jsx-a11y`** habilitado |

O plugin `jsx-a11y` foi **verificado disparando**: um arquivo-sonda com `<img>` sem `alt` produziu `error jsx-a11y(alt-text)` e exit 1; a sonda foi removida em seguida. Isso dá uma rede de segurança contínua para parte de RNF02, mas **não substitui** a verificação manual descrita em §2.4.

## 2. Níveis de teste

### 2.1 Unitários

**Alvo:** funções puras de `src/lib/`, esquemas Zod de `src/schemas/`, normalização de dados em `src/services/`.

**Prioridade alta** — os esquemas Zod são a fronteira de confiança da aplicação (`docs/arquitetura.md` §4, regra 6). Se a validação falha, dado malformado de API externa entra no app.

Cada esquema deve ter, no mínimo:
- Um caso válido que passa.
- Um caso inválido por campo obrigatório ausente.
- Um caso inválido por tipo incorreto.
- Um caso de resposta parcial (campo opcional ausente), que deve passar.

### 2.2 Componentes

**Alvo:** componentes de `src/components/`.

Regras:
- Consultar por **papel e rótulo acessível** (`getByRole`, `getByLabelText`, `getByText`), **nunca** por classe CSS ou `data-testid` sem necessidade. Isso faz o teste verificar acessibilidade junto com comportamento (RNF10).
- Testar comportamento observável pela pessoa, não implementação interna.
- Interação via `user-event`, não `fireEvent`, por ser mais próximo do uso real.

Componentes com prioridade de cobertura:
- `SeloDadoDemo` — garantir que o rótulo de dado demonstrativo aparece quando `origem: 'demonstrativo'` (D7 é um compromisso de honestidade; precisa de teste).
- `Carregando`, `Erro`, `Vazio` — os três estados de RF14.
- `UnidadeCard` — exibição de campo ausente como "não informado", nunca `undefined`.
- Navegação — `aria-expanded`, `aria-current` e fechamento por `Esc` (RF15).

### 2.3 Integração de fluxos

**Alvo:** os fluxos completos, com a camada de rede **simulada**.

A simulação é possível porque toda rede está isolada em `src/services/` (`docs/arquitetura.md` §4, regra 1). Os serviços são substituídos nos testes; nenhum teste toca a internet.

Fluxos a cobrir:

| Fluxo | Requisitos | Casos mínimos |
|---|---|---|
| Busca de unidades | RF02, RF03, RF14 | sucesso com resultados; sucesso sem resultados (estado vazio); falha de rede (estado de erro + nova tentativa); fallback para dado demonstrativo com selo visível |
| Filtros | RF04 | filtro reduz a lista; combinação sem resultado mostra estado vazio; limpar filtros restaura |
| Formulário de agendamento | RF10, RF11, RF12 | submit vazio mostra erros e move o foco para o primeiro inválido; dado inválido por campo; submit válido mostra confirmação **declarando que nada foi agendado** |
| Detalhes da unidade | RF05 | identificador existente; identificador inexistente leva a "não encontrado" |

**Teste obrigatório de honestidade:** o fluxo de confirmação (RF12) deve ter um teste que verifica que a tela **não** contém texto como "consulta confirmada" ou "agendamento realizado", e **contém** o aviso de caráter demonstrativo. Esse é um requisito de integridade do projeto, não de estética.

### 2.4 Acessibilidade

**Medido no navegador em 2026-10-23**, calculando contraste sobre as cores computadas com composição de alfa:

| Página | Elementos de texto | Falhas |
|---|---|---|
| `/unidades` | 77 | **0** |
| `/agendamento` com erros exibidos | 55 | **0** |

Borda de campo inválido: **6,16:1** (mínimo de 3:1 para componente não textual).
Texto a 200%: sem rolagem horizontal e sem corte.

**Automatizado em cada commit:** `oxlint` com o plugin `jsx-a11y`.

**Manual e obrigatório** — ferramenta automatizada detecta uma fração dos problemas reais, então a verificação manual não é opcional:

| Verificação | Como |
|---|---|
| Navegação só por teclado | Tab por toda a página; todo controle alcançável e acionável; sem armadilha de foco |
| Ordem de foco | Segue a ordem visual |
| Foco visível | Contorno perceptível em todo elemento focável |
| Leitor de tela | Percorrer os fluxos principais com leitor de tela; verificar rótulos, erros e anúncios de estado |
| Hierarquia de cabeçalhos | Sem salto de nível; um `<h1>` por página |
| Contraste | Medir pares de cor do tema contra os mínimos de RNF04 |
| Zoom 200% | Conteúdo utilizável sem rolagem horizontal |
| `prefers-reduced-motion` | Animações suprimidas quando ativado |

### 2.5 Responsividade

Verificação manual nas larguras **320, 375, 768, 1024 e 1440 px** (RNF01): sem rolagem horizontal, sem conteúdo cortado ou sobreposto, alvos de toque ≥ 24×24 px.

### 2.6 Links e rotas

- Toda rota declarada responde.
- Nenhum link interno aponta para rota inexistente.
- Caminho desconhecido cai na página 404 (RF16).
- Recarregar uma URL profunda funciona no ambiente de publicação — ver `docs/deploy.md`, é o ponto de falha clássico de SPA em host estático.

## 3. O que não será testado

| Item | Por quê |
|---|---|
| APIs externas reais em teste automatizado | Teste dependente de rede é instável e abusa de serviço público de uso justo. A rede é simulada. |
| Renderização interna do Leaflet | É biblioteca de terceiros com seus próprios testes. Testa-se a integração, não o mapa. |
| Primitivos do shadcn/ui sem customização | Vêm testados na origem. Testa-se o que o projeto compôs. |
| Cobertura percentual como meta | Cobrir os fluxos que importam vale mais que um número. Nenhuma meta artificial de porcentagem. |

## 4. Resultados reais de execução

| Data | Comando | Resultado |
|---|---|---|
| 2026-10-23 | `npm run test` | ✅ **89 passed (89)**, 12 arquivos, exit 0 |
| 2026-10-23 | `npm run test` (após `ErroDeRota`) | ✅ **105 passed (105)**, 14 arquivos, exit 0, ~7 s |
| 2026-10-23 | mesma suíte em **Node 20** | ❌ **12 errors, no tests** — jsdom/undici exige Node ≥ 22 (ver aviso no topo) |

### Cobertura por arquivo

| Arquivo | Cobre |
|---|---|
| `schemas/agendamento.test.ts` | validação do formulário; **pegou mensagens de erro em inglês chegando ao usuário** |
| `schemas/nominatim.test.ts` | coerção de lat/lon de string para número |
| `schemas/overpass.test.ts` | elementos incompletos, `way` com `center`, tags desconhecidas |
| `services/http.test.ts` | classificação de erro, tradução sem jargão |
| `services/unidades.test.ts` | mapeamento do OSM e **fallback de RNF11** |
| `pages/Agendamento.test.tsx` | aviso, coleta mínima, validação, **foco no primeiro inválido** |
| `pages/ConfirmacaoSolicitacao.test.tsx` | **honestidade da mensagem (RF12)** |
| `pages/Unidades.test.tsx` | três estados de RF14, filtros, fallback declarado |
| `components/layout/Nav.test.tsx` | `aria-expanded`, `Esc`, retorno de foco, `aria-current` |
| `components/layout/SkipLink.test.tsx` | primeiro elemento focável |
| `components/estados/SeloDadoDemo.test.tsx` | decisão D7 na tela |
| `components/unidades/UnidadeCard.test.tsx` | "Não informado" para campo ausente |
| `lib/versaoDesatualizada.test.ts` | reconhecimento das 4 mensagens de navegador; trava de recarga única |
| `components/estados/ErroDeRota.test.tsx` | recarga única após publicação nova; **a tela de depuração do React Router nunca aparece** |

### Os dois testes de integridade

Não são testes de estética. Guardam compromissos que, se quebrados, fazem a aplicação **mentir sobre saúde**:

1. **`ConfirmacaoSolicitacao`** — assere que a tela nunca contenha "consulta confirmada", "agendamento realizado" e seis variantes. Se alguém mexer nessa tela e escrever isso, a pessoa pode acreditar que tem consulta marcada e não aparecer na unidade.
2. **`SeloDadoDemo`** — assere que dado demonstrativo sempre se declare. Sem isso, dado inventado passa a parecer informação real de saúde.

### Validação do teste de regressão

O teste de foco de RF11 foi conferido contra o bug real: religando `shouldFocusError` no componente, a suíte **falha**; desligando, passa. Não é teste de fachada.

Para registro, as verificações que **não** são teste mas já rodam:

| Data | Comando | Resultado |
|---|---|---|
| 2026-10-23 | `npm run lint` | exit 0, zero avisos |
| 2026-10-23 | `npm run lint` (com sonda de violação a11y) | `error jsx-a11y(alt-text)`, exit 1 — regra confirmada ativa |
| 2026-10-23 | `npm run build` | exit 0, 2040 módulos, 290 ms |

> Esta tabela é preenchida a cada sessão em que testes forem executados, com a saída real. A mesma informação é espelhada em `docs/PROJECT_MEMORY.md` §H.

## 5. Critérios para considerar um requisito "Testado"

Em `docs/requisitos.md` e `docs/PROJECT_MEMORY.md` §E, um requisito só passa ao estado **Testada** quando:

1. Existe teste automatizado cobrindo seus critérios de aceitação **e ele passa**; ou
2. É um critério não automatizável (contraste, leitor de tela, responsividade) e a verificação manual está **registrada com data e resultado** em `docs/PROJECT_MEMORY.md` §H.

**Código escrito, mesmo funcionando na tela, significa "Implementada" — não "Testada".**

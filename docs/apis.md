# APIs e integrações — Saúde Perto

Registro da investigação de APIs, com **resultado real dos testes** e data de verificação.

**Última verificação geral:** 2026-10-23 (reverificado na Fase 5)

> **Regra deste documento:** nada aqui é presumido. Cada linha de "resultado" corresponde a um comando efetivamente executado. Endpoint não testado é marcado como **não verificado** — nunca como funcional.
>
> ⚠️ **Nunca registrar tokens, senhas, chaves ou segredos neste arquivo.** Nenhuma API adotada exige credencial, e isso é um critério de seleção, não coincidência (ver `CLAUDE.md` §8).

---

## 0. Resumo do estado

| Fonte | Finalidade | CORS | Autenticação | Estado |
|---|---|---|---|---|
| Nominatim | Geocodificação | ✅ `*` | Não | ✅ **Verificada e funcional** |
| Tiles OpenStreetMap | Camada base do mapa | n/d (imagem) | Não | ✅ **Verificada e funcional** |
| Overpass API | Unidades de saúde | ✅ `*` | Não | ⚠️ **Funciona, mas intermitente** — ver §2 |
| API Dados Abertos — Ministério da Saúde | Estabelecimentos (CNES) | não verificável | não verificável | ❌ **Inacessível** |
| API dados.gov.br | Catálogo de dados abertos | não verificável | **Sim** | ❌ **Descartada** |

---

## 1. API de Dados Abertos do Ministério da Saúde

- **Fonte:** `https://apidadosabertos.saude.gov.br/`
- **Finalidade pretendida:** obter estabelecimentos de saúde do CNES com dados oficiais — seria a integração mais relevante do projeto no mérito acadêmico.
- **Endpoint efetivamente utilizado:** **nenhum.** O serviço não respondeu.
- **Formato dos dados:** não verificado.
- **Autenticação:** não verificada.
- **Limites e restrições:** não verificados.
- **CORS:** não verificável.

### Resultado dos testes (2026-10-23)

> **Reverificado na Fase 5, em 2026-10-23: continua inacessível.** DNS resolve, porta 443 em timeout, `dados.gov.br` respondeu HTTP 200 em 0,33 s na mesma sessão (controle de rede). Sem mudança.

| Teste | Resultado |
|---|---|
| Resolução DNS | ✅ resolve para `189.28.130.6` |
| `curl https://apidadosabertos.saude.gov.br/` (timeout 20 s) | HTTP `000`, `connect=0.000000s`, `total=20.003253s` — conexão nunca estabelecida |
| Conexão TCP direta à porta 443 | timeout, inacessível |
| Conexão TCP direta à porta 80 | timeout, inacessível |
| `/v3/api-docs` | HTTP `000` |
| `/swagger-ui/index.html` | HTTP `000` |
| `/openapi.json` | HTTP `000` |
| `/v2/api-docs` | HTTP `000` |
| `/api-docs` | HTTP `000` |
| Requisição a partir de **segunda rede independente** | `connect ECONNREFUSED 189.28.130.6:443` |

**Controle de sanidade** (para descartar problema na rede local): `https://dados.gov.br/` respondeu HTTP 200 em 0,37 s e `https://github.com` respondeu HTTP 200 na mesma sessão. **O problema é do serviço, não da nossa rede.**

### Conclusão

O serviço está **fora do ar ou bloqueado** para acesso externo. Como a indisponibilidade foi confirmada de duas redes independentes, não é possível documentar endpoints, parâmetros ou formatos — e **não serão inventados**.

- **Fallback:** nenhum implementado ainda. Estratégia prevista em D6: usar a Overpass API e, se necessário, dados demonstrativos rotulados.
- **Pendência:** P1 em `docs/PROJECT_MEMORY.md` §G.
- **Próxima ação:** reverificar no início da Fase 5. Se persistir, registrar como limitação permanente no `README.md`.

---

## 2. Overpass API (OpenStreetMap)

- **Fonte:** `https://overpass-api.de/api/interpreter`
- **Finalidade:** buscar estabelecimentos de saúde reais dentro de uma área geográfica.
- **Endpoint previsto:** `POST` com o corpo `data=<consulta em Overpass QL>`, codificado como formulário.
- **Formato dos dados:** JSON, quando a consulta declara `[out:json]`.
- **Autenticação:** nenhuma.

### Consulta planejada

```
[out:json][timeout:25];
node["amenity"~"^(hospital|clinic|doctors)$"](<sul>,<oeste>,<norte>,<leste>);
out body 50;
```

A caixa geográfica é derivada das coordenadas devolvidas pelo Nominatim (§3).

### Limites e restrições conhecidos

- Serviço público de **uso justo**, sem SLA e sem garantia de disponibilidade.
- **Exige `User-Agent` identificável.** Requisição sem ele retornou **HTTP 406**.
- O próprio servidor orienta **retentativa com backoff exponencial** quando está sobrecarregado.
- Há espelhos alternativos (por exemplo `overpass.kumi.systems`), ainda não validados.

### Resultado dos testes (2026-10-23)

| Teste | Resultado |
|---|---|
| `POST` sem `User-Agent` | **HTTP 406** — requisição recusada |
| `POST` com `User-Agent` identificável | **HTTP 502** — "This Overpass API server is currently at capacity. All query workers are busy and the request queue is full." |
| Headers CORS na resposta | ✅ **`access-control-allow-origin: *`** |
| Retorno de dados reais | ❌ **não obtido** — nenhuma consulta completou |
| Espelho `overpass.kumi.systems` | ❌ sem resposta utilizável no teste |

### Reverificação na Fase 5 (2026-10-23)

**A API funciona — e retornou dados reais.** A consulta de produção do projeto, na região de Recife, devolveu:

| Métrica | Valor |
|---|---|
| Elementos retornados | 60 |
| Com `name` (os únicos aproveitáveis) | **29** |
| Com coordenada | 29 de 29 |
| Com `addr:street` | 22 de 29 |
| Com `addr:city` | **15 de 29** |
| Distribuição | 18 `clinic`, 6 `hospital`, 3 `doctors`, 2 `dentist` |

Exemplos reais obtidos: "Hospital Unimed Recife", "Posto de Saúde de Casa Amarela", "Clínica Pepita Duran".

**Porém o serviço é intermitente.** No mesmo dia, em dezenas de tentativas:

- Consulta mínima (1 nó, área pequena): HTTP 200 na primeira tentativa.
- Consulta de produção: HTTP 502 "at capacity" na maioria das tentativas, 200 na segunda rodada de uma sequência com backoff.
- Três espelhos independentes (`overpass-api.de`, `overpass.kumi.systems`, `overpass.private.coffee`) retornaram 502 **ao mesmo tempo**.
- Nas três buscas feitas pelo navegador durante a verificação, **todas caíram no fallback**.

### Consequências para o projeto

1. **O fallback não é opcional, é o caminho comum.** `src/services/unidades.ts` tenta dois espelhos com backoff de 1,5 s e tempo limite de 12 s cada; se ambos falharem, devolve os dados demonstrativos com `usouFallback: true`, e a interface **é obrigada** a dizer isso ao usuário.
2. **Só 15 de 29 unidades trazem município.** O serviço mapeia a ausência para `"Município não informado"`, que aparece como opção real no filtro. É uma limitação da fonte, não um defeito.
3. **Elementos sem `name` são descartados** — uma unidade sem nome não ajuda quem procura atendimento.
4. **A espera pode chegar a ~26 s** no pior caso. A interface anuncia a etapa ("Localizando o endereço…" / "Procurando unidades na região…").

- **Pendência:** P2 reclassificada — não é mais "sem validação", é "intermitente". Reforça **P3**.
- **Última verificação:** 2026-10-23

---

## 3. Nominatim (OpenStreetMap)

- **Fonte:** `https://nominatim.openstreetmap.org/search`
- **Finalidade:** converter o texto digitado pela pessoa (município, bairro, endereço) em coordenadas, para então consultar a Overpass.
- **Endpoint efetivamente utilizado:** `GET /search?q=<consulta>&format=json&limit=<n>`
- **Autenticação:** nenhuma.

### Formato dos dados

Array JSON. Campos relevantes por item: `display_name` (texto), `lat` (string), `lon` (string). A conversão para número e a validação ocorrem no esquema Zod `schemas/nominatim.ts`.

### Limites e restrições conhecidos

- **Máximo de 1 requisição por segundo.**
- Identificação do cliente é **obrigatória** pela política de uso. Em código de navegador o `User-Agent` não pode ser definido por JavaScript, então a identificação se dá pelo cabeçalho `Referer` enviado automaticamente.
- Uso pesado ou automatizado em volume é **proibido** pela política. O uso aqui é acadêmico, pontual e disparado por ação da pessoa.
- Sem SLA.

### Resultado dos testes (2026-10-23)

| Teste | Resultado |
|---|---|
| `GET /search?q=Recife%2C+PE&format=json&limit=2` | ✅ **HTTP 200** |
| Headers CORS | ✅ **`access-control-allow-origin: *`** |
| Conteúdo retornado | ✅ `Recife, Pernambuco, Região Nordeste, Brasil` — `lat -8.0584933`, `lon -34.8848193` |

### Conclusão

**Funcional e adequada.** É a única integração do projeto com funcionamento comprovado de ponta a ponta nesta data.

- **Fallback:** nenhum implementado ainda. Previsto: lista local de municípios de referência, para a busca não ficar inoperante se o serviço falhar.
- **Cuidados obrigatórios na implementação:** disparar apenas no submit (ou com debounce generoso) para respeitar o limite de 1 req/s; cachear na sessão a consulta já resolvida.

---

## 4. Tiles do OpenStreetMap

- **Fonte:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Finalidade:** camada base de imagens do mapa (RF06).
- **Formato:** PNG, 256×256.
- **Autenticação:** nenhuma.

### Limites e restrições conhecidos

Regidos pela **Tile Usage Policy** da OpenStreetMap Foundation:
- **Atribuição obrigatória e visível** no mapa: "© OpenStreetMap contributors".
- Uso pesado, pré-carregamento em massa e aplicações de alto tráfego são **proibidos**.
- Sem SLA.
- Dados sob licença **ODbL**.

### Resultado dos testes (2026-10-23)

| Teste | Resultado |
|---|---|
| `GET /12/1575/2177.png` | ✅ **HTTP 200**, `content-type: image/png` |

### Conclusão

**Funcional.** A atribuição é requisito legal, não opcional, e será renderizada pelo componente de mapa — critério de aceitação de RF06.

---

## 5. API do dados.gov.br — descartada

- **Fonte:** `https://dados.gov.br/api/publico/conjuntos-dados`
- **Finalidade pretendida:** localizar conjuntos de dados do CNES como alternativa à API do Ministério da Saúde.

### Resultado dos testes (2026-10-23)

| Teste | Resultado |
|---|---|
| `GET /api/publico/conjuntos-dados?nomeConjuntoDados=CNES` | **HTTP 401** — exige autenticação |

### Conclusão

**Descartada.** A API exige chave de acesso. Em uma aplicação frontend sem backend, qualquer chave ficaria exposta no código público, violando `CLAUDE.md` §8 e RNF07.

Isso **não** descarta o portal como fonte: os arquivos de dados abertos publicados lá podem ser baixados manualmente e um extrato reduzido pode ser embutido no repositório, com a data de extração declarada. É o plano B registrado como P3.

---

## 6. Conteúdo sem API disponível

| Conteúdo | Requisito | Situação |
|---|---|---|
| Campanhas de saúde preventiva | RF07 | Sem API pública confiável identificada |
| Primeiros socorros | RF08 | Sem API — é conteúdo editorial por natureza |
| Saúde mental | RF09 | Sem API — é conteúdo editorial por natureza |

### Como será tratado

Conteúdo **editorial**, com `origem: 'editorial'` (ver `docs/arquitetura.md` §6), redigido a partir de fontes oficiais e com **a fonte citada em cada página**.

**Proibições explícitas:**
- Não inventar campanhas vigentes, períodos de vacinação, metas ou públicos-alvo.
- Não inventar estatísticas, percentuais ou números de atendimento.
- Não atribuir a órgãos públicos textos que eles não publicaram.
- Campanha ou dado sem fonte verificável **não é publicado** — a seção fica vazia com explicação, o que é preferível a informação falsa em contexto de saúde.

Telefones de emergência a apresentar (RF08, RF09), por serem informação pública estável e crítica: **192 (SAMU)** e **188 (CVV)**. Devem ser conferidos antes da publicação.

---

## 7. Checklist obrigatório antes de adotar qualquer nova API

Antes de escrever qualquer serviço de integração, verificar e registrar neste documento:

- [ ] A URL base responde, e com qual código HTTP
- [ ] O endpoint específico existe e devolve o formato esperado
- [ ] **CORS está liberado para origem de navegador** — sem isso, a API é inviável aqui
- [ ] Autenticação é exigida? Se sim, **a API está descartada** (não há onde guardar segredo)
- [ ] Limite de requisições e política de uso justo
- [ ] Exigência de `User-Agent`, `Referer` ou atribuição
- [ ] Licença dos dados e obrigação de crédito
- [ ] Comportamento em caso de erro (código e corpo da resposta)
- [ ] Fallback definido **antes** de a integração entrar no código
- [ ] Data da verificação registrada aqui e em `docs/PROJECT_MEMORY.md` §F

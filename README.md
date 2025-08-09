# Desafio Beuni — Monorepo Full Stack (API Core, Simulation, Birthday Check e Client)

Este repositório contém um monorepo configurado com pnpm workspaces para um MVP de gerenciamento automático de brindes a colaboradores aniversariantes. O foco foi escalabilidade, resiliência, tipagem consistente e boa DX (developer experience).

A stack inclui: Node.js 20, TypeScript em todos os workspaces, Fastify para APIs, PostgreSQL com Prisma ORM, Redis com BullMQ para filas, e um client React (Vite). A comunicação entre serviços é feita por fila (Redis/BullMQ) e HTTP.

Observação: este projeto foi preparado para desenvolvimento local (pnpm dev e Docker para infraestrutura). Dockerfiles individuais dos apps podem ser adicionados/revisados futuramente.

## Requisitos

- Node.js 20.12.2
- pnpm 9.x
- Docker e Docker Compose (para infraestrutura: PostgreSQL e Redis)
- Git (opcionalmente, Husky para hooks)

## Arquitetura e Fluxo

- api-core (app/api-core): API principal. Exposta na porta 3001.
  - Fornece health check.
  - Consome jobs da fila via BullMQ Worker.
  - Se integra por HTTP com a api-simulation (POST /ship).
  - Usa Prisma para acessar o Postgres.

- api-simulation (app/api-simulation): API simuladora de um provedor de logística/envio. Exposta na porta 3002.
  - Endpoint POST /ship que valida payload com Zod, simula envio e retorna trackingId.
  - Pode simular erro com simulateError=true.

- birthday-check (services/birthday-check): Serviço de verificação/agendamento de aniversariantes.
  - Produz jobs na fila (Redis) em intervalos (ex.: a cada 10s).
  - Payload do job contém informações mínimas (ex.: now, com possibilidade de evolução para orgId/employeeId).
  - Por padrão, este serviço não consome a fila (quem consome é a api-core), mas pode ter um worker local para debug.

- packages/prisma (packages/prisma): Pacote compartilhado com schema.prisma, scripts Prisma e client gerado.
  - Centraliza migrations e generate para todo o monorepo.

- Client (app/client): aplicação React com Vite (TypeScript) para consumir endpoints da api-core.

Fluxo principal: birthday-check produz jobs -> api-core consome -> api-core chama api-simulation -> grava/atua conforme regra (nesta base, apenas loga o resultado).

## Estrutura de Pastas

- app/api-core: API principal (Fastify + BullMQ Worker + Prisma)
- app/api-simulation: API simuladora (Fastify + Zod)
- app/client: client React (Vite + TS)
- services/birthday-check: serviço produtor de jobs (BullMQ + Redis)
- packages/prisma: pacote Prisma compartilhado (schema, generate, migrations)
- docker-compose.yaml: infraestrutura (Postgres e Redis)
- pnpm-workspace.yaml: configuração de workspaces
- tsconfig.base.json: base do TypeScript
- .npmrc, .gitignore, etc.

## Variáveis de Ambiente

Padrão: cada app/serviço possui seu próprio .env no diretório do respectivo workspace. Como combinado, o .env será comitado neste projeto (normalmente não se comita em produção).

Exemplos (ajuste se necessário):

Raiz (.env para referência e uso em compose se desejar)

- POSTGRES_DB=beuni
- POSTGRES_USER=beuni
- POSTGRES_PASSWORD=beuni
- POSTGRES_PORT=5433
- POSTGRES_HOST=localhost
- DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public
- REDIS_HOST=localhost
- REDIS_PORT=6379
- REDIS_URL=redis://${REDIS_HOST}:${REDIS_PORT}
- API_CORE_PORT=3001
- API_CORE_HOST=0.0.0.0
- API_SIM_PORT=3002
- API_SIM_HOST=0.0.0.0
- BIRTHDAY_CHECK_CONCURRENCY=5
- BIRTHDAY_QUEUE_NAME=birthday-queue
- VITE_API_CORE_URL=http://localhost:3001

app/api-core/.env

- API_CORE_PORT=3001
- API_CORE_HOST=0.0.0.0
- DATABASE_URL=postgresql://beuni:beuni@localhost:5433/beuni?schema=public
- REDIS_URL=redis://localhost:6379
- API_SIM_BASE_URL=http://localhost:3002
- BIRTHDAY_QUEUE_NAME=birthday-queue

app/api-simulation/.env

- API_SIM_PORT=3002
- API_SIM_HOST=0.0.0.0

services/birthday-check/.env

- REDIS_URL=redis://localhost:6379
- BIRTHDAY_QUEUE_NAME=birthday-queue
- BIRTHDAY_CHECK_CONCURRENCY=5

app/client/.env

- VITE_API_CORE_URL=http://localhost:3001

Nota sobre Docker Compose: dentro da rede do compose, use hosts postgres, redis e api-simulation, e portas internas (ex.: 5432 para postgres). Como pausamos Dockerfiles de apps, a execução das APIs permanece local (pnpm dev), e o compose serve apenas infraestrutura.

## Como Rodar (Desenvolvimento)

1. Instale dependências do monorepo:

- pnpm install

2. Suba infraestrutura (Postgres e Redis) via Docker:

- pnpm compose:up
- Ver logs e status:
  - pnpm compose:ps
  - pnpm compose:logs

3. Prepare .envs dos apps (já estão comitados; ajuste se necessário).

4. Rode todos os serviços/apps em paralelo:

- pnpm add -D concurrently -w (apenas uma vez, se ainda não tiver)
- pnpm dev:all

Serviços expostos:

- api-core: http://localhost:3001/health
- api-simulation: http://localhost:3002/ship (POST) e http://localhost:3002/health
- client (Vite): http://localhost:5173
- Redis e Postgres sob containers (ver compose).

Comandos individuais (úteis):

- pnpm dev:api-core
- pnpm dev:api-simulation
- pnpm dev:birthday-check
- pnpm dev:client

5. Prisma (quando necessário)

- Gerar client: pnpm prisma:generate
- Migrations: pnpm prisma:migrate
- Push: pnpm prisma:push

Esses scripts atuam no pacote packages/prisma.

## Scripts Úteis

No package.json da raiz:

- dev:api-core, dev:api-simulation, dev:birthday-check, dev:client — ambiente dev de cada workspace.
- dev:all — sobe tudo em paralelo (usa concurrently).
- build — build recursivo (tsc, etc.).
- build:packages — build do pacote Prisma, se aplicável.
- build:apps — build dos apps (APIs e services).
- build:all — build:packages + build:apps.
- typecheck — tsc recursivo (sem emitir).
- lint — ESLint recursivo.
- format — Prettier.

Infra (Docker Compose):

- compose:up — sobe Postgres e Redis.
- compose:down — derruba tudo.
- compose:logs — logs seguidos.
- compose:ps — status.

## Padrões de Código e Tipagem

- TypeScript em todos os workspaces, com tsconfig.base.json compartilhado.
- ESLint com presets básicos (eslint, plugin import, n, promise, prettier).
- Prettier para formatação.
- Zod para validação de entrada nas APIs.
- BullMQ com generics tipados para Queue/Worker/Processor.
- Fetch nativo em Node 20 para chamadas HTTP da api-core à api-simulation.

## Convenções de Pastas (APIs)

- src/server.ts: criação/configuração do Fastify.
- src/index.ts: bootstrap (dotenv, listen).
- src/routes/\*: rotas específicas (ex.: health, ship).
- src/queue/\*: integração BullMQ (worker, types) no api-core.
- src/clients/\*: clientes HTTP (ex.: clients/simulation).
- packages/prisma: schema.prisma, scripts de generate e migrate.

## Endpoints

api-core:

- GET /health — status básico do serviço.
- (Worker) consome fila e chama api-simulation/ship.

api-simulation:

- GET /health — status.
- POST /ship — body:
  - orderId, recipientName, address, postalCode, city, state, country (strings)
  - scheduledDate?: ISO string
  - simulateError?: boolean
  - Respostas:
    - 200 ok: { ok: true, status: "shipped", trackingId, provider, scheduledDate }
    - 500 erro simulado: { ok: false, error: "SHIP_FAILED", message }

## Fila (BullMQ/Redis)

- queue: nome configurável via BIRTHDAY_QUEUE_NAME (padrão birthday-queue).
- producer: services/birthday-check enfileira periodicamente.
- consumer: api-core worker processa. O job é tipado (ex.: BirthdayJobData) e, por ora, apenas loga e chama /ship.

## Desenvolvimento e DX

- Cada app tem seu próprio .env local (padrão adotado), carregado via dotenv.
- pnpm workspaces garantem installs rápidos e cache eficientes.
- concurrently facilita subir tudo em paralelo.
- Logs das APIs com Fastify logger.

## Testes (Sugerido/Futuro)

- Integração com Vitest/Jest (não incluso na base).
- Testes de rota com supertest/light-my-request.
- Testes do worker simulando job e mockando fetch da api-simulation.

## Docker (Status)

- Infraestrutura (Postgres/Redis) roda via docker-compose.
- Dockerfile dos apps (api-core, api-simulation, birthday-check) foi explorado, mas optamos por focar no fluxo dev local primeiro. Quando retomar:
  - Build em multi-stage.
  - Geração do Prisma client no pacote packages/prisma durante o build.
  - Uso de env_file por app no compose.
  - Hosts internos (postgres, redis, api-simulation) na rede do compose.

## Roadmap (Próximos Passos)

- Persistir eventos/processamentos no Postgres (via Prisma).
- Melhorar robustez do client HTTP (timeout com AbortController, retries).
- Métricas básicas de fila (endpoint /queue/metrics no api-core).
- Seeds de dados com Prisma.
- Dockerizar apps com uma estratégia estável e reprodutível.
- Testes automatizados.

## Como Contribuir

- Crie uma branch feature/nome-da-feature.
- Rode pnpm typecheck e pnpm lint antes de abrir PR.
- Commits limpos e descritivos. (Opcional: adicionar Husky + lint-staged para pre-commit.)

## Licença

Uso interno para o desafio técnico da Beuni Tecnologia. Ajuste conforme necessário.

Qualquer ponto que queira detalhar mais (ex.: adicionar exemplos de requests cURL, explicar migrations, ou colocar diagramas), me diga que eu incremento o README.

# Resumo da Implementação

Este documento apresenta a solução desenvolvida para o **Desafio Técnico – Desenvolvedor Full Stack** da Beuni Tecnologia. O objetivo foi criar um MVP de sistema para gerenciamento automático de brindes a colaboradores aniversariantes, com ênfase em escalabilidade, resiliência e boa experiência técnica.

---

## 1. Visão Geral

- **Objetivo**  
  Garantir o envio de brindes personalizados com, no mínimo, **7 dias úteis de antecedência** ao aniversário do colaborador.

- **Abordagem**  
  Arquitetura baseada em jobs agendados, filas de mensagens e workers para processamento assíncrono.

---

## 2. Arquitetura da Solução

1. **API Principal (Fastify)**  
   Interface REST para:

   - Cadastro e autenticação de usuários
   - Registro e consulta de aniversariantes
   - Persistência do histórico de envios

2. **API de Simulação (NestJS)**  
   Serviço que emula o envio de brindes, retornando sucesso ou erro segundo uma taxa de falha configurável.

3. **Filas e Jobs (BullMQ + Redis)**

   - **Producer:** Serializa e publica eventos de aniversariantes na fila
   - **Consumer (Worker):** Consome eventos e dispara requisições HTTP à API de simulação
   - **Retries Automáticos:** Política de reenvio em caso de falhas intermitentes

4. **Banco de Dados (PostgreSQL)**  
   Armazena usuários, aniversariantes e registros de envio com histórico de status.

5. **Orquestração (Docker Compose)**  
   Contêineres isolados para desenvolvimento e produção, incluindo serviços de API, Redis e PostgreSQL.

---

## 3. Fluxo de Processamento

![System Design](https://imgur.com/a/qYBUkGL)

1. **Agendamento (Cron Job)**  
   Executado diariamente para identificar colaboradores com aniversário em 8 dias corridos (assegurando 7 dias úteis de antecedência).

2. **Enfileiramento de Eventos**  
   Dados dos aniversariantes são transformados em JSON e publicados na fila do BullMQ.

3. **Processamento Assíncrono (Worker)**  
   Cada evento dispara uma requisição HTTP para a API de simulação de envio de brindes.

4. **Tratamento de Falhas**  
   A API de simulação pode responder com erro. O BullMQ aplica tentativas automáticas de reenvio conforme configuração de backoff.

5. **Persistência de Resultados**  
   Em caso de sucesso, o status é registrado no PostgreSQL, garantindo rastreabilidade completa.

---

## 4. Tecnologias Utilizadas

| Camada         | Tecnologia      |
| -------------- | --------------- |
| Backend (API)  | Fastify, NestJS |
| Filas e Jobs   | BullMQ, Redis   |
| Banco de Dados | PostgreSQL      |
| Orquestração   | Docker Compose  |
| Linguagem      | Node.js         |

---

## 5. Considerações Técnicas

- **Escalabilidade:**  
  Adição de workers horizontais sem impacto na API principal.

- **Resiliência:**  
  Retries automáticos evitam falhas pontuais e garantem maior taxa de sucesso.

- **Manutenibilidade:**  
  Código modular, organizado por responsabilidades, facilitando futuras extensões (suporte a múltiplas organizações, painel administrativo, testes automatizados etc.).

- **Observabilidade:**  
  Logs estruturados e métricas básicas para auditoria e debugging.

---

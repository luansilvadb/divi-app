---
title: "Product Brief Distillate: divi-app"
type: llm-distillate
source: "product-brief-divi-app.md"
created: "2026-04-12"
purpose: "Token-efficient context for downstream PRD creation"
---

# Product Brief Distillate: divi-app

Este pacote de detalhes captura o contexto técnico e de negócio refinado durante a fase de descoberta, otimizado para o consumo em fluxos de criação de PRD (Product Requirements Document).

## Technical Context & Constraints

- **Arquitetura Local-First:** O Dexie (IndexedDB) é o banco de dados primário e mestre. O servidor (Supabase) atua como um repositório de sincronização e backup.
- **Sincronização (LWW):** Implementação de resolução de conflitos via *Last Write Wins* utilizando logs de transação no cliente.
- **Precisão Financeira:** Proibido o uso do tipo `number` para cálculos de saldo. Obrigatório o uso de inteiros (centavos) ou `BigInt` para evitar erros de ponto flutuante.
- **Criptografia E2EE (Futuro):** O compartilhamento familiar exigirá criptografia de ponta a ponta onde as chaves nunca deixam o dispositivo.
- **Busca Local:** Devido à criptografia futura, toda indexação e busca de dados sensíveis devem ser realizadas 100% no lado do cliente (Dexie).
- **Reatividade Híbrida:** Fluxos de dados complexos devem usar RxJS (`BehaviorSubject`) integrados ao Vue via VueUse. Proibido hooks de reatividade do Vue em camadas de lógica (`domain`/`application`).

## Requirements Hints

- **Smart Manual Entry:** A entrada de dados deve ser preditiva, sugerindo valores, categorias e contas com base no histórico local para reduzir o tempo de registro para < 3s.
- **Feedback de Sincronização:** A interface deve sinalizar claramente o estado da rede e pendências de sincronização usando `aria-live='polite'`.
- **Minimização de Dados:** Funcionalidades nativas de "Exportar Dados" (JSON/CSV) e "Apagar Conta" (limpeza local e remota) são requisitos de conformidade.
- **Performance:** Virtualização de listas é obrigatória para históricos extensos.

## Detailed User Scenarios

- **Cenário "Modo Avião":** O usuário registra um gasto durante um voo. O app persiste no Dexie instantaneamente e a UI mostra "Sincronização pendente". Ao pousar e recuperar o sinal, o `SyncEngine` detecta a rede e envia os dados para o Supabase em background.
- **Conflito Multi-dispositivo:** Usuário edita uma transação no celular e outra no tablet enquanto ambos estão offline. O sistema deve usar o timestamp do log de transação para resolver qual versão prevalece (LWW).

## Scope Signals (MVP)

- **IN:** Gestão de transações, carteiras, categorias, PWA, Dexie, Supabase (Auth + Sync), Relatórios básicos, Precisão em centavos.
- **OUT (V1):** Open Banking automático, Compartilhamento Familiar, Gráficos de Investimento complexos.

## Rejected Ideas

- **Auto-Sync Bancário Direto (V1):** Rejeitado em favor da privacidade absoluta e soberania de dados do modelo Local-First. Foco inicial em Importação Manual Inteligente.
- **Armazenamento de Senhas em Nuvem:** O app não deve, sob hipótese alguma, armazenar ou trafegar credenciais bancárias de terceiros.

## Competitive Intelligence (Market 2026)

- Tendência de mercado em direção à **Soberania de Dados** e **Local-First**.
- Apps concorrentes líderes (**SenticMoney**, **Pocket Clear**) estão abandonando agregadores de nuvem em favor de processamento local de IA.
- Diferencial do `divi-app`: Combinação de PWA (acesso em qualquer dispositivo) com a solidez da Clean Architecture para evitar obsolescência técnica.

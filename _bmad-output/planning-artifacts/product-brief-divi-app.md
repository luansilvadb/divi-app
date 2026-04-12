---
title: "Product Brief: divi-app"
status: "complete"
created: "2026-04-12"
updated: "2026-04-12"
inputs: ["package.json", "src/core/di.ts", "project-context.md"]
---

# Product Brief: divi-app

## Executive Summary

O **divi-app** é um aplicativo de finanças pessoais "Local-First" projetado para oferecer velocidade instantânea, privacidade absoluta e funcionamento total sem internet. Em um mercado saturado de soluções que dependem de nuvem e vendem dados de usuários, o divi-app inverte a lógica: seus dados financeiros residem primeiro no seu dispositivo e a sincronização é uma escolha de conveniência, não uma obrigação.

Construído como um PWA (Progressive Web App) de alta performance, o divi-app combina a robustez da Clean Architecture com a agilidade do Vue 3 e RxJS. Ele resolve a frustração de interfaces lentas e dependentes de conexão, oferecendo uma ferramenta que é tão rápida quanto abrir um bloco de notas, mas poderosa o suficiente para gerenciar toda a vida financeira com precisão matemática impecável.

## O Problema

Atualmente, o gerenciamento financeiro digital enfrenta três grandes barreiras:
1. **Dependência de Conexão:** Muitos apps são inúteis sem Wi-Fi ou sinal estável, frustrando o registro de gastos no momento em que ocorrem.
2. **Privacidade Comprometida:** Modelos de negócio baseados em nuvem frequentemente lucram com a análise e venda de metadados financeiros.
3. **Complexidade de Sincronização:** Agregadores bancários automáticos são frequentemente instáveis, exigindo re-autenticação constante e expondo senhas sensíveis a terceiros.

O usuário atual sente que não é dono dos seus dados e que a ferramenta de controle é um fardo, não um facilitador.

## A Solução

O divi-app propõe uma experiência **"Zero Friction"**:
- **Offline-First Nativo:** Armazenamento local via Dexie (IndexedDB) garante que o app abra e funcione instantaneamente em qualquer lugar.
- **Sincronização Pro:** Sincronização opcional e segura com Supabase para quem precisa de dados em múltiplos dispositivos, servindo também como backup criptografado automático.
- **Smart Manual Entry:** Redução drástica do atrito de entrada manual através de preenchimento preditivo baseado em IA local e padrões históricos de gastos.
- **Precisão Financeira:** Uso de cálculos em inteiros (centavos) para eliminar erros de arredondamento comuns em JavaScript.

## O Que Nos Torna Diferentes

O divi-app não é apenas mais um gerenciador financeiro; é um manifesto de **Soberania de Dados**:
- **Local-First por Design:** O banco de dados mestre está no dispositivo do usuário.
- **Performance Extrema:** Uso de RxJS para fluxos de dados reativos e virtualização de listas, permitindo lidar com anos de histórico sem lentidão.
- **Privacidade Radical:** Implementação rigorosa de Row Level Security (RLS) no Supabase e ferramentas integradas de exportação/limpeza de dados.

## Quem Servimos

- **Usuários Conscientes de Privacidade:** Pessoas que não querem seus hábitos de consumo analisados por grandes corporações.
- **Viajantes e Profissionais em Movimento:** Quem precisa registrar despesas em locais com conectividade instável.
- **Entusiastas de Finanças:** Usuários que buscam uma ferramenta técnica, precisa e que lhes dê controle total sobre a exportação de seus dados.

## Critérios de Sucesso

1. **Retenção de Usuários:** Medida pela frequência de uso (o app deve ser a ferramenta padrão para o dia a dia).
2. **Performance:** Tempo de carregamento inicial < 1s e interações < 100ms em modo offline.
3. **Confiança:** Zero relatos de perda de dados durante migrações de schema ou falhas de sincronização.
4. **Conversão Pro:** Adoção do serviço de sincronização Supabase como principal gerador de receita.

## Escopo (MVP)

- **In-Scope:**
  - Gerenciamento de Transações (Receitas/Despesas) e Categorias.
  - Múltiplas Carteiras/Contas.
  - Persistência local robusta com Dexie.
  - Sincronização opcional com Supabase (Auth + DB).
  - Relatórios básicos de fluxo de caixa e saldos.
  - Suporte total a PWA (Installable + Offline Assets).
- **Out-of-Scope:**
  - Conexão direta com bancos (Open Banking automático).
  - Compartilhamento de carteiras entre usuários (v1).
  - Análises avançadas de investimentos ou bolsa de valores.

## Visão

Em 2 anos, o divi-app será o ecossistema líder para **Finanças Local-First**, permitindo não apenas o controle individual, mas também o compartilhamento familiar com criptografia de ponta a ponta (E2EE) onde as chaves nunca deixam o dispositivo. Integrará processamento de IA local para categorização automática e previsões financeiras sem que nenhum dado sensível saia do dispositivo do usuário.
de ponta a ponta. Integrará processamento de IA local para categorização automática e previsões financeiras sem que nenhum dado sensível saia do dispositivo do usuário.

# ADR 001: Estratégia de Sincronização Local-First

**Status:** Proposto
**Data:** 2026-04-07
**Contexto:** A aplicação precisa ser responsiva, capaz de operar offline e lidar com dados financeiros pessoais com alta privacidade. Escolhemos Dexie (IndexedDB) e Supabase para este propósito.

## Decisão
Adotaremos uma abordagem "Local-First" onde todas as operações de leitura/escrita ocorrem primariamente contra o banco de dados local Dexie. Um serviço de sincronização em segundo plano lidará com o sync bidirecional com o backend Supabase.

### 1. Lógica de Fluxo de Dados
- **Escritas:** Sempre escrever no Dexie primeiro. Marcar o registro com uma flag `synced: false` e um timestamp `updated_at`.
- **Sincronização em Background:** Um worker ou serviço irá periodicamente (ou na restauração da rede) enviar as mudanças locais para o Supabase e buscar mudanças remotas baseadas no último timestamp de `synced_at`.
- **Leituras:** Os componentes consomem dados via stores Pinia que são populadas a partir do Dexie.

### 2. Resolução de Conflitos
- **Last Write Wins (LWW):** Baseado no timestamp `updated_at`.
- **Resolução Manual:** Para entidades financeiras críticas (ex: ajustes de saldo), podemos implementar um passo de reconciliação manual se conflitos forem detectados.

## Consequências

### Positivas
- **UI Instantânea:** Latência zero para interações do usuário.
- **Suporte Offline:** Funcionalidade total da aplicação sem conexão de internet.
- **Privacidade:** Os dados são armazenados localmente no dispositivo do usuário primeiro.

### Negativas
- **Complexidade:** Maior esforço de implementação para a lógica de sincronização.
- **Integridade de Dados:** Risco de estados fora de sincronia se não for manipulado meticulosamente.
- **Limites de Armazenamento:** O IndexedDB possui limites dependentes do dispositivo.

## Alternativas Rejeitadas
- **Direct-to-Cloud:** Descartado devido à latência e má experiência offline.
- **Apenas Supabase Realtime:** Descartado porque carece de uma camada de persistência local robusta para consultas complexas quando offline.

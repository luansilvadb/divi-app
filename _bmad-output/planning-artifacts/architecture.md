---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
workflowType: 'architecture'
lastStep: 8
status: 'complete'
completedAt: '2026-04-12'
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/product-brief-divi-app.md', '_bmad-output/planning-artifacts/ux-design-specification.md', '_bmad-output/project-context.md']
project_name: 'divi-app'
user_name: 'Luan'
date: '2026-04-12'
---

# Architecture Decision Document divi-app

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

---

## 2. Project Context Analysis

### Requirements Overview

**Functional Requirements:**
A arquitetura deve sustentar um ciclo de vida de dados soberano, permitindo a gestão de múltiplas carteiras e ativos em "Vaults" privados. O fluxo core exige entrada preditiva (Smart Entry) integrada a um motor de projeção futura (Forecast) e auditoria passiva de integridade via Checksums.

**Non-Functional Requirements:**
- **Privacidade Radical (E2EE):** Criptografia mandatória via Web Crypto API; o servidor atua como um transportador "cego".
- **Local-First / Latência Zero:** Resposta visual < 100ms para cálculos financeiros, tratando a rede como um acessório assíncrono.
- **Precisão Financeira:** Uso onipresente de BigInt para eliminar erros de arredondamento IEEE 754.
- **Resiliência Distribuída:** Resolução de conflitos determinística no cliente (CRDT/LWW) sem mediação do servidor.

---

## 3. Starter Template Evaluation

### Selected Starter: Official Vue Starter (`create-vue`)

**Rationale:** Estabilidade, suporte nativo ao Vite 7 e ecossistema Vitest para cobertura total.

---

## 4. Core Architectural Decisions

### 4.1 Data Architecture (Local-First)

- **Database Choice:** **Dexie.js (IndexedDB)**.
- **Sync Protocol:** **Last-Write-Wins (LWW) com OpLog** e **Relógios Lógicos (Lamport)**.

### 4.2 Authentication & Security (E2EE)

- **Encryption Standard:** **AES-GCM 256-bit** via **Web Crypto API**.
- **Key Strategy:** Derivação de chaves via **PBKDF2** a partir da senha do usuário. As chaves residem exclusivamente no cliente.
- **Vault Interceptor:** Implementação do padrão **Repository** (`VaultRepository`) que intercepta persistência para cifragem transparente.
- **Memory Safety:** Uso de **Decrypted In-Memory State** no Pinia para fluidez, protegido por uma **CSP (Content Security Policy)** agressiva e limpeza automática de memória.

### 4.3 Engine de Performance (Forecast)

- **Compute Strategy:** **Dedicated Web Workers** para isolar a matemática financeira da UI Thread.
- **Data Precision:** **BigInt Adapter** onipresente.

---

## 5. Implementation Patterns & Consistency Rules

### 5.1 Naming & Organization

- **Code:** **camelCase** para funções/variáveis; **PascalCase** para classes e componentes Vue (`SFC`).
- **Database:** **camelCase** para tabelas e colunas no Dexie.
- **Estrutura:** Adoção de **Feature-Sliced Design (FSD)** em `src/modules`.

### 5.2 BigInt Strategy (Money)

- **Armazenamento:** Tipo **BIGINT** nativo no IndexedDB.
- **Transporte:** Serialização para **String** em payloads JSON/Sync.
- **Cálculos:** Conversão imediata para BigInt no frontend.

---

## 6. Project Structure & Boundaries

### Complete Project Directory Structure

```
divi-app/
├── src/
│   ├── infrastructure/     # Porteiro da Soberania (DB, Crypto, Sync, Workers)
│   ├── modules/            # Fatias de Negócio (Vault, Ledger, Forecast)
│   ├── shared/             # Utils (BigInt Adapter), UI Base, Types
│   └── router/             # Vue Router
├── tests/                  # Testes integrados e de sistema
└── uno.config.ts           # Design Tokens
```

---

## 7. Architecture Validation Results

### Coherence Validation ✅
A arquitetura é coerente, unindo reatividade moderna (Vue 3/Pinia) com robustez de baixa camada (Web Crypto/IndexedDB). O isolamento via FSD garante que a complexidade do E2EE não vaze para os módulos de negócio.

### Requirements Coverage Validation ✅
Todos os requisitos do PRD e as metas de UX (Soberania, Velocidade e Integridade) possuem suporte arquitetural direto. O motor de Forecast e o Vault de Segurança são os pilares centrais validados.

### Security Hardening (CSP) ✅
Para proteger o estado descriptografado em memória, o sistema adotará uma política de **Content Security Policy (CSP)** agressiva:
- `script-src 'self'`: Bloqueio total de scripts inline e de terceiros não confiáveis.
- `connect-src 'self' [supabase-url]`: Restrição de conexões externas exclusivamente ao backend de sincronização.
- `worker-src 'self' blob:`: Proteção da integridade dos Web Workers.

### Implementation Readiness Validation ✅
A estrutura de pastas e os padrões de nomenclatura estão claros. O uso de BigInt e a comunicação via Workers possuem diretrizes técnicas de elite prontas para execução.

### Architecture Completeness Checklist
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Naming conventions established
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Security Policy (CSP) formalized

---

# ESPECIFICAÇÃO TÉCNICA EXAUSTIVA - v0.4.0
**Módulo:** A Dança dos Números (Epic 3)
**Autor:** Mente Brilhante Ω

## 1. VISÃO GERAL E ARQUITETURA
O objetivo desta especificação é definir a infraestrutura para inserção ultrarrápida de transações com categorização preditiva. A meta é criar uma experiência de usuário (UX) sem atrito, minimizando o tempo entre o pensamento do usuário e o registro da transação.

### Paradigma: UX sem atrito e Preditividade
A inserção de dados deve ser otimizada para o menor número de toques/cliques possível. A categorização deve ser assistida por heurísticas locais para prever a categoria com base no título/descrição da transação, mantendo o princípio Local-First sem depender de APIs externas lentas.

---

## 2. CATEGORIZAÇÃO PREDITIVA LOCAL

### 2.1 Serviço de Auto-Categorização (Domain/Application)
Implementar um serviço heurístico leve que analisa transações passadas do usuário e cria um mapa de predição (Title -> CategoryId).

```typescript
// Localização: src/modules/transactions/application/services/AutoCategorizationService.ts

export interface IAutoCategorizationService {
  /**
   * Treina o modelo heurístico com base no histórico de transações.
   */
  trainModel(transactions: Transaction[]): void;

  /**
   * Prevê a categoria mais provável para uma nova descrição.
   */
  predictCategory(description: string): string | undefined;
}
```

### 2.2 Heurística Sugerida
- Construir um dicionário simples na memória (ou armazenado no Dexie para persistência entre sessões) mapeando palavras-chave frequentes para IDs de categorias, ponderado pela frequência de uso.
- O treinamento do modelo pode ocorrer de forma assíncrona durante o carregamento inicial da aplicação ou via Web Worker para não bloquear a UI.

---

## 3. UI LAYER (UX Sem Atrito)

### 3.1 Modal/Formulário de Inserção Rápida (Quick Add)
O formulário de transação deve ser redesenhado (ou aprimorado) focado em velocidade.

- **Auto-Focus:** O campo de valor (amount) deve receber foco automaticamente ao abrir.
- **Teclado Numérico Nativo:** Usar `type="number"` com `inputmode="decimal"` para otimização mobile.
- **Predição em Tempo Real:** Ao digitar no campo descrição/título, o formulário deve consultar o `AutoCategorizationService` e pré-selecionar a categoria sugerida, destacando visualmente que é uma predição.
- **Botão de Ação Rápida (FAB):** Um botão flutuante acessível globalmente para adicionar transações.

### 3.2 BDD (Acceptance Criteria)

**Cenário: Predição de Categoria com base em histórico**
- DADO QUE o usuário possui transações anteriores onde "Uber" foi categorizado como "Transporte" (Id: cat-1)
- QUANDO o usuário abre o formulário de inserção rápida
- E digita "Uber" no campo de descrição
- ENTÃO o campo de categoria deve ser automaticamente preenchido com "Transporte"
- E um indicador visual (ex: ícone de varinha mágica) deve mostrar que foi auto-categorizado.

**Cenário: Inserção Rápida via Teclado**
- DADO QUE o usuário está no Desktop
- QUANDO ele pressiona um atalho global (ex: `Alt + N`)
- ENTÃO o modal de inserção rápida é aberto instantaneamente
- E o campo numérico está em foco pronto para digitação.
- QUANDO ele preenche os dados e pressiona `Enter`
- ENTÃO a transação é salva no Dexie e o modal é fechado.

---

## 4. INTEGRAÇÃO E CONCORRÊNCIA
- A lógica de inserção permanece a mesma definida na Epic 1, aproveitando o `TransactionRepositoryPort` (Dexie) e o `SyncEngine` (Supabase) configurados na Epic 2. As otimizações de UI e o serviço de predição atuam como uma camada adicional em cima da infraestrutura existente.

### 4.1 Diagrama de Sequência Textual:
1. Usuário foca no input de descrição no formulário "Quick Add".
2. Usuário digita "Uber" e UI dispara evento `onChange`.
3. Formulário chama `AutoCategorizationService.predictCategory("Uber")`.
4. Serviço busca nas heurísticas de treinamento em memória ou local storage.
5. Serviço retorna `categoryId: 'cat-1'` (Transporte).
6. UI reativamente preenche o campo "Categoria" e acende o ícone mágico.
7. Usuário preenche "Valor" e aperta `Enter`.
8. Formulário chama `transactionStore.saveTransaction({...})`.
9. Transação é salva localmente via Dexie e notificada para a UI que a transação foi concluída.

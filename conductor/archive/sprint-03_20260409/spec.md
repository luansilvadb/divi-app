# Especificação Técnica: Motor de Inserção Rápida e Predição

> Sprint: 03 | Versão: 0.3.0 | Épico: 03

## 1. Contexto e Motivação
A fricção no registro de gastos é o principal motivo de abandono de apps financeiros. O "divi" deve permitir que uma transação seja registrada com o mínimo de toques possível, antecipando as intenções do usuário através de dados históricos.

## 2. Contrato de Interface

### 2.1 Prediction Engine
```typescript
interface PredictionResult {
  categoryId: string;
  walletId: string;
  confidence: number; // 0 a 1
}

interface IPredictionService {
  predict(payeeId: string, amount: number): PredictionResult;
}
```

## 3. Fluxo de Execução
1. Usuário abre o modal de `QuickEntry`.
2. Foco automático no campo de `Valor`.
3. Usuário digita o valor e seleciona/digita o `Payee`.
4. Ao selecionar o `Payee`, o `PredictionEngine` é disparado.
5. `PredictionEngine` busca no histórico local (Dexie) a categoria mais provável para aquele `Payee`.
6. UI preenche visualmente a `Categoria` e `Carteira`, permitindo alteração com um toque.
7. Usuário clica em 'Salvar' (ou pressiona Enter).
8. Transação gravada no Dexie com `sync_status: 'pending'`.

## 4. Edge Cases
1. **Novo Payee:** Se o beneficiário nunca foi usado, o motor deve sugerir a categoria 'Geral' ou a última categoria usada globalmente.
2. **Valor Zero:** Bloquear salvamento se valor for 0.
3. **Múltiplas Categorias para o mesmo Payee:** Usar a categoria usada mais vezes nos últimos 30 dias para aquele beneficiário.

## 5. Cenários BDD

```gherkin
Feature: Inserção Rápida de Transações

  Scenario: Predição bem sucedida de categoria
    Given que eu frequentemente compro no "Starbucks" na categoria "Alimentação"
    When eu inicio uma nova transação e digito "Starbucks"
    Then o campo categoria deve ser automaticamente preenchido com "Alimentação"

  Scenario: Salvamento instantâneo via Enter
    Given que eu preenchi valor e beneficiário
    When eu pressiono a tecla "Enter"
    Then a transação deve ser salva no banco local imediatamente
    And o modal deve ser fechado com um feedback de sucesso
```

## 6. Critérios de Aceitação (DoD)
- [ ] Tempo de resposta do `predict()` < 20ms.
- [ ] O fluxo completo de inserção (abrir -> digitar -> salvar) deve ser possível em < 5 segundos.
- [ ] Suporte a atalhos de teclado (Esc para fechar, Enter para salvar).
- [ ] Feedback visual de "transação salva" (Toast ou micro-animação).

## 7. Notas de Implementação
- Utilizar `watch` do Vue no campo `payeeId` para disparar a predição.
- O `PredictionService` deve ser um Singleton injetado via DI.
